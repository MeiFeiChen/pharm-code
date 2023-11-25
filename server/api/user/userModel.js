
import pool from '../../config/database.js'

export const PROVIDER = {
  NATIVE: 'native',
  GITHUB: 'github',
  GOOGLE: 'google'
}

export async function createUser(provider, name, email, token) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(`
      INSERT INTO users(identifier, provider, token)
      VALUES ($1, $2, $3) returning id
    `, [email, provider, token])
    const userId = rows[0].id
    await client.query(`
      INSERT INTO user_details(user_id, name, email)
      VALUES ($1, $2, $3)
    `, [userId, name, email])
    await client.query('COMMIT')
    console.log('successfully inserted the createUser result')
    return userId
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function findUser(identifier) {
  const { rows } = await pool.query(`
    SELECT 
      users.*,  
      user_details.name,
      user_details.email,
      user_details.picture
    FROM users
    LEFT JOIN user_details
    ON users.id = user_details.user_id
    WHERE identifier = $1
  `, [identifier])
  const user = rows[0]
  return user
}

export async function getSubmissionsByUserId(userId) {
  const { rows } = await pool.query(`
    SELECT problem_id, TO_JSON(ARRAY_AGG(status)) AS statuses
    FROM (
        SELECT problem_id, status
        FROM submissions
        WHERE user_id = $1 AND status <> 'pending'
        GROUP BY problem_id, status
    ) AS queries
    GROUP BY problem_id
  `, [userId])
  return rows
}

export async function getProfile(userId) {
  const { rows } = await pool.query(`
    SELECT * FROM user_details
    WHERE user_id = $1
  `, [userId])
  const profile = rows[0]
  return profile
}