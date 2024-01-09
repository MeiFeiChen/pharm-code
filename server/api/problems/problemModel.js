import pool from '../../config/database.js'

/* ---- Problems ---- */
export async function getProblems() {
  const { rows } = await pool.query(`
    SELECT 
      problems.*,
      problems_pass_rate.successful_submissions,
      problems_pass_rate.total_submissions,
      problems_pass_rate.pass_rate
    FROM 
      problems
    LEFT JOIN 
      (
        SELECT 
        problem_id,
        COUNT(CASE WHEN status = 'AC' THEN 1 END) as successful_submissions,
        COUNT(CASE WHEN status IN ('AC', 'WA', 'TLE', 'RE') THEN 1 END) as total_submissions,
        COALESCE(
            COUNT(CASE WHEN status = 'AC' THEN 1 END)::decimal / COUNT(CASE WHEN status IN ('AC', 'WA', 'TLE', 'RE') THEN 1 END),
            0
        ) as pass_rate
        FROM submissions
        GROUP BY problem_id
      ) AS problems_pass_rate 
    ON 
      problems_pass_rate.problem_id = problems.id
    ORDER BY problems.id ASC
  `)
  return rows
}

/* ---- Problem ---- */
export async function getProblem(problemId) {
  const { rows } = await pool.query(`
  SELECT 
    sub.* 
  FROM (
    SELECT 
      problems.*,
      LAG(id) OVER (ORDER BY id) AS last_problem_id,
      LEAD(id) OVER (ORDER BY id) AS next_problem_id
    FROM 
      problems
  ) AS sub
  WHERE 
    sub.id = $1;
  `, [problemId])
  const problem = rows[0]
  return problem
}

/* ---- Submit & Submission ---- */
export async function createSubmission(userId, problemId, language, status, code) {
  const { rows } = await pool.query(`
    INSERT INTO submissions(problem_id, user_id, language, status, code)
    VALUES ($1, $2, $3, $4, $5) returning id
    `, [problemId, userId, language, status, code])
  const submittedId = rows[0].id
  return submittedId
}

export async function getProblemBySubmittedId(submittedId) {
  const { rows } = await pool.query(`
    SELECT problems.* FROM problems
    JOIN submissions ON submissions.problem_id = problems.id
    WHERE submissions.id = $1;
  `, [submittedId])
  const problem = rows[0]
  return problem
}

export async function getTestCases(problemId, fieldName) {
  const { rows } = await pool.query(`
    SELECT test_input, expected_output FROM problem_test_cases
    WHERE problem_id = $1 AND field_name = $2;
  `, [problemId, fieldName])
  return rows
}

export async function createAcSubmission(submittedId, result, language, runTime, memory) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(`
        UPDATE submissions
        SET status = $1
        WHERE id = $2
    `, [result, submittedId])
    await client.query(`
      INSERT INTO ac_results(submission_id, language, runtime, memory)
      VALUES ($1, $2, $3, $4)
    `, [submittedId, language, runTime, memory])
    await client.query('COMMIT')
    console.log(`submitted ID ${submittedId}: successfully updated status and inserted the accepted result`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function createWaReSubmission(submittedId, result, error) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const errorJson = JSON.stringify(error)
    await client.query(`
        UPDATE submissions
        SET status = $1
        WHERE id = $2
    `, [result, submittedId])
    await client.query(`
      INSERT INTO wa_re_results(submission_id, error)
      VALUES ($1, $2)
    `, [submittedId, errorJson])
    await client.query('COMMIT')
    console.log(`submitted ID ${submittedId}: successfully updated status and inserted the WA/RE result`)
  } catch (err) {
    console.log(err)
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function getSubmissionResult(submittedId, problemId, userId) {
  const { rows } = await pool.query(`
    SELECT 
      submissions.*,
      ac_results.memory,
      ac_results.runtime,
      wa_re_results.error
    FROM submissions
    LEFT JOIN ac_results ON submissions.id = ac_results.submission_id
    LEFT JOIN wa_re_results ON submissions.id = wa_re_results.submission_id
    WHERE submissions.id = $1 AND submissions.problem_id = $2 AND submissions.user_id = $3
  `, [submittedId, problemId, userId])
  const result = rows[0]
  if (result.status !== 'AC') return { ...result, percentage: {} }
  const data = await pool.query(`
    WITH RankedSubmissions AS (
      SELECT
        submission_id,
        runtime,
        memory,
        RANK() OVER (ORDER BY runtime) AS runtime_rank,
        RANK() OVER (ORDER BY memory) AS memory_rank,
        COUNT(*) OVER () AS total_submissions
      FROM
        ac_results 
      WHERE language = $1
    )
    SELECT
      submission_id,
      runtime_rank,
      memory_rank,
      (1 - runtime_rank::float / total_submissions) * 100 AS runtime_rank_ratio_percentage,
      (1 - memory_rank::float / total_submissions) * 100 AS memory_rank_ratio_percentage
    FROM
      RankedSubmissions
    WHERE
      submission_id = $2   
  `, [result.language, submittedId])
  const {
    runtime_rank_ratio_percentage: runtimeRankRatio,
    memory_rank_ratio_percentage: memoryRankRatio
  } = data.rows[0]
  return { ...result, percentage: { runtimeRankRatio, memoryRankRatio } }
}

export async function getSubmissionsResults(problemId, userId) {
  const { rows } = await pool.query(`
    SELECT 
      submissions.*,
      ac_results.memory,
      ac_results.runtime,
      wa_re_results.error
    FROM submissions
    LEFT JOIN ac_results ON submissions.id = ac_results.submission_id
    LEFT JOIN wa_re_results ON submissions.id = wa_re_results.submission_id
    WHERE submissions.problem_id = $1 AND submissions.user_id = $2
    ORDER BY submissions.id DESC;
  `, [problemId, userId])
  return rows
}

/* ---- Discussion ---- */

export async function getPosts(problemId) {
  const { rows } = await pool.query(`
  SELECT
    posts.id AS post_id,
    user_details.name,
    posts.problem_id,
    posts.title,
    posts.content,
    posts.created_at AS post_created_at,
    posts.updated_at AS post_updated_at,
    COUNT(messages.id) AS message_count
  FROM
    posts
  LEFT JOIN
    messages ON posts.id = messages.post_id
  LEFT JOIN
    user_details ON posts.user_id = user_details.user_id
  WHERE posts.problem_id = $1
  GROUP BY 
    posts.id, user_details.name, posts.problem_id, posts.title, posts.content, posts.created_at, posts.updated_at
  ORDER BY post_created_at DESC
  `, [problemId])
  return rows
}

export async function createPost(problemId, userId, title, content) {
  const { rows } = await pool.query(`
    INSERT INTO posts(problem_id, user_id, title, content)
    VALUES ($1, $2, $3, $4) returning id
  `, [problemId, userId, title, content])
  const result = rows[0]
  return result
}
export async function getSinglePost(problemId, postId) {
  const { rows } = await pool.query(`
    SELECT
      posts.id AS post_id,
      user_details.name,
      posts.problem_id,
      posts.title,
      posts.content,
      posts.created_at AS post_created_at,
      posts.updated_at AS post_updated_at
    FROM
      posts
    LEFT JOIN
      user_details ON posts.user_id = user_details.user_id
    WHERE posts.problem_id = $1 AND posts.id = $2
  `, [problemId, postId])
  const data = rows[0]
  return data
}

export async function getMessages(problemId, postId) {
  const { rows } = await pool.query(`
    SELECT 
      user_details.name,
      messages.* 
    FROM messages
    LEFT JOIN user_details
    ON messages.user_id = user_details.user_id
    WHERE problem_id = $1 AND post_id = $2
    ORDER BY messages.created_at DESC
  `, [problemId, postId])
  return rows
}

export async function createMessage(problemId, userId, postId, content) {
  const { rows } = await pool.query(`
    INSERT INTO messages(problem_id, post_id, user_id, content)
    VALUES ($1, $2, $3, $4) returning *
  `, [problemId, postId, userId, content])
  const data = rows[0]
  return data
}

export async function getUserName(userId) {
  const { rows } = await pool.query(`
    SELECT name FROM user_details
    WHERE user_id = $1
  `, [userId])
  const { name } = rows[0]
  return name
}
