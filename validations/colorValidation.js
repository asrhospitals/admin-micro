const colorSchema = Joi.object({
  colorstatus: Joi.string().required(),
  colorcodes: Joi.object({
    hex: Joi.string().pattern(/^#([0-9A-Fa-f]{3}){1,2}$/).optional(),
    rgb: Joi.string().pattern(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/).optional(),
    hsl: Joi.string().pattern(/^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/).optional(),
  })
    .min(1)
    .required(),
  createdAt: Joi.date().optional(),   // <-- allow frontend to send it
  // updatedAt: Joi.date().optional(),   // optional if needed
});
