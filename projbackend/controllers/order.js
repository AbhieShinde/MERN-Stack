const { Order, ProductCart } = require('../models/order');

exports.getOrderById = ( req, res, next, id ) => {
    Order.findById(id)
    .populate("products.product", "name price") // no commas in 2nd arg
    .exec( ( err, order ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'No Order found'
            })
        }
        req.order = order;
        next();
    })
}

exports.createOrder = ( req, res ) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);

    order.save( ( err, order ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Unable to save the Order'
            })
        }
        return res.json(order);
    })
}

exports.getAllOrders = ( req, res ) => {
    Order.find()
    .populate("user", "_id name")
    .exec( ( err, allOrders ) => {
        if (err) {
            return res.status( 400 ).json({
                error: 'Unable fetch the orders'
            })
        }
        return res.json(allOrders);
    })
}

exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
}

exports.updateStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if (err) {
                return res.status( 400 ).json({
                    error: 'Unable to update the Order status'
                })
            }
            res.json(order); // no return is also fine, in above method as well
        }
    )
}