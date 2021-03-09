import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, query, validationResult } from 'express-validator'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"

interface JWTPayload {
  username: string;
  password: string;
}

interface User{
  username:string,
  password:string,
  firstname:string,
  lastname:string,
  balance:number
}
const users:User[] = [];

app.post('/login',
  (req, res) => {

    const { username, password } = req.body
    // Use username and password to create token.
    const token = jwt.sign({username,password},SECRET)
    const AEuser = users.find(user => user.username === username)
    if(!AEuser){
      return res.status(400).json({
        message: 'Invalid username or password'
      })
    }
    if(AEuser.password !== password){
      return res.status(400).json({
        message: 'Invalid username or password'
      })
    }
    return res.status(200).json({
      message: 'Login succesfully',
      token: token
    })
  })

app.post('/register',
  (req, res) => {

    const { username, password, firstname, lastname, balance } = req.body
    const user = {username, password, firstname, lastname, balance}
    //already exist
    const AEuser = users.find(user => user.username === username)
    if(AEuser){
      res.status(400)
      res.json({
      message: "Username is already in used"
    })
    return
    }
    //pass
    users.push(user)
    res.status(200)
    res.json({
      message: "Register successfully"
    })
    return
  })

app.get('/balance',
  (req, res) => {
    const token = req.query.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
      const AEuser = users.find(user => user.username === username)
      res.status(200)
      res.json({
        "name": username,
        "balance": AEuser?.balance
      })
    }
    catch (e) {
      //response in case of invalid token
      res.status(401)
      res.json({
          message: "Invalid token"
      })
      return
    }
  })

app.post('/deposit',
  body('amount').isInt({ min: 1 }),
  (req, res) => {

    //Is amount <= 0 ?
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })
  })

app.post('/withdraw',
  (req, res) => {
  })

app.delete('/reset', (req, res) => {

  //code your database reset here
  
  return res.status(200).json({
    message: 'Reset database successfully'
  })
})

app.get('/me', (req, res) => {
  
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))