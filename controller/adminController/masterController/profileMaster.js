const Investigation=require('../../../model/adminModel/masterModel/investigation');
const ProfileEntry=require('../../../model/adminModel/masterModel/profileentrymaster');
const Profile=require('../../../model/adminModel/masterModel/profileMaster');
const sequelize = require('../../../db/connectDB');

/// Add Profile
const createProfile = async (req, res) => {
   
    try {
      const { profileid, investigationids } = req.body;
  
      // 1. Check Profile Exists
      const profile = await ProfileEntry.findByPk(profileid);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found." });
      }
  
      // 2. Check Investigations Exist
      const investigations = await Investigation.findAll({
        where: {
          id: investigationids
        }
      });

      if (investigations.length !== investigationids.length) {
        return res.status(400).json({ message: 'Some investigation IDs are invalid.' });
      }
  
      // 3. Create Profile-Investigation mapping
      const profileInvestigations = investigationids.map(investigationid => ({
        profileid: profileid,
        investigationid: investigationid,
        isactive: true
      }));
  
      await Profile.bulkCreate(profileInvestigations);
  
   
      return res.status(201).json({ message: "Profile created successfully." });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  

/// Get Profile
const fetchProfile=async (req,res) => {
    try {
        const profile = await ProfileEntry.findAll({
          include: [
            {
              model: Investigation,
              through: { attributes: [] }, 
            },
          ],
        });
    
        if (!profile) {
          return res.status(404).json({ message: 'Profile not found.' });
        }

        return res.status(200).json(profile);
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
      }
    
};

/// Update Profile
const updateProfiles = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.params.profile_id;
      const { investigation_ids } = req.body; // New list of investigation_ids
  
      // Find the Profile
      const profile = await ProfileEntry.findByPk(id, { transaction: t });

      console.log('Profile:', profile);
  
      if (!profile) {
        await t.rollback();
        return res.status(404).json({ message: 'Profile not found.' });
      }

      
  
      // Fetch all valid Investigations
      const investigations = await Investigation.findAll({
        where: {
          investigation_id: investigation_ids,
        },
        transaction: t,
      });
  
      if (investigations.length !== investigation_ids.length) {
        await t.rollback();
        return res.status(400).json({ message: 'Some investigation IDs are invalid.' });
      }
    

  
      // Set new Investigations (this will replace old ones automatically)
      await profile.setInvestigations(investigations, { transaction: t });
  
      await t.commit();
      return res.status(200).json({ message: 'Profile investigations updated successfully.' });
  
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
  };
  

module.exports={createProfile,fetchProfile,updateProfiles}