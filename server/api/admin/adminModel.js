import pool from '../../config/database.js'


export async function getUsers() {
  const { rows } = await pool.query(`
  SELECT * FROM 
  `)
}
