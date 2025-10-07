const Accession = require("../../../model/adminModel/masterModel/accessionMaster");
const bwipjs = require("bwip-js");

// 1. Add Accession
const addAcesstion = async (req, res) => {
  try {

    const{a_sample_id}=req.body;
    const checkAccession = await Accession.findOne({where:a_sample_id});
    if (checkAccession) {
      return res.status(409).json({
        message: "Sample Id already exists",
        error: "DUPLICATE_SAMPLE_ID",
      });
    }
    const createAccession = await Accession.create(req.body);
    res.status(201).json(createAccession);
  } catch (error) {
    res.status(400).json({ message: `Somthing went wrong : ${error}` });
  }
};

// 2. Generate Barcode
const getBarcode = async (req, res) => {
  try {
    const accession = await Accession.findByPk(req.params.id);
    if (!accession) return res.status(404).send("Accession not found");

    // Construct barcode text (you can customize this format)
    const barcodeText = `${accession.a_year}${accession.a_location_id}${accession.a_container_id}${accession.a_department}${accession.a_sample_id}`;

    bwipjs.toBuffer(
      {
        bcid: "code128", // Barcode type
        text: barcodeText, // Text to encode
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      },
      (err, png) => {
        if (err) {
          res.status(500).send("Error generating barcode");
        } else {
          res.set("Content-Type", "image/png");
          res.send(png);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addAcesstion,getBarcode };
