const { Product, Category, Sales, User } = require("../models");

exports.createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      code,
      quantity,
      bprice,
      sprice,
      categoryCode,
      sname,
      semail,
      scontact,
    } = req.body;

    // Convert name, sname, code to uppercase
    const uppercaseName = name.toUpperCase();
    const uppercaseSname = sname.toUpperCase();
    const uppercaseCode = code.toUpperCase();
    
    // Convert email to lowercase
    const lowercaseSemail = semail.toLowerCase();

    const category = await Category.findOne({ where: { code: categoryCode } });

    if (!category) {
      return res.json({
        success: false,
        message: "Category does not exist",
      });
    }

    const existingProduct = await Product.findOne({ where: { code: uppercaseCode } });

    if (existingProduct) {
      return res.json({
        success: false,
        message: "Product already exists",
      });
    }

    if (quantity > category.volume || quantity <= 0) {
      return res.json({
        success: false,
        message: "Invalid product quantity",
      });
    }

    const remainingVolume = category.volume - quantity;
    category.volume = remainingVolume;
    await category.save();

    const product = await Product.create({
      name: uppercaseName, // Store name in uppercase
      code: uppercaseCode, // Store code in uppercase
      quantity,
      bprice,
      sprice,
      categoryCode,
      userId,
      sname: uppercaseSname, // Store sname in uppercase
      semail: lowercaseSemail, // Convert email to lowercase
      scontact,
    });

    res.json({
      success: true,
      message: "Product listed successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
    });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;
    const quantity = req.body.quantity;

    const existingProduct = await Product.findOne({ where: { id } });
    
    const category = await Category.findOne({
      where: { code: req.body.categoryCode },
    });
 
    if (!existingProduct) {
      return res.json({
        success: false,
        message: "Product does not exist",
      });
    } else if (!category) {
      return res.json({
        success: false,
        message: "Category does not exist",
      });
    }

    if (userId == existingProduct.userId || req.user.roles == "ADMIN") {
      existingProduct.set(req.body);
      await existingProduct.save();

      const remainingVolume = category.volume - quantity;
      if (remainingVolume <= 0) {
        // Notify frontend about the quantity reaching 0
        io.emit('productQuantityZero', { productId: id });
      }
      category.volume = remainingVolume;
      await category.save();

      return res.json({
        success: true,
        message: "Stock Updated succesfully",
      });
    } else {
      return res.json({
        success: false,
        message: "You don't have permission to update this product",
      });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const existingProduct = await Product.findOne({ where: { id } });

  if (!existingProduct) {
    return res.json({
      success: false,
      message: "Product does not exist",
    });
  }

  const existingUser = req.user.id;

  if (existingUser == existingProduct.userId || req.user.roles == "ADMIN") {
    try {
      const categoryCode = existingProduct.categoryCode;
      if (categoryCode) {
        const category = await Category.findOne({
          where: { code: categoryCode },
        });
        if (category) {
          const catVolume = category.volume + existingProduct.quantity;
          category.volume = catVolume;
          await category.save();
        }
      }

      // Delete associated sales records first
      await Sales.destroy({ where: { productId: id } });

      // Now you can safely delete the product
      await existingProduct.destroy();

      return res.json({
        success: true,
        message: "Product deleted",
      });
    } catch (error) {
      console.error("Error deleting the product:", error);
      return res.json({
        success: false,
        message: "Error deleting the product",
      });
    }
  } else {
    return res.json({
      success: false,
      message: "You don't have permission to delete this product",
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    
    if (!products || products.length === 0) {
      return res.json({
        status: false,
        message: "Products not found.",
      });
    }
    
    const userIds = products.map(product => product.userId);
    const users = await User.findAll({
      where: {
        id: userIds
      }
    });

    const productData = products.map(product => {
      const user = users.find(user => user.id === product.userId);
      return {
        id: product.id,
        name: product.name,
        code:product.code,
        quantity:product.quantity,
        bprice:product.bprice,
        sprice:product.sprice,
        sname:product.sname,
        scontact:product.scontact,
        semail:product.semail,
        categoryCode:product.categoryCode,
        createdAt:product.createdAt,
        updatedAt:product.updatedAt,
        userName: user ? user.name : "Unknown User",
      };
    });

    return res.json({
      success: true,
      products: productData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


exports.getAllRecentProduct = async (req, res) => {
  try {
    const latestPurchase = await Product.findAll({
      order: [["createdAt", "DESC"]], // Sort by createdAt in descending order (latest first)
    });

    res.json({
      success: true,
      purchase: latestPurchase,
    });
  } catch (error) {
    console.error("Error fetching latest Purchase:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching latest Purchase",
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ where: { id } });  
  const userIds = product.userId
  const userInfo = await User.findAll({
    where: {
      id: userIds
    }
  });
  if (!product) {
    res.json({
      status: false,
      message: "Product not found.",
    }); 
  } else {
    res.json({ 
      success: true,
      product,
      userInfo
    });
  }
};
