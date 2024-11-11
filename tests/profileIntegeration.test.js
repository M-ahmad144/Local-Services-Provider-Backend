const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../Models/User');

// Test User data to be created
const testUserData = {
  name: 'Test User',
  email: 'testuser@example.com',
  location: 'Test City',
  user_type : 'buyer',
  password : '12345678',
  profile_description: 'This is a test user.',
  skills: ['JavaScript', 'Node.js']
};

let testUserId;  // To store the ID of the created user

describe("Profile Routes Integration Tests", () => {

  beforeAll(async () => {
    const dbUri = "mongodb+srv://user1:vwz4mxyMkvrMfYEG@cluster0.0dbac.mongodb.net/test";  
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user in the database before the tests
    const testUser = await User.create(testUserData);
    testUserId = testUser._id.toString();  // Save the created user's ID for later use
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await User.deleteOne({ _id: testUserId });  // Delete the test user created
    await mongoose.connection.close();
  });

  test("GET /profile/user/:user_id - fetch user profile by ID", async () => {
    const response = await request(app).get(`/profile/user/${testUserId}`);
    
    // Check if the request is successful and returns the correct user data
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', testUserId);
    expect(response.body).toHaveProperty('name', 'Test User');
    expect(response.body).toHaveProperty('email', 'testuser@example.com');
    expect(response.body).toHaveProperty('location', 'Test City');
    expect(response.body).toHaveProperty('user_type', 'buyer');
    expect(response.body).toHaveProperty('profile_description', 'This is a test user.');
    expect(response.body).toHaveProperty('skills');
    expect(Array.isArray(response.body.skills)).toBe(true);
  });

  test("GET /profile/user/:user_id - should return 404 if user is not found", async () => {
    const invalidUserId = "60f710b4c25e520b841f2b6d"; // Random invalid ID
    const response = await request(app).get(`/profile/user/${invalidUserId}`);
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found.");
  });

  test("PATCH /profile/edit-profile/:user_id - update user profile", async () => {
    const updateData = {
      name: "Updated User",
      location: "Updated City",
      profileDescription: "Updated profile description",
      profile_image: "updated-image-url",
      skills: ["JavaScript", "Node.js"],
      languages: [
        { name: "English", level: "Fluent" },
        { name: "Spanish", level: "Intermediate" }
      ]
    };

    const response = await request(app)
      .patch(`/profile/edit-profile/${testUserId}`)
      .send(updateData);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated User');
    expect(response.body).toHaveProperty('location', 'Updated City');
    expect(response.body).toHaveProperty('profile_description', 'Updated profile description');
    expect(response.body).toHaveProperty('skills');
    expect(response.body.skills).toEqual(expect.arrayContaining(["JavaScript", "Node.js"]));
  });

  test("PATCH /profile/edit-profile/:user_id - should return 404 if user to update is not found", async () => {
    const invalidUserId = "60f710b4c25e520b841f2b6d"; // Random invalid ID
    const updateData = {
      name: "Non-existent User",
      location: "Nowhere"
    };

    const response = await request(app)
      .patch(`/profile/edit-profile/${invalidUserId}`)
      .send(updateData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found.");
  });


  test("PATCH /profile/edit-profile/:user_id - should return 500 if invalid data types are provided", async () => {
    const updateData = {
      name: "Invalid Data User",
      location: "Somewhere",
      profileDescription: "Invalid data test",
      profile_image: 12345,  // Invalid data type for image URL (should be a string)
      skills: "JavaScript, Node.js",  // Invalid data type for skills (should be an array)
      languages: "English"  // Invalid data type (should be an array)
    };

    const response = await request(app)
      .patch(`/profile/edit-profile/${testUserId}`)
      .send(updateData);

    expect(response.status).toBe(500);  // Assuming backend validates data types
    expect(response.body).toHaveProperty("error", "An error occurred while updating the profile.");
  });

});
