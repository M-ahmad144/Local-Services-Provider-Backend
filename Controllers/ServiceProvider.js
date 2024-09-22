const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        user: true,
        orders: true,
        reviews: true,
      },
    });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Error fetching services" });
  } finally {
    await prisma.$disconnect();
  }
};

const createService = async (req, res) => {
  const data = req.body; // Assuming the data is sent in the request body
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
    console.log("Service created:", newService);
    res.status(201).json(newService); // Respond with the created service
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Error creating service" }); // Respond with an error message
  }
};

const updateService = async (req, res) => {
    const service = req.service;  // Extract service_id from the URL
    const data = req.body;
  
    try {
      const updatedService = await prisma.service.update({
        where: { service_id: parseInt(service.service_id) }, // Use service_id from params
        data: {
          user_id: data.user_id,
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          delivery_time: data.delivery_time,
          service_images: data.service_images,
          updated_at: new Date(),
        },
      });
      res.status(200).json(updatedService);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ error: "An error occurred while updating the service." });
    }
  };
  

  const deleteService = async (req, res) => {
    const service = req.service;  // Extract service_id from the URL
    try {
      const deletedService = await prisma.service.delete({
        where: {
          service_id: parseInt(service.service_id),
        },
      });
      res.status(200).json({ message: "Service deleted successfully", deletedService });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ error: "Error deleting service" });
    }
  };
  

  const getServicesByUserID = async (req, res) => {
    const { user_id } = req.params;  // Extract user_id from the URL
  
    try {
      const services = await prisma.service.findMany({
        where: {
          user_id: parseInt(user_id),
        },
        include: {
          user: true,
          orders: true,
          reviews: true,
        },
      });
  
      res.status(200).json(services);
    } catch (error) {
      console.error("Error fetching user's services:", error);
      res.status(500).json({ error: "Error fetching user's services" });
    }
  };
  

  const getServiceByID = async (req, res, next, id) => {
    const { service_id } = req.params;  // Extract service_id from the URL
    try {
      const service = await prisma.service.findUnique({
        where: { service_id: parseInt(service_id) },
        include: {
          user: true,
          orders: true,
          reviews: true,
        },
      });
      if (service) {
        req.service = service;
        next()
      } else {
        res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Error fetching service" });
    }
  };
  
module.exports = {
  createService,
  updateService,
  getAllServices,
  getServiceByID,
  getServicesByUserID,
  deleteService,
};
