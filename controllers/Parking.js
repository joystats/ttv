const Router = require('express').Router()

Router.get('/', (req, res)=>{
    res.json({
        path: '/parking'
    })
})

module.exports = Router