const User = require('../models/user'); // make sure give correct name (Case-sesnsetive)
const { use } = require('../routes/user');

const Order = require('../models/order');


exports.getUserById = ( req, res, next, id ) => {
    User.findById( id ).exec( ( err, user ) => {
        if( err || !user ) {
            return res.status(400).json({
                error: "No User found in DB"
            })
        }
        req.profile = user;
        next();
    });
};

exports.getUser = ( req, res ) => {
    req.profile.salt = undefined; // removing salt from the user object
    req.profile.encry_password = undefined; // we can remove it by assigning it a empty string, but it'll be listed in profile as null
    // res.profile.createdAt = "";
    // res.profile.updatedAt = "";
    return res.json( req.profile );
}

// exports.getUsers = ( req, res ) => {
//     User.find().exec( ( err, users ) => {
//         if( err || !users ) {
//             return res.status(400).json({
//                 error: "No Users found in DB"
//             });
//         }
//         res.json(users); 
//     });
// };

exports.updateUser = ( req, res ) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false }, // as per documentation
        ( err, user ) => {
            if (err) {
                return res.status(400).json({
                    error: "You're not autherized to Update"
                });
            }
            user.encry_password = undefined;
            user.salt = undefined;
            res.json( user );
        }
    )
}

exports.userPurchaseList = ( req, res ) => {
    Order.find( { user: req.profile._id } )
    .populate( "user", "_id name" )
    .exec( ( err, order ) => {
        if (err) {
            return res.status(400).json({
                error: "No orders made"
            });
        }
        return res.json( order );
    })
}

exports.pushOrderInPurchaseList = ( req, res, next ) => {
    let purchases = [];
    req.body.order.products.forEach( product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quntity: product.quntity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    });

    // Store this in DB
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } }, // usign push as that db columnm in an array
        { new: true }, // this will return updated object in return (not the old one)
        ( err, purchase ) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save purchase list"
                });
            }
            next();
        }
    )
}