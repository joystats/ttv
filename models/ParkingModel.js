
const connection = require('../config/Connection')
const config = require('config')
const BAHT_PER_HOUR = config.get('baht_per_hour')

const createParkingLot = ()=>{
    const x = ['A','B','C','D','E']
	const y = [1,2,3,4,5]
    let sorted = 0;
	x.forEach((item, index)=>{
		y.forEach((items, indexs)=>{
            connection.query(`INSERT INTO tb_parking_lot (slot_code, sorted) VALUES ('${item+items}','${sorted++}')`)
            .then(([data]) => {
                return true;
            }).catch(function (err) {
                return false;
            });
		})
	})
}

const getSlot = (slot_code = null)=>{
    let sql = `SELECT slot_id, slot_code, sorted, created FROM tb_parking_lot ORDER BY slot_code ASC`
    if(slot_code!=null){
        sql = `SELECT slot_id, slot_code, sorted, created FROM tb_parking_lot WHERE slot_code='${slot_code}'`
    }
    return connection.query(sql)
    .then(([data]) => {
        if(data.length>0){
            return {
                success: true,
                data
            }
        }
        throw 'Slot not found.'
    }).catch((err)=>{
        return {
            success: false,
            message: err
        }
    });
}

const getNextSlot = ()=>{
    const sql = `SELECT slot_id, slot_code 
        FROM tb_parking_lot
        WHERE slot_status = 'available'
        ORDER BY sorted ASC
        LIMIT 1
    `
    return connection.query(sql)
    .then(([data]) => {
        if(data.length>0){
            return {
                slot_id: data[0].slot_id,
                slot_code: data[0].slot_code
            }
        }
        throw 'Slot is not available.'
    }).catch((err)=>{
        return {
            success: false,
            message: err
        }
    });
}

const createSlot = (req)=>{
    const { slot_code } = req.body
    const sql = `INSERT INTO tb_parking_lot (slot_code, sorted)
    SELECT '${slot_code}' as slot_code,
    (SELECT MAX(sorted)+1 
    FROM tb_parking_lot) as sorted `
    return connection.query(sql)
    .then(([data]) => {
        if(data>0){
            req.app.io.emit('dashboard', {message : 'trigger dashboard by create new slot.'});
            return {
                success: true,
                slot_id: data
            }
        }
        throw 'Cannot create new slot. please try again.'
    }).catch((err)=>{
        return {
            success: false,
            message: err
        }
    });
}

const reservedSlot = (req)=>{
    const { slot_code } = req.body
    const { cancel } = req.query
    let sql = `UPDATE tb_parking_lot SET slot_status = 'reserved' WHERE slot_code = '${slot_code}'`
    if(cancel != null){
        sql = `UPDATE tb_parking_lot SET slot_status = 'available' WHERE slot_code = '${slot_code}'`
    }
    
    return connection.query(sql)
    .then(([data]) => {
        req.app.io.emit('dashboard', {message : 'trigger dashboard by reserved.'});
        return {
            success: true
        }
    }).catch((err)=>{
        return {
            success: false,
            message: err
        }
    });
}
const activatedSlot = (req)=>{
    const { slot_code } = req.body
    const { cancel } = req.query
    let sql = `UPDATE tb_parking_lot SET slot_status = 'inactivated' WHERE slot_code = '${slot_code}'`
    if(cancel != null){
        sql = `UPDATE tb_parking_lot SET slot_status = 'available' WHERE slot_code = '${slot_code}'`
    }
    
    return connection.query(sql)
    .then(([data]) => {
        req.app.io.emit('dashboard', {message : 'trigger dashboard by inactivated slot.'});
        return {
            success: true
        }
    }).catch((err)=>{
        return {
            success: false,
            message: err
        }
    });
}

const checkIn = async (req)=>{
    const { slot_code } = await getNextSlot();
    const { plate_number, size } = req.body
    const sql = `INSERT INTO tb_parking (slot_code, plate_number, size)
    VALUES ('${slot_code}','${plate_number}','${size}') `
    return connection.query(sql)
    .then(([data]) => {
        if(data>0){
            const sql = `SELECT park_id, slot_code, plate_number, size, time_in
                FROM tb_parking
                WHERE park_id = ${data} `
            return connection.query(sql)
            .then(([data])=>{
                req.app.io.emit('dashboard', {message : 'trigger dashboard by check in.'});
                return {
                    success: true,
                    data
                }
            })
        }
        throw 'Cannot check in. please try again.'
    }).catch((err)=>{
        return {
            success: false,
            message: err
        }
    });
}


const checkOut = async (req)=>{
    return getParkInfo(req)
    .then((data)=>{
        if(data.park_id>0){
            const park_id = data.park_id
            return setCheckOut(park_id)
            .then((data)=>{
                return getServiceCharge(park_id)
                .then((data)=>{
                    req.app.io.emit('dashboard', {message : 'trigger dashboard by check out.'});
                    return {
                        success: true,
                        message: "Checkout is successfully"
                    }
                })
            })
        }
        throw 'Already checked out.'
    }).catch((err)=>{
        return {
            success: false,
            message: err
        }
    })
}


const getParkInfo = async (req)=>{
    const { slot_code } = req.body
    const sql = `SELECT park_id
        FROM tb_parking
        WHERE time_out IS NULL
            AND slot_code = '${slot_code}'
        `
    return await connection.query(sql)
    .then(([data]) => {
        return {
            park_id: data[0].park_id
        }
    }).catch((err)=>{
        return {
            park_id: 0,
            slot_code: null
        }
    });
}

const setCheckOut = async (park_id)=>{
    const sql = `
        UPDATE tb_parking
        SET time_out = current_timestamp() 
        WHERE park_id = '${park_id}'
        `
    return await connection.query(sql)
    .then((data) => {
        return true
    }).catch((err)=>{
        return false
    });
}

const getServiceCharge = async (park_id)=>{
    const sql = `
        UPDATE tb_parking
        SET service_charge = 
        CASE 
            WHEN (TIMESTAMPDIFF(MINUTE,time_in,time_out)%60)>0 THEN (TIMESTAMPDIFF(HOUR,time_in,time_out)+1)*${BAHT_PER_HOUR}
            ELSE TIMESTAMPDIFF(HOUR,time_in,time_out)*${BAHT_PER_HOUR}
        END
        WHERE park_id = ${park_id} `
    return await connection.query(sql)
    .then((data) => {
        return true
    })
    .catch((err)=>{
        return false
    });
}

const getSlotStatus = (req)=>{
    const { slot_code } = req.query
    let sql = `SELECT slot_id, slot_code, slot_status, created FROM tb_parking_lot ORDER BY slot_code ASC`
    if(slot_code!=null){
        sql = `SELECT slot_id, slot_code, slot_status, created FROM tb_parking_lot WHERE slot_code='${slot_code}'`
    }
    return connection.query(sql)
    .then(([data]) => {
        return {
            success: true,
            data
        }
    })
    .catch((err)=>{
        return false
    });
}

const getPlateNumber = (req)=>{
    const { size } = req.query
    const sql = `SELECT plate_number, size FROM tb_parking WHERE size = '${size}' AND time_out IS NULL ORDER BY slot_code ASC`
    return connection.query(sql)
    .then(([data]) => {
        return data
    })
    .catch((err)=>{
        return false
    });
}

const getSlotNumber = (req)=>{
    const { size } = req.query
    const sql = `SELECT slot_code, size FROM tb_parking WHERE size = '${size}' AND time_out IS NULL ORDER BY slot_code ASC`
    return connection.query(sql)
    .then(([data]) => {
        return data
    })
    .catch((err)=>{
        return false
    });
}

const getCarInPark = (req)=>{
    let { order, order_by } = req.query
    if(order == null){
        order = 'ASC'
    }
    if(order_by == null){
        order_by = 'slot_code'
    }
    const sql = `SELECT slot_code, plate_number, size, time_in FROM tb_parking WHERE time_out IS NULL ORDER BY ${order_by} ${order}`
    return connection.query(sql)
    .then(([data]) => {
        return data
    })
    .catch((err)=>{
        return false
    });
}


const getHistory = (req)=>{
    let { order, order_by } = req.query
    if(order == null){
        order = 'ASC'
    }
    if(order_by == null){
        order_by = 'slot_code'
    }
    const sql = `SELECT slot_code, plate_number, size, time_in, time_out, service_charge FROM tb_parking WHERE time_out IS NOT NULL ORDER BY ${order_by} ${order}`
    return connection.query(sql)
    .then(([data]) => {
        return data
    })
    .catch((err)=>{
        return false
    });
}

module.exports = {
    createParkingLot, getSlot, getNextSlot, createSlot, checkIn, checkOut, 
    getSlotStatus, getPlateNumber, getSlotNumber, getCarInPark, getHistory,
    reservedSlot, activatedSlot
}