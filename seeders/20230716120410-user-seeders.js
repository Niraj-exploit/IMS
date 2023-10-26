"use strict";

const { User, Role } = require("../models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashPassword = await bcrypt.hash(process.env.SEEDER_ADMIN_PASSWORD, 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: process.env.SEEDER_ADMIN_NAME,
          email: process.env.SEEDER_ADMIN_EMAIL,
          password: hashPassword,
          address: process.env.SEEDER_ADMIN_ADDRESS,
          phone: process.env.SEEDER_ADMIN_CONTACT,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );

    const adminUser = await User.findOne({
      where: { name: "admin" },
      attributes: ["id"],
    });

    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "admin",
          code: process.env.SEEDER_ADMIN_CODE,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "editor",
          code: process.env.SEEDER_EDITOR_CODE,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "user",
          code: process.env.SEEDER_USER_CODE,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );

    const adminRole = await Role.findOne({
      where: { name: "admin" },
      attributes: ["id"],
    });

    await queryInterface.bulkInsert(
      "user_role_mapping",
      [
        {
          user_id: adminUser.id,
          role_id: adminRole.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("user_role_mapping", null, {});
  },
};
