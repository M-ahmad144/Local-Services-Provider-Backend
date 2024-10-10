const express = require('express');
const {  
    CreateOrder,
    GetPendingOrders,
    counterPriceUpdate,
    counterTimeUpdate,
    orderAcceptUpdate,
    GetInProgressOrders,
    orderRejectUpdate, 
    

} = require('../Controllers/OrdersController');


const router = express.Router();



router.post('/create' , CreateOrder)

router.get('/pending' , GetPendingOrders)
router.get('/in_progress' , GetInProgressOrders)


router.patch('/counter_price_update' , counterPriceUpdate)

router.patch('/time_update' , counterTimeUpdate)

router.patch('/accept' ,  orderAcceptUpdate)

router.patch('/reject' ,  orderRejectUpdate)







module.exports = router;