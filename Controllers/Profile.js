const User = require('../Models/User');

const UpdateProfile = async (req, res) => {
    console.log('UpdateProfile function called'); 
    const data = req.body;
    const user_id = req.params.user_id; // Get the user_id from params
    console.log(data);
    try {
        // Find the user by ID
        const existingUser = await User.findById(user_id);
        
        if (!existingUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Update fields only if they are provided
        if (data.name) existingUser.name = data.name;
        if (data.location) existingUser.location = data.location;
        if (data.profile_description) existingUser.profile_description = data.profile_description;
        if (data.profile_image) existingUser.profile_image = data.profile_image;

        // Add new skills to the existing skills array
        if (data.skills && Array.isArray(data.skills)) {
            existingUser.skills = Array.from(new Set([...existingUser.skills, ...data.skills])); // Merge and remove duplicates
        }

        // Update proficiency
        if (data.language && Array.isArray(data.language)) {
            existingUser.language = data.language.map(item => ({
                name: item.name, // Use `name` for the language
                level: item.level // Use `level` for the proficiency level
            })); // This replaces the existing proficiency array
        }

        existingUser.updated_at = new Date(); 

        const updatedProfile = await existingUser.save();

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "An error occurred while updating the profile." });
    }
};

module.exports = {
    UpdateProfile
};
