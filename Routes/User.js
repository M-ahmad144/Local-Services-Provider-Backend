
const express = require('express');
const {signup,login,verifyEmail} = require('../Controllers/User');
const { route } = require('./ServiceProvider');

const router=express.Router();


router.post('/signup',signup);

router.post('/login',login);

router.post('/OTP-verification',verifyEmail)



module.exports=router;


