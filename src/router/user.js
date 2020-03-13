const express = require('express')
const UserController = require('../controllers/user')
const { authMiddleware } = require('../middlewares/auth')

const router = new express.Router()

router.get('/users/me', authMiddleware, UserController.getCurrentUser)

router.get('/users/:id', authMiddleware, UserController.getUserById)

router.post('/users', UserController.createUser)
router.post('/users/login', UserController.userLogin)
router.post('/users/logout', authMiddleware, UserController.userLogout)
router.post('/users/logoutAll', authMiddleware, UserController.userLogoutAll)

module.exports = router