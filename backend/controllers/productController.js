const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

exports.newProduct = catchAsyncErrors (async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})


exports.getProducts = catchAsyncErrors (async (req, res, next) => {

    // APi withouth search
    // const apiFeatures = new APIFeatures(Product.find(), req.query)
    // const products = await Product.find();

    //api with search

    const resPerPage = 4;
    const productCount = await Product.countDocuments()

    const apiFeatures = new APIFeatures(Product.find(), req.query)
                        .search()
                        .filter()
                        .pagination(resPerPage)

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
})

exports.getSingleProduct = catchAsyncErrors (async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if(!product) {
        // return res.status(404).json({
        //     success: false,
        //     message: 'Product not found'
        // })

        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        product
    })
})

exports.updateProduct = catchAsyncErrors (async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    
    res.status(200).json({
        success: true,
        product
    });
})
//delete /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors (async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    await product.deleteOne();
    
    res.status(200).json({
        success: true,
        message: 'product is deleted'
    });
})