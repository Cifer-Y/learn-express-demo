const mongoose = require('mongoose')

const taskSchemaProperties = {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}

const taskSchema = mongoose.Schema(taskSchemaProperties, { timestamps: true })


const Task = mongoose.model('Task', taskSchema)

module.exports = Task