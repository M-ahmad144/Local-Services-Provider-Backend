const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createService } = require('../Controllers/ServiceProvider')
const express = require('express')
const router = express.Router();

router.post('/addService', createService);

const serviceData = {
  user_id: 1,
  title: 'Web Development',
  description: 'Full-stack web development service using MERN stack.',
  category: 'Development',
  price: 500.0,
  delivery_time: '7 days',
  service_images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
};
createService(serviceData).then(() => {
  console.log("all ok")
}).catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
module.exports = router;