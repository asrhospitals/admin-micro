const Hospital=require('../../../model/adminModel/masterModel/hospitalMaster');

/// Add Hospital
const addhospital=async(req,res)=>{

  try {
    const newHospital=req.body;
    const createHospital=await Hospital.create(newHospital);
    res.status(201).json(createHospital);
  } catch (error) {
    res.status(400).send({message:'Something went wrong',error:error.message});
  }
};

/// Get Hospital
const gethospital=async(req,res)=>{
  try {
    const getHospital=await Hospital.findAll();
    if(getHospital.length===0){
      return res.status(404).send({message:'No Hospital Found'});
    }
    res.status(200).send(getHospital);
  } catch (error) {
    res.status(400).send({message:'Something went wrong',error:error.message});
  }
};

/// Update Hospital
const updatehospital=async(req,res)=>{
  try {
    const id=req.params.id;
    const updateHospital=await Hospital.findByPk(id);
    updateHospital.update(req.body);
    res.status(200).json(updateHospital);
  } catch (error) {
    res.status(400).send({message:'Something went wrong',error:error.message});
  }
}

module.exports={addhospital,gethospital,updatehospital}