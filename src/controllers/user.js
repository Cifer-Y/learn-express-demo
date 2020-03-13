const User = require('../models/user')

const getCurrentUser = async (req, res) => {
  res.send(req.currentUser)
}

const getUserById = async (req, res) => {
  const id = req.params.id


  try {
    const user = req.currentUser;
    if (id !== user._id.toString()) {
      throw new Error()
    }
    res.send(user)
  } catch (error) {
    res.status(404).send('User NOT FOUND')
  }

}

const createUser = async (req, res) => {
  const newUser = new User(req.body)
  try {
    const result = await newUser.save()
    const token = await result.genToken()
    res.status(201).send({ result, token })
  } catch (error) {
    res.status(400).send(error)
  }

}

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findByPwdAuth(email, password)
    const token = await user.genToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send('invalid email/password')
  }

}

const userLogout = async (req, res) => {
  const token = req.token
  const currentUser = req.currentUser
  currentUser.tokens = currentUser.tokens.filter(t => t.token !== token)
  try {
    await currentUser.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }

}

const userLogoutAll = async (req, res) => {
  const currentUser = req.currentUser
  currentUser.tokens = []
  try {
    await currentUser.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }

}

module.exports = {
  getCurrentUser,
  getUserById,
  createUser,
  userLogin,
  userLogout,
  userLogoutAll
}