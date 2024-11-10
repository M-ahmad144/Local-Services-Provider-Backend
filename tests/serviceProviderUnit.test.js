const mongoose = require('mongoose');
const { createService, update, getAllServices, deleteService, getServicesByUserID, getServiceByID } = require('../Controllers/ServiceProvider');
const Service = require('../Models/Service');

jest.mock('../Models/Service');  
test("createService - valid data", async () => {
    const req = {
      body: {
        userId: "60f710b4c25e520b841f2b6c",
        formData: {
          serviceTitle: "Test Service",
          serviceDescription: "Test Description",
          serviceCategory: "Test Category",
          servicePrice: 100,
          deliveryTime: "11-01-2021 11:11:11",
          coverImage: "test-image.jpg",
          additionalFeatures: ["Feature 1", "Feature 2"],
          revisionCount: 3,
          serviceKeywords: ["keyword1", "keyword2"],
          serviceTags: ["tag1", "tag2"],
          serviceLocation: "Test Location",
          availabilityStart: "10:00 AM",
          availabilityEnd: "6:00 PM",
          detailedPricing: "Test Pricing",
        },
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    // Mock response to include all expected fields
    Service.create.mockResolvedValue({
      user_id: "60f710b4c25e520b841f2b6c",
      title: "Test Service",
      description: "Test Description",
      category: "Test Category",
      price: 100,
      delivery_time: "11-01-2021 11:11:11",
      service_images: "test-image.jpg",
      additional_features: ["Feature 1", "Feature 2"],
      revision_count: 3,
      service_keywords: ["keyword1", "keyword2"],
      service_tags: ["tag1", "tag2"],
      service_location: "Test Location",
      availability_start: "10:00 AM",
      availability_end: "6:00 PM",
      detailed_pricing: "Test Pricing",
    });
  
    await createService(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
  
  
  
  test("createService - missing required fields", async () => {
    const req = { body: { userId: "", formData: {} } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Service.create.mockRejectedValue(new Error("Error creating service"));
  
    await createService(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
  test("update - successful update", async () => {
    const req = { 
      params: { service_id: "60f710b4c25e520b841f2b6c" },
      body: { serviceTitle: "Updated Service" }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    // Mock the response to include expected fields
    Service.findByIdAndUpdate.mockResolvedValue({
      _id: "60f710b4c25e520b841f2b6c", 
      serviceTitle: "Updated Service"
    });
  
    await update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  