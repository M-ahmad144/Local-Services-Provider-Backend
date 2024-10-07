const express = require('express');
const {  
    CreateOrder, 
    

} = require('../Controllers/OrdersController');


const router = express.Router();



router.post('/create' , CreateOrder)


module.exports = router;