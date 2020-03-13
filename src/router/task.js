const express = require('express')

const router = new express.Router()

const { authMiddleware } = require('../middlewares/auth')

const TaskController = require('../controllers/task')

router.get('/tasks', authMiddleware, TaskController.getTasks)

router.get('/tasks/:id', authMiddleware, TaskController.getTaskById)

router.post('/tasks', authMiddleware, TaskController.createTask)

module.exports = router