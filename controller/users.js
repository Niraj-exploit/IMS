var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { User, Role, UserRoleMapping } = require("../models");
const roleAuthentication = require("../middlewares/role-auth-middleware");
const e = require("express");
require("dotenv").config();
const { getUserRoles } = require("../utils/userRole");

exports.userRegister = async (req, res) => {
  const existingUser = await User.findOne({ where: { email: req.body.email } });
  if (existingUser) {
    res.json({
      success: false,
      message: "User already registered",
    });
  } else {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashPassword });
    const role = await Role.findOne({ where: { code: "USER" } });
    await UserRoleMapping.create({ user_id: user.id, role_id: role.id });

    res.json({
      success: true,
      message: "User Created Successfully",
    });
  }
};

exports. userLogin = async (req, res) => {
  const existingUser = await User.findOne({ where: { email: req.body.email } });

  if (!existingUser) {
    res.json({
      success: false,
      message: "user not registered",
    });
  } else {
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!passwordMatch) {
      res.json({
        success: false,
        message: "Invalid Credential",
      });
    } else {
      const roles = await UserRoleMapping.findAll({
        where: { user_id: existingUser.id },
      });

      const userRoles = [];

      for (const role of roles) {
        const roleEnt = await Role.findOne({
          where: { id: role.role_id },
        });
        userRoles.push(roleEnt.code);
      }

      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser.id,
          name: existingUser.name,
          roles: userRoles,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "12hr",
        }
      );

      res.json({
        success: true,
        message: "You are logged in",
        token,
        userRoles
      });
    }
  }
};

// exports.getAllUser = async (req, res) => {
//   const allUser = await User.findAll();

//   res.json({
//     status: true,
//     allUser,
//   });
// };


exports.getAllUser= async (req, res) => {
  try {
    const allUsers = await User.findAll();

    // Fetch roles for each user
    const usersWithRoles = await Promise.all(allUsers.map(async (user) => {
      const roles = await getUserRoles(user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        roles,
      };
    }));

    res.json({
      success: true,
      usersWithRoles,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

// Define the getUserRoles function
// const getUserRoles = async (userId) => {
//   const userRoles = await UserRoleMapping.findAll({
//     where: {
//       user_id: userId,
//     },
//     include: Role, // Include the Role model to fetch roles
//   });

//   return userRoles.map(mapping => mapping.Role);
// };




exports.getUserInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const roles = await getUserRoles(user.id);

    res.json({
      success: true,
      user,
      roles,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user info",
    });
  }
};


// exports.assignUserRole = async (req, res, next) => {
//   const existingMapping = await UserRoleMapping.findOne({
//     where: {
//       user_id: req.body.userId,
//       role_id: req.body.roleId,
//     },
//   });

//   if (existingMapping) {
//     res.json({
//       status: false,
//       message: "Role already assigned",
//     });
//   } else {
//     await UserRoleMapping.create({
//       user_id: req.body.userId,
//       role_id: req.body.roleId,
//     });
//     res.json({
//       status: true,
//       message: "Role assigned",
//     });
//   }
// };
/*
-------------updated to UpdateUserWithRole----------------
exports.assignUserRole = async (req, res, next) => {
  try {
    const { userId, roleIds } = req.body;

    // Check if the roleIds array is not empty
    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid roleIds. Please provide an array of valid roleIds.",
      });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Check if all roleIds exist in the roles table
    const existingRoles = await Role.findAll({
      where: {
        id: roleIds,
      },
    });
    if (existingRoles)
      if (existingRoles.length !== roleIds.length) {
        // Check if the number of existing roles matches the number of provided roleIds
        return res.status(400).json({
          status: false,
          message: "One or more provided roleIds do not exist.",
        });
      }

    // Get the names of all roles corresponding to the roleIds
    const roleNames = existingRoles.map((role) => role.name);

    // // Check if any forbidden roles (doctor or admin) are included in the roleIds
    // const forbiddenRoles = ["doctor", "admin"];
    // const hasForbiddenRole = roleNames.some((roleName) =>
    //   forbiddenRoles.includes(roleName)
    // );

    // if (hasForbiddenRole && roleNames.includes("patient")) {
    //   return res.status(403).json({
    //     status: false,
    //     message:
    //       "Forbidden: Users cannot be assigned 'doctor' or 'admin' roles alongside 'patient'.",
    //   });
    // }

    // Check if the user_id and role_id combinations already exist
    const existingMappings = await UserRoleMapping.findAll({
      where: {
        user_id: userId,
        role_id: roleIds,
      },
    });

    // Get the role_ids that are already assigned to the user
    const existingRoleIds = existingMappings.map((mapping) => mapping.role_id);

    // Filter out the role_ids that are already assigned
    const newRoleIds = roleIds.filter(
      (roleId) => !existingRoleIds.includes(roleId)
    );

    // Create new mappings for the remaining role_ids
    await Promise.all(
      newRoleIds.map(async (roleId) => {
        await UserRoleMapping.create({
          user_id: userId,
          role_id: roleId,
        });
      })
    );

    res.json({
      status: true,
      message: "Roles assigned",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "An error occurred while assigning roles.",
    });
  }


};



exports.updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const [affectedRowsCount] = await User.update(
      { ...req.body, password: hashPassword },
      { where: { id } }
    );

    if (affectedRowsCount === 1) {
      res.json({
        success: true,
        message: "User updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
};
*/
exports.deleteUser = async (req, res) => {
  const { id } = req.params; // Corrected to use req.params.id to get the user ID

  try {
    const deletedUser = await User.destroy({ where: { id } });

    if (deletedUser === 1) {
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};


// exports.updateUserWithRoles = async (req, res) => {
//   const { id } = req.params;

//   try {
//     console.log(req.body);
//     const hashPassword = await bcrypt.hash(req.body.password, 10);
//     const [affectedRowsCount] = await User.update(
//       { ...req.body, password: hashPassword },
//       { where: { id } }
//     );

//     if (affectedRowsCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const { roleIds } = req.body;

//     if (roleIds) {
//       // Check if the roleIds array is not empty
//       if (!Array.isArray(roleIds) || roleIds.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid roleIds. Please provide an array of valid roleIds.",
//         });
//       }

//       // Your existing role assignment logic
//       const user = await User.findByPk(id);
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       const existingRoles = await Role.findAll({
//         where: {
//           id: roleIds,
//         },
//       });

//       if (existingRoles.length !== roleIds.length) {
//         return res.status(400).json({
//           success: false,
//           message: "One or more provided roleIds do not exist.",
//         });
//       }

//       const roleNames = existingRoles.map((role) => role.name);

//       const forbiddenRoles = ["doctor", "admin"];
//       const hasForbiddenRole = roleNames.some((roleName) =>
//         forbiddenRoles.includes(roleName)
//       );

//       if (hasForbiddenRole && roleNames.includes("patient")) {
//         return res.status(403).json({
//           success: false,
//           message: "Forbidden: Users cannot have 'doctor' or 'admin' roles alongside 'patient'.",
//         });
//       }

//       const existingMappings = await UserRoleMapping.findAll({
//         where: {
//           user_id: id,
//           role_id: roleIds,
//         },
//       });

//       const existingRoleIds = existingMappings.map((mapping) => mapping.role_id);

//       const newRoleIds = roleIds.filter(
//         (roleId) => !existingRoleIds.includes(roleId)
//       );

//       await Promise.all(
//         newRoleIds.map(async (roleId) => {
//           await UserRoleMapping.create({
//             user_id: id,
//             role_id: roleId,
//           });
//         })
//       );
//     }

//     res.json({
//       success: true,
//       message: "User and roles updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating user",
//     });
//   }
// };

exports.updateUserWithRoles = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const [affectedRowsCount] = await User.update(
      { ...req.body, password: hashPassword },
      { where: { id } }
    );

    if (affectedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { roleIds } = req.body;

    if (roleIds !== undefined) {
      // Check if the roleIds array is not empty
      if (!Array.isArray(roleIds)) {
        return res.status(400).json({
          success: false,
          message: "Invalid roleIds. Please provide an array of valid roleIds.",
        });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const existingMappings = await UserRoleMapping.findAll({
        where: {
          user_id: id,
        },
      });

      const existingRoleIds = existingMappings.map((mapping) => mapping.role_id);

      // Determine roles to be added and removed
      const rolesToAdd = roleIds.filter(roleId => !existingRoleIds.includes(roleId));
      const rolesToRemove = existingRoleIds.filter(roleId => !roleIds.includes(roleId));

      // Remove roles that need to be removed
      await UserRoleMapping.destroy({
        where: {
          user_id: id,
          role_id: rolesToRemove,
        },
      });

      // Add roles that need to be added
      await Promise.all(
        rolesToAdd.map(async (roleId) => {
          await UserRoleMapping.create({
            user_id: id,
            role_id: roleId,
          });
        })
      );
    }

    res.json({
      success: true,
      message: "User and roles updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
};
