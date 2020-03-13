const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const userSchemaProperties = {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('illegal email address')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('age must be positive')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'at least 8 chars'],
    trim: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}
const userSchema = mongoose.Schema(userSchemaProperties, { timestamps: true })

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.genToken = async function () {
  const user = this
  const token = jsonwebtoken.sign({ _id: user._id.toString() }, 'taskmanager', { 'expiresIn': '7 days' })
  user.tokens.push({ token })
  await user.save()
  return token
}

userSchema.methods.toJSON = function () {
  const userObj = this.toObject()
  delete userObj.password
  delete userObj.tokens

  return userObj
}

userSchema.statics.findByPwdAuth = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Login Error')
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error('Login Error')
  }
  return user
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User