const Instrument=require('../../../model/adminModel/masterModel/instrumentMaster');

/// Add Instrument
const addInstrument=async(req,res)=>{
    try {
        const createIntrument=await Instrument.create(req.body);
        res.status(201).json(createIntrument);
    } catch (e) {
        res.status(400).send({message:`Something went wrong ${e}`});
    }
};

/// Get Instrument
const getIntrument=async(req,res)=>{
    try {
        const getinstrument=await Instrument.findAll();
        res.status(200).json(getinstrument);
    } catch (e) {
        res.status(400).send({message:`Something went wrong ${e}`});
    }
};

/// Update Intrument
const updateIntrument=async(req,res)=>{
    try {
        const id=req.params.id;
        const updateinstrument=await Instrument.findByPk(id);
        updateinstrument.update(req.body);
        res.status(200).json(updateinstrument);
    } catch (e) {
        res.status(400).send({message:`Something went wrong ${e}`});
    }
    
};

module.exports={addInstrument,getIntrument,updateIntrument}