const Task = require('../models/task')

const getTasks = async (req, res) => {
  const user = req.currentUser
  let match = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  await user.populate({
    path: 'tasks', match, options: {
      limit: Number.parseInt(req.query.limit),
      skip: Number.parseInt(req.query.skip)
    }
  }).execPopulate()
  res.send(user.tasks)
}

const getTaskById = async (req, res) => {
  const id = req.params.id
  const owner = req.currentUser._id
  try {
    const task = await Task.findOne({ "_id": id, "owner": owner })
    if (!task) {
      res.status(404).send('Task NOT FOUND')
    }
    res.send(task)
  } catch (error) {
    res.status(500).send()
  }

}

const createTask = async (req, res) => {
  const newTask = new Task({
    ...req.body,
    owner: req.currentUser._id
  })
  try {
    const result = await newTask.save()
    res.status(201).send(result)
  } catch (error) {
    res.status(400).send(error)
  }

}

module.exports = {
  getTasks,
  getTaskById,
  createTask
}