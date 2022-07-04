const express = require('express')
const app = express()
const config = require('config')
const path = require('path')
const { Server } = require('socket.io')
const ParkingRouter = require('./controllers/Parking')


const PORT = config.get('port')

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'public'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/parking', ParkingRouter)

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/dashboard', (req, res)=>{
    res.render('dashboard')
})

const server = app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:"+PORT],
      methods: ["GET", "POST"],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'token'],
      credentials: true
    },
    allowEIO3: true
  })

app.io = io;
io.on("connection",(socket)=>{
	console.log(socket.id+' is connecting')
    socket.on("disconnect",()=>{
		console.log(socket.id+' is disconnected')
	})

    socket.on("dashboard",(data)=>{
		io.emit("dashboard", data)
	})
})