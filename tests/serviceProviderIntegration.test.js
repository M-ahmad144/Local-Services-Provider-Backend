const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Service = require('../Models/Service');

describe("Service Provider Routes Integration Tests", () => {
  beforeAll(async () => {
    const dbUri = "mongodb+srv://user1:vwz4mxyMkvrMfYEG@cluster0.0dbac.mongodb.net/test";  
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("POST /serviceProvider/add-service - create service", async () => {
    const serviceData = {
      userId: "60f710b4c25e520b841f2b6c",
      formData: {
        serviceTitle: "Test Service",
        serviceDescription: "Test Description",
        serviceCategory: "Test Category",
        servicePrice: 100,
        deliveryTime: "11-01-2021 11:11:11",
      }
    };

    const response = await request(app).post('/serviceProvider/add-service').send(serviceData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Service");
  });

  test("PUT /serviceProvider/edit-service/:service_id - update service", async () => {
    const service = await Service.create({
      user_id: "60f710b4c25e520b841f2b6c",
      title: "Old Test Service",
      description: "Service Description",
      category: "Test",
      price: 200,
      delivery_time: '2023-11-20'
    });
    const updatedData = { title: "Updated Service", price: 150 };

    const response = await request(app).put(`/serviceProvider/edit-service/${service._id}`).send(updatedData);
    expect(response.status).toBe(200);
  });

  test("GET /serviceProvider/get-all-services - fetch all services", async () => {
    const response = await request(app).get('/serviceProvider/get-all-services');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("DELETE /serviceProvider/delete-service/:service_id - delete service", async () => {
    const service = await Service.create({ 
      user_id: "60f710b4c25e520b841f2b6c",
      title: "Service to Delete", 
      price: 100,
      category: "Test",
      delivery_time: '2023-11-20',
      description: 'Service Description' 
    });
    const response = await request(app).delete(`/serviceProvider/delete-service/${service._id}`);
    expect(response.status).toBe(200);
  });

  test("GET /serviceProvider/get-user-services/:user_id - fetch user services", async () => {
    const response = await request(app).get('/serviceProvider/get-user-services/60f710b4c25e520b841f2b6c');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /serviceProvider/get-service/:service_id - fetch service by ID", async () => {
    const service = await Service.create({ 
      user_id: "60f710b4c25e520b841f2b6c",
      title: "Service by ID", 
      price: 100,
      category: "Test",
      delivery_time: '2023-11-20',
      description: 'Service Description'
    });
    const response = await request(app).get(`/serviceProvider/get-service/${service._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Service by ID");
  });
});
