
$(function(){
    const client = io();
    client.on("dashboard",(data)=>{
        console.log(data.message)
		getParking()
	})
    getParking()
})

const getParking = ()=>{
    const parking = $("#parking")
    const url = "http://localhost/parking/status"
    $.ajax({
        url,
        type: 'GET',
        dataType: 'json',
        success: ({success, data})=>{
            if(success){
                if(data.length>0){
                    parking.empty()
                    data.forEach((item, index)=>{
                        let status = getStatusButton(item.slot_status)
                        parking.append(`<button type="button" class="btn ${status}">${item.slot_code}</button>`)
                    })
                }
            }
        }
    })
}

const getStatusButton = (status)=>{
    let btn_status = null;
    switch(status){
        case 'inactivated':
            btn_status = 'btn-dark'
        break;
        case 'available ':
            btn_status = 'btn-outline-success'
        break;
        case 'not_available':
            btn_status = 'btn-danger'
        break;
        case 'reserved':
            btn_status = 'btn-warning'
        break;
        default:
            btn_status = 'btn-outline-success'
            
    }
    return btn_status;
}