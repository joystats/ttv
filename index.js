const express = require('express')
const app = express()
const config = require('config')
const path = require('path')
const ParkingRouter = require('./controllers/Parking')

const PORT = config.get('port')

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'public'))

app.use('/parking', ParkingRouter)

app.get('/', (req, res)=>{
    res.render('index')
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})