const Joi = require("joi");


const colorSchema = Joi.object({
  colorname: Joi.string().required(),
  colorcode: Joi.object({
    hex: Joi.string().pattern(/^#([0-9A-Fa-f]{3}){1,2}$/).optional(),
    rgb: Joi.string().pattern(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/).optional(),
    hsl: Joi.string().pattern(/^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/).optional(),
    name: Joi.string().optional(), // ✅ allow color name
  }).min(1).required(),
});



module.exports = { colorSchema };