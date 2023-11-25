import pool from '../../config/database.js'

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
        COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_submissions,
        COUNT(CASE WHEN status IN ('success', 'failed') THEN 1 END) as total_submissions,
        COALESCE(
            COUNT(CASE WHEN status = 'success' THEN 1 END)::decimal / COUNT(CASE WHEN status IN ('success', 'failed') THEN 1 END),
            0
        ) as pass_rate
        FROM submissions
        GROUP BY problem_id
      ) AS problems_pass_rate 
    ON 
      problems_pass_rate.problem_id = problems.id
  `)
  return rows
}

export async function getProblem(problemId) {
  const { rows } = await pool.query(`
    SELECT * FROM problems
    WHERE id = $1
  `, [problemId])
  const problem = rows[0]
  return problem
}

export async function createSubmission(problemId, userId, language, status, code) {
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
  const testCases = rows
  return testCases
}

export async function createSubmissionsResult(submittedId, result, runtime, memory, error) {
  const client = await pool.connect()
  // update submission
  try {
    await client.query('BEGIN')
    const status = (result === 'AC') ? 'success' : 'failed'
    await client.query(`
      UPDATE submissions
      SET status = $1
      WHERE id = $2
    `, [status, submittedId])
    await client.query(`
      INSERT INTO submission_results(submission_id, result, runtime, memory, error)
      VALUES ($1, $2, $3, $4, $5)
    `, [submittedId, result, runtime, memory, error])
    await client.query('COMMIT')
    console.log('successfully inserted the submission result')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release();
  }
}

export async function getSubmissionResult(submittedId, problemId, userId) {
  const { rows } = await pool.query(`
    SELECT 
      submissions.*,  
      submission_results.result, 
      submission_results.runtime, 
      submission_results.memory,
      submission_results.error
    FROM submissions
    LEFT JOIN submission_results
    ON submissions.id = submission_results.submission_id
    WHERE submissions.id = $1 AND problem_id = $2 AND user_id = $3
  `, [submittedId, problemId, userId])
  const result = rows[0]
  return result
}

export async function getSubmissionsResults(problemId, userId) {
  const { rows } = await pool.query(`
    SELECT 
      submissions.*,  
      submission_results.result, 
      submission_results.runtime, 
      submission_results.memory, 
      submission_results.error
      FROM submissions
    JOIN submission_results
    ON submissions.id = submission_results.submission_id
    WHERE problem_id = $1 AND user_id = $2
    ORDER BY submissions.submitted_at DESC
  `, [problemId, userId])
  const results = rows
  return results
}
