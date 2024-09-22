const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createService(data) {
    try {
      const newService = await prisma.service.create({
        data: {
          user_id: data.user_id,
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          delivery_time: data.delivery_time,
          service_images: data.service_images,
        },
      });
      console.log('Service created:', newService);
      return newService;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

module.exports = { createService }