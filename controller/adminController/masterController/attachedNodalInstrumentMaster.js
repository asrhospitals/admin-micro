const NodalInstrument=require('../../../model/adminModel/masterModel/attachNodalInstrumentMaster');

/// Add Nodal Instrument
const addNodalInstrument=async(req,res)=>{
    try {
        const newNodal=req.body;
        const createNodal=await NodalInstrument.create(newNodal);
        res.status(201).json(createNodal);
    } catch (e) {
        res.status(400).send({message:`Something went wrong ${e}`});
    }
};


/// Get Nodal Instrument

const getNodalInstrument=async(req,res)=>{
    try {
        const findNodal=await NodalInstrument.findAll();
        res.status(200).json(findNodal);
    } catch (e) {
      res.status(400).send({message:`Something went wrong ${e}`});
    }
};


/// Update Nodal Instrument
const updateNodalInstrument=async(req,res)=>{
    try {
        const id=req.params.id;
        const updatenodal=await NodalInstrument.findByPk(id);
        updatenodal.update(req.body);
        res.status(200).json(updatenodal)
    } catch (e) {
       res.status(400).send({message:`Something went wrong ${e}`});
    }
};

module.exports={addNodalInstrument,getNodalInstrument,updateNodalInstrument}