const mongoose = require('mongoose')
const Service = require('../Models/Service')

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('user_id', 'profile_image name location');

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Error fetching services" });
  }
};

const createService = async (req, res) => {
  const data = req.body.formData; // Assuming the data is sent in the request body
  try {
    console.log(data)
    const newService = await Service.create({
      user_id: req.body.userId, 
      title: data.serviceTitle,
      description: data.serviceDescription,
      category: data.serviceCategory,
      price: data.servicePrice,
      delivery_time: data.deliveryTime,
      service_images: data.coverImage,
      additional_features: data.additionalFeatures,
      revision_count: data.revisionCount,
      service_keywords: data.serviceKeywords,
      service_tags: data.serviceTags,
      service_location: data.serviceLocation,
      availability_start: data.availabilityStart,
      availability_end: data.availabilityEnd,
      detailed_pricing: data.detailedPricing,
    });

    res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Error creating service" });
  }
};

const update = async (req, res) => {
  const serviceId = req.params.service_id;  // Extract service_id from the URL
  const data = req.body;  // Extract the update data from the request body
  
  try {
    // Perform the update operation
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,  // Use the service ID from the URL
      {
        user: data.user_id,
        title: data.serviceTitle,
        description: data.serviceDescription,
        category: data.serviceCategory,
        price: data.servicePrice,
        delivery_time: data.deliveryTime,
        service_images: data.coverImage,
        additional_features: data.additionalFeatures,
        revision_count: data.revisionCount,
        service_keywords: data.serviceKeywords,
        service_tags: data.serviceTags,
        service_location: data.serviceLocation,
        availability_start: data.availabilityStart,
        availability_end: data.availabilityEnd,
        detailed_pricing: data.detailedPricing,
      }
    );

    // If no service found, return 404
    if (!updatedService) {
      res.status(404).json({ error: 'Service not found' });
    }

    // Return the updated service as a success response
    res.status(200)

  } catch (error) {
    // Catch and handle any errors, return a single error response
    console.error("Error updating service:", error);
    return res.status(500).json({ error: "An error occurred while updating the service." });
  }
};


const deleteService = async (req, res) => {
  const serviceId = req.params.service_id;  // Extract service_id from the URL
  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);
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
    const services = await Service.find({ user_id: userid })
      
      
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

const search = async (req, res) => {
  const query = req.query.query; // Extract the query from req.query
  try {
    // Perform a regex search to allow partial matching (fuzzy search)
    const results = await Service.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
      ]
    }).populate('user_id', 'profile_image name location');

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

  
module.exports = {
  createService,
  update,
  getAllServices,
  getServiceByID,
  getServicesByUserID,
  deleteService,
  search
};