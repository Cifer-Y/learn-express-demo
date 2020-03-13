const express = require('express')
require('./db/mongoose')

const UserRoutes = require('./router/user')
const TaskRoutes = require('./router/task')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(UserRoutes)
app.use(TaskRoutes)


app.listen(port, () => {
  console.log(`Serving: http://localhost:${port}`);
})