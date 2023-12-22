import jwt from 'jsonwebtoken'

const { JWT_ACCESS_TOKEN } = process.env

function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_ACCESS_TOKEN, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

const verifyAuth = async (req, res, next) => {
  const tokenInHeaders = req.get('Authorization')
  const token = tokenInHeaders?.replace('Bearer ', '') || req.cookies?.jwtToken;
  if (!token) {
    return res.status(401).json({ errors: 'invalid token' })
  }
  try {
    const decoded = await verifyJWT(token)
    res.locals.userId = decoded.userId
  } catch (err) {
    return res.status(401).json({ errors: `Invalid token: ${err.message}` })
  }
  return next()
}

export default verifyAuth
