
const express = require('express');
const {signup,login} = require('../Controllers/User');
const { route } = require('./ServiceProvider');

const router=express.Router();


router.post('/signup',signup);

router.post('/login',login);



module.exports=router;


