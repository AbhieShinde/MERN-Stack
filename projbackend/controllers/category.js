const Category = require('../models/category');
// const category = require('../models/category');

exports.getCategoryById = ( req, res, next, id ) => {
    Category.findById( id ).exec( ( err, category ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Category not found in DB'
            })
        }
        req.category = category;
        next();
    } )
}

exports.createCategory = ( req, res ) => {
    const category = new Category(req.body);
    category.save( ( err, category ) => { // make sure to use category variable not 'C'ategory
        if (err) {
            return res.status( 400 ).json({
                error: 'NOT able to save a category in DB'
            })
        }
        res.json({category}); 
    })
}

exports.getCategory = ( req, res ) => {
    return res.json(req.category);
}

exports.getAllCategories = ( req, res ) => {
    Category.find().exec( ( err, allCategories ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'NO categories found in DB'
            })
        }
        res.json({ allCategories });
    } )
}

exports.updateCategory = ( req, res ) => {
    const category = req.category; // the reason why there's a category DB object in request's object is because of param function 'getCategoryById'
    category.name = req.body.name;

    category.save( (err, updatedCategory) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'FAILED to update category'
            })
        }
        res.json({updatedCategory});
    })
}

exports.deleteCategory = ( req, res ) => {
    const category = req.category; // the reason why there's a category DB object in request's object is because of param function 'getCategoryById'
    category.name = req.body.name;

    category.remove( (err, objDeletedCategory) => { // objDeletedCategory is not from Database
        if (err) {
            return res.status( 400 ).json({
                error: 'FAILED to delete category'
            })
        }
        res.json({
            message: "Category Successfully Deleted"
        });
    })
}