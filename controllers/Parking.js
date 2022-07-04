const Router = require('express').Router()
const { createParkingLot, getSlot, getNextSlot, createSlot, checkIn, checkOut, getSlotStatus, 
    getPlateNumber, getSlotNumber, getCarInPark, getHistory, reservedSlot, activatedSlot } = require('../models/ParkingModel')

Router.get('/', (req, res)=>{
    createParkingLot()
    res.json({
        path: '/parking'
    })
})

Router.get('/slot', async (req, res)=>{
   const data = await getSlot()
   res.json(data)
})

Router.get('/slot/:slot_code', async (req, res)=>{
    const data = await getSlot(req.params.slot_code)
    res.json(data)
})

Router.get('/next_slot', async (req, res)=>{
    const data = await getNextSlot()
    res.json(data)
})

Router.post('/create_slot', async (req, res)=>{
    const data = await createSlot(req)
    res.json(data)
})

Router.post('/reserved_slot', async (req, res)=>{
    const data = await reservedSlot(req)
    res.json(data)
})

Router.post('/inactivated_slot', async (req, res)=>{
    const data = await activatedSlot(req)
    res.json(data)
})


Router.post('/check_in', async (req, res)=>{
    const data = await checkIn(req)
    res.json(data)
})

Router.post('/check_out', async (req, res)=>{
    const data = await checkOut(req)
    res.json(data)
})

Router.get('/status', async (req, res)=>{
    const data = await getSlotStatus(req)
    res.json(data)
})

Router.get('/plate_number', async (req, res)=>{
    const data = await getPlateNumber(req)
    res.json(data)
})

Router.get('/slot_number', async (req, res)=>{
    const data = await getSlotNumber(req)
    res.json(data)
})

Router.get('/car_in_park', async (req, res)=>{
    const data = await getCarInPark(req)
    res.json(data)
})

Router.get('/history', async (req, res)=>{
    const data = await getHistory(req)
    res.json(data)
})

module.exports = Router