const NodalHospital = require("../../../model/adminModel/masterModel/attachNodalHospitalMaster");
const {
  Nodal,
  Hospital,
} = require("../../../model/associatemodels/associatemodel");

/// Add Nodal
const addNodalHospital = async (req, res) => {
  try {
    const newAttachNodalHospital = req.body;
    const createNodal = await NodalHospital.create(newAttachNodalHospital);
    res.status(201).json(createNodal);
  } catch (error) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

/// Get Nodal
const getNodalHospital = async (req, res) => {
  try {
    const findNodal = await NodalHospital.findAll({
      include: [
        {
          model: Nodal,
          as: "nodal",
          attributes: ["nodalname"],
        },
        {
          model: Hospital,
          as: "hospital",
          attributes: ["hospitalname"],
        },
      ],
    });
    
    const formattedData = findNodal.map((record) => ({
      nodalName: record.nodal?.nodalname,
      hospitalName: record.hospital?.hospitalname,
      isactive: record.isactive,
    }));
    res.status(200).json(formattedData);
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

/// Update Nodal
const updateNodalHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const updatenodal = await NodalHospital.findByPk(id);
    if (!updatenodal)
      return res
        .status(200)
        .json({ message: "NodalHospital record not found" });
    await updatenodal.update(req.body);
    res.status(200).json(updatenodal);
  } catch (e) {
    res.status(400).send({ message: `Something went wrong ${e}` });
  }
};

module.exports = { addNodalHospital, getNodalHospital, updateNodalHospital };
