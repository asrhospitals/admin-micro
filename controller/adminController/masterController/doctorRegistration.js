const Doctor = require("../../../model/adminModel/masterModel/doctorRegistration");

// A. Add Doctor
const addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create({...req.body});
    res.status(201).json(doctor);
  } catch (e) {
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

// B. Get doctor

const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findAll({
      attributes: { exclude: [] } // or just omit this entirely
    });
    
    res.status(200).json(doctor);
  } catch (e) {
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

// C. Update Doctor
const updateDoctor = async (req, res) => {
  try {
    const {id}=req.params;
    if(!id) return res.status(200).json({message:"Id required"});
    const doctor=await Doctor.findByPk(id);
    await doctor.update(req.body);
    res.status(200).json(doctor);
  } catch (e) {
    res.status(400).json({ message: `Something went wrong ${e}` });
  }
};

module.exports={
    addDoctor,getDoctor,updateDoctor
}
