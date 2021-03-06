const Product = require("../models/product");

const slugify = require("slugify");

exports.createProduct = (req, res) => {
  // res.status(200).json({ file: req.file, body: req.body }); for single file.
  //res.status(200).json({ file: req.files, body: req.body }); for multiple files.
  const { name, price, description, category, quantity } = req.body;
  //since product picture is an array. fetch files from req and change it into an array as defined in schema.
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  const product = new Product({
    name: name,
    slug: slugify(name),
    price: price,
    quantity: quantity,
    description: description,
    productPictures: productPictures,
    category: category,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (product) {
      res.status(200).json({ product });
    }
  });
};
