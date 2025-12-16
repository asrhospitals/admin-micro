function applyAdminAuditHooks(sequelize) {
  const AuditLog = sequelize.models.AuditLog;
  const models = sequelize.models;

  const adminModels = ["department","subdepartment","hospital","hospitaltype","nodalhospital"];

  for (const key in models) {
    const model = models[key];

    if (!model || !adminModels.includes(model.name)) continue;

    // CREATE
    model.addHook("afterCreate", async (instance, options) => {

      await AuditLog.create({
        model: model.name,
        action: "create",
        change_by: options.user,
        old_data: null,
        new_data: instance.toJSON(),
      });
    });

    // UPDATE
    model.addHook("beforeUpdate", async (instance, options) => {
        
      options._oldData = instance._previousDataValues;
    });

    model.addHook("afterUpdate", async (instance, options) => {
      await AuditLog.create({
        model: model.name,
        action: "update",
        change_by: options.user,
        old_data: options._oldData,
        new_data: instance.toJSON(),
      });
    });

    // DELETE
    model.addHook("afterDestroy", async (instance, options) => {
      await AuditLog.create({
        model: model.name,
        action: "delete",
        change_by: options.user,
        old_data: instance.toJSON(),
        new_data: null,
      });
    });
  }
}

module.exports = applyAdminAuditHooks;
