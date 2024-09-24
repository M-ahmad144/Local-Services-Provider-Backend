const express = require('express');
const {  
    UpdateProfile, 

} = require('../Controllers/Profile');


const router = express.Router();


router.patch('/edit-profile/:user_id', UpdateProfile);


module.exports = router;