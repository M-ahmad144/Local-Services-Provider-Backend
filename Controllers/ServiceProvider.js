const mongoose = require('mongoose')
const Service = require('../Models/Service')

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      //.populate('user') // Fetch user details
      //.populate('orders') // Assuming you have an orders model to populate
      //.populate('reviews'); // Assuming you have a reviews model to populate

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Error fetching services" });
  }
};

const createService = async (req, res) => {
  const data = req.body; // Assuming the data is sent in the request body
  try {
    const userId = mongoose.Types.ObjectId.isValid(data.user) ? new mongoose.Types.ObjectId(data.user) : null;

    if (!userId) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const newService = await Service.create({
      user: userId, 
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      delivery_time: data.delivery_time,
      service_images: data.service_images,
    });
    
    console.log("Service created");
    res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Error creating service" });
  }
};


const updateService = async (req, res) => {
  const serviceId = req.params.service_id;  // Extract service_id from the URL
  const data = req.body;

  try {
    const service_id = mongoose.Types.ObjectId.isValid(serviceId) ? new mongoose.Types.ObjectId(serviceId) : null;

    if (!service_id) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const updatedService = await Service.findByIdAndUpdate(
      service_id,
      {
        user: data.user_id, // Mongoose will treat this as ObjectId
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        delivery_time: data.delivery_time,
        service_images: data.service_images,
      },
      { new: true } // Return the updated document
    ).populate('user');
    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "An error occurred while updating the service." });
  }
};
  

const deleteService = async (req, res) => {
  const serviceId = req.params.service_id;  // Extract service_id from the URL
  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (deletedService) {
      res.status(200).json({ message: "Service deleted successfully", deletedService });
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Error deleting service" });
  }
};

  

const getServicesByUserID = async (req, res) => {
  const { user_id } = req.params;  // Extract user_id from the URL

  try {
    const userid = mongoose.Types.ObjectId.isValid(user_id) ? new mongoose.Types.ObjectId(user_id) : null;

    if (!userid) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const services = await Service.find({ user: userid })
      
      
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching user's services:", error);
    res.status(500).json({ error: "Error fetching user's services" });
  }
};

  

const getServiceByID = async (req, res, next) => {
  const { service_id } = req.params;  // Extract service_id from the URL
  try {
    const service = await Service.findById(service_id)
      //.populate('users')
      //.populate('orders')
      //.populate('reviews');

    if (service) {
      req.service = service;
      next()
      res.status(200).json(service); // Send the service as response
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
