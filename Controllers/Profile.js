const User = require('../Models/User');




const GetProfileById = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        // Find the user by ID
        const userProfile = await User.findById(user_id);

        // If no user is found, return a 404 error
        if (!userProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        // If user is found, return the profile data
        res.status(200).json(userProfile);
    } catch (error) {
        console.error("Error retrieving profile:", error);
        res.status(500).json({ error: "An error occurred while retrieving the profile." });
    }
};




const UpdateProfile = async (req, res) => {
    const data = req.body;
    const user_id = req.params.user_id;

    try {

        const updateFields = {
            name: data.name,
            location: data.location,
            profile_description: data.profileDescription,
            profile_image: data.profile_image,
            skills: data.skills,
            language: data.languages,
            updated_at: new Date()
        };
        

        const updatedProfile = await User.findOneAndUpdate(
            { _id: user_id },
            { $set: updateFields }, 
            { new: true, upsert: false } 
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }


        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "An error occurred while updating the profile." });
    }
};


module.exports = {
    UpdateProfile,
    GetProfileById
};
