import pool from '../../config/database.js'

export async function getAllUsers() {
  const { rows } = await pool.query(`
    SELECT 
      users.id,
      users.provider,
      user_details.name,
      user_details.email, 
      users.created_at
    FROM users
    LEFT JOIN user_details
    ON users.id = user_details.user_id
    ORDER BY users.created_at DESC
  `)
  return rows
}


export async function getAllSubmissions() {
  const { rows } = await pool.query(`
    SELECT 
      submissions.id,
      problems.title AS problem_title,
      user_details.name AS user_name,
      submissions.language, 
      submissions.status,
      submissions.submitted_at
    FROM submissions
    LEFT JOIN user_details ON user_details.user_id = submissions.user_id
    LEFT JOIN problems ON problems.id = submissions.problem_id;
  `)
  return rows
}

export async function getAllProblemsAndTestCases() {
  const { rows } = await pool.query(`
    SELECT 
      problems.*,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', problem_test_cases.id,
          'test_input', problem_test_cases.test_input,
          'expected_output', problem_test_cases.expected_output,
          'field_name', problem_test_cases.field_name
        )
      ) AS test_cases
    FROM problems
    LEFT JOIN problem_test_cases
      ON problems.id = problem_test_cases.problem_id
    GROUP BY problems.id
    ORDER BY problems.id ASC
  `)
  return rows
}

export async function updateProblemData(problem) {
  const { rows } = await pool.query(`
    UPDATE problems
    SET
      title = $1,
      problem_statement = $2,
      difficulty = $3,
      input = $4,
      output = $5,
      memory_limit = $6,
      time_limit = $7,
      io_mode = $8,
      database = $9,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $10;
  `,
  [
    problem.title,
    problem.problem_statement,
    problem.difficulty,
    problem.input,
    problem.output,
    problem.memory_limit,
    problem.time_limit,
    problem.io_mode,
    problem.database,
    problem.id
  ]
  )
  console.log(rows)
  return rows
}