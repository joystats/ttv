const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('thaivivat','root','1234',{
    host: 'parking_mysql',
    port: 3306,
    dialect: 'mysql'
})

module.exports = sequelize