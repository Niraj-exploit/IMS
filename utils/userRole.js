const { UserRoleMapping, Role } = require("../models");

async function getUserRoles(userId) {
  try {
    const roles = await UserRoleMapping.findAll({ where: { user_id: userId } });
    const userRoles = [];

    for (const role of roles) {
      const roleEnt = await Role.findOne({ where: { id: role.role_id } });
      if (roleEnt) {
        userRoles.push(roleEnt.code);
      }
    }
    return userRoles;
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getUserRoles,
};
