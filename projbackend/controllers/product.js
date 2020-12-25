const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const category = require('../models/category');

exports.getProductById = ( req, res, next, id ) => {
    Product.findById( id )
    .populate("category")
    .exec( ( err, product ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Product not found in DB'
            })
        }
        req.product = product;
        next();
    } )
}

exports.getProduct = ( req, res ) => {
    req.product.photo = undefined; // as the photo data is very large binary data so we dont send it from here, we've a separate middler ware below to handle this req in the background
    return res.json(req.product); // req.product will be saved/initialized in above method
}

// middleware for performance optimisation of our application
exports.photo = ( req, res, next ) => {
    if (req.product.photo.data) { // if there's a data in photo key (column in context of SQL) of product
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.createProduct = ( req, res ) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse( req, ( err, fields, file ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Unable to process the request due to problem with attachments'
            })
        }

        // destructuring of fields
        const {name, price, description, category, stock} = fields;
        
        // we can express validations in route level instead of this as well
        if ( !name || !price || !description || !category || !stock ) {
            return res.status( 400 ).json({
                error: 'Please fill all the fields'
            })
        }

        let product = new Product(fields);

        // file handling
        if (file.photo) {
            if (file.photo.size > ( 1024 * 1024 * 3 )) { // we can use a direct number instead of this formulae ;)
                return res.status( 400 ).json({
                    error: 'File size should be less than 3 MB'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        product.save( ( err, product ) => {
            if (err) {
                return res.status( 400 ).json({
                    error: 'Unable to save the Product in DB'
                })
            }
            res.json(product);
        })
    })
}

exports.updateProduct = ( req, res ) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse( req, ( err, fields, file ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Unable to process the request due to problem with attachments'
            })
        }

        let product = req.product;
        product = _.extend( product, fields ) // all the updated/passed field values will be store in product obj now which was fetched from db and we'll save that itself with the updated values

        // file handling
        if (file.photo) {
            if (file.photo.size > ( 1024 * 1024 * 3 )) { // we can use a direct number instead of this formulae ;)
                return res.status( 400 ).json({
                    error: 'File size should be less than 3 MB'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        product.save( ( err, product ) => {
            if (err) {
                return res.status( 400 ).json({
                    error: 'Unable to update the Product in DB'
                })
            }
            res.json(product);
        })
    })
}

exports.deleteProduct = ( req, res ) => {
    let product = req.product;
    product.remove( ( err, deletedProduct ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Unable to delete the Product'
            })
        }
        return res.json({
            message: "Deletion Successful", deletedProduct
        })
    })
};

exports.allProducts = ( req, res ) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8; // parse it into int as JS will handle it as string as its given by user
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select("-photo") // dont select photo while fetching the products
    .populate("category") // do research on own for this
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec( ( err, products ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Unable to fetch Products'
            })
        }

        res.json(products);
    })
}

exports.getAllUniqueCategories = ( req, res ) => {
    Product.distinct("category", {}, ( err, categories ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'No category found'
            })
        }
        return res.json(categories);
    })
}

// middleware
exports.updateStock = ( req, res, next ) => {
    let myOperations = req.body.order.products.map(prod => { // foreach products as prod
        return {
            updateOne: {
                filter: {_id: prod._id}, //findById
                update: {$inc: {stock: -prod.count, sold: +prod.count}} // count is from user's product order, stock will decresed by count and sold will increse
            }
        }
    })

    Product.bulkWrite(myOperations, {}, ( err, products ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Unable to update! Bulk operation failed.'
            })
        }
        next();
    })
}