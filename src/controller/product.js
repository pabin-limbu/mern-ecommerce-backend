const Product = require("../models/product");
const slugify = require("slugify");
const category = require("../models/category");
const product = require("../models/product");

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
exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  category
    .findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            res.status(400).json({ error });
          }

          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ product });
          }
        });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "params required" });
  }
};
