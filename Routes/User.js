
const express = require('express');
const {signup,login,verifyEmail,roleSelection} = require('../Controllers/User');
const { route } = require('./ServiceProvider');

const router=express.Router();


router.post('/signup',signup);

router.post('/login',login);
router.post('/role-selection',roleSelection);

router.post('/OTP-verification',verifyEmail)



module.exports=router;


