const { Company } = require("../models");

exports.createCompany = async (req, res) => {
  const { name, address, contact } = req.body;

  try {
    // Check if the required fields are provided in the request
    if (!name || !address || !contact) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if the company with the same name already exists
    const existingCompany = await Company.findOne({
      where: { name: name },
    });

    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // Create a new company
    const newCompany = await Company.create({
      name,
      address,
      contact,
    });

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company: newCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create company",
      error: error.message,
    });
  }
};

exports.getCompanyInfo = async (req, res) => {
  try {
    const companyInfo = await Company.findAll();

    res.status(200).json({
      success: true,
      companyInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve company information",
      error: error.message,
    });
  }
};

exports.updateCompanyById = async (req, res) => {
    try {
      const cid = await Company.findByPk(req.params.id);
      if (!cid) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Update the company's attributes
      await cid.update(req.body);
      
      res.status(200).json({
        success: true,
        message: "Company updated successfully",
        updatedCompany: cid, // Return the updated company
      });
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  