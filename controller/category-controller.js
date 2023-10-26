const { Category, Product } = require("../models");

exports.createCategory = async (req, res) => {
  const existingCategory = await Category.findOne({
    where: { name: req.body.name },
  });

  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
};

exports.getAllCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).json({
    success: true,
    categories,
  });
};

exports.getCategoryById = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  res.status(200).json({
    success: true,
    category,
  });
};

exports.updateCategoryById = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  const updatedCategory = await category.update(req.body);
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    updatedCategory,
  });
};

// exports.deleteCategoryById = async (req, res) => {
//   const category = await Category.findByPk(req.params.id);
//   if (!category) {
//     res.status(404).json({ message: "Category not found" });
//   } else {
//     await category.destroy();
//     res.json({
//       success: true,
//       message: "Category deleted successfully",
//     });
//   }
// };


exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productsWithCategory = await Product.findAll({
      where: { categoryCode: category.code },
    });

    if (productsWithCategory.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category is currently in use",
        products: productsWithCategory,
      });
    }

    await category.destroy();
    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};