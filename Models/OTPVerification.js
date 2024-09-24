

const mongoose = require('mongoose');

const UserOTPVerificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    otp:  String, 
    createdAt: {
        type: Date,
        default: Date.now
    }
    ,
    expires_at: Date
});

const UserOTPVerification = mongoose.model('UserOTPVerification', UserOTPVerificationSchema);

module.exports = UserOTPVerification;