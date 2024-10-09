const express = require('express');
const {  
    CreateOrder,
    GetPendingOrders, 
    

} = require('../Controllers/OrdersController');


const router = express.Router();



router.post('/create' , CreateOrder)

router.get('/pending' , GetPendingOrders)



module.exports = router;