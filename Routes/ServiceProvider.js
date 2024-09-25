const express = require('express');
const { 
  createService, 
  update, 
  getServiceByID, 
  getAllServices, 
  getServicesByUserID, 
  deleteService 
} = require('../Controllers/ServiceProvider');

const router = express.Router();

router.param('service_id', getServiceByID)
// Create a new service
router.post('/add-service', createService);

// Update a service by service_id (use PATCH to update)
router.put('/edit-service/:service_id', update);

// Get all services (no parameters)
router.get('/get-all-services', getAllServices);

// Get services by user_id
router.get('/get-user-services/:user_id', getServicesByUserID);

// Get a service by service_id
router.get('/get-service/:service_id', getServiceByID);

// Delete a service by service_id (use DELETE method)
router.delete('/delete-service/:service_id', deleteService);

module.exports = router;
