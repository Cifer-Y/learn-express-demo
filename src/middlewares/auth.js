const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '')
    const decoded = jwt.verify(token, 'taskmanager')
    const user = await User.findOne({ '_id': decoded._id, 'tokens.token': token })
    if (!user) {
      throw new Error()
    }
    req.token = token;
    req.currentUser = user;
    next()
  } catch (error) {
    res.status(401).send('Unauthorized')
  }

}

module.exports = {
  authMiddleware
}