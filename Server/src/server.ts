import express from "express"

const app = express()

app.get('/', (req, res)=>{
  res.send('Server is running fine on website')
})

export default app