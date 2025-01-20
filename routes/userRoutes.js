const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

router.post("/adduserdetail", async (req, res) => {
  const { name, email, phone, address, message, selectedProducts } = req.body;

  try {
    const formattedProducts = [];

    for (const product of selectedProducts) {
      const foundProduct = await Product.findById(product.product);
      if (!foundProduct) {
        return res
          .status(404)
          .json({ error: `Product with ID ${product.product} not found` });
      }

      const totalVolume = parseFloat(
        foundProduct.volume * product.quantity
      ).toFixed(3);

      formattedProducts.push({
        product: foundProduct._id,
        name: foundProduct.name,
        quantity: product.quantity,
        volume: totalVolume,
      });
    }

    const user = new User({
      name,
      email,
      phone,
      address,
      message,
      selectedProducts: formattedProducts,
    });

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/getalluserdetails", async (req, res) => {
  try {
    const users = await User.find().populate("selectedProducts.product");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
