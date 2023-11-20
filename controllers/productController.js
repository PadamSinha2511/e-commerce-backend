const cloudinary = require("cloudinary");
const Product = require("../models/product");
const WhereClause = require("../utils/whereClause");
function handleTestProuct(req,res)
{   
     
    return res.status(200).json({msg:"Test Product page"});

}

async function handleAddProduct(req,res)
{
    //images 
    let imagesArray = [];
    if(!req.files)
    {
        return res.status(400).json({success:false,msg:"product image is required"})
    }

    if(req.files)
    {
        for(let index=0;index<req.files.photos.length;index++)
        {
            let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
                folder:"products"
            });
            imagesArray.push({
                id:result.public_id,
                secure_url:result.secure_url
            })
        }
    }

    req.body.photos = imagesArray;
    
    req.body.user = req.user._id

    const product = await Product.create(req.body)
    res.status(200).json({success:true,msg:"Product added successfully",product})


}

async function handleGetAllProduct(req,res){
    
    const resultPerPage = 6;
    // const countProduct = await Product.countDocuments();
  
    
    
    const productsObj = new WhereClause(Product.find(),req.query).search().filter();
    let products =await productsObj.base;
    const filteredProductsCount = products.length

    productsObj.pager(resultPerPage)
    products  = await productsObj.base.clone();

    return res.status(200).json({success:true,filteredProductsCount,products})
}

async function handleAdminGetAllProduct(req,res)
{
    const products = await Product.find();
    return res.status(200).json({success:true,products})
}

async function handleGetSingleProduct(req,res)
{
    const product_id = req.params.id;
    const product =await Product.findById(product_id);
    
    if(!product)
    {
        return res.status(400).json({success:false,msg:"No product found"});
    }

    return res.status(200).json({success:true,product})
}


async function handleUpdateProduct(req,res)
{
    const productId = req.params.id;
    let product = await Product.findById(productId);

    if(!product)
    {
        return res.status(400).json({success:false,msg:"No product found with the given id"});
    }
    let imagesArray=[];
    if(req.files)
    {
        //detroy the photos

        for(let index=0;index<req.files.photos.length;index++)
        {
            const picId = product.photos[index].id;
            const result = await cloudinary.v2.uploader.destroy(picId);
        }

        for(let index=0;index<req.files.photos.length;index++)
        {
            let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
                folder:'products'
            })


            imagesArray.push({
                id:result.public_id,
                secure_url:result.secure_url
            })
        }

        req.body.photo = imagesArray;
        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        return res.status(200).json({success:true,product})
    }
}

async function handleDeleteProduct(req,res)
{
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if(!product)
    {
        return res.status(400).json({success:false,msg:"No product found"})
    }

    for(let index=0;index<product.photos.length;index++)
    {
        const picId = product.photos[index].id;
        const result = await cloudinary.v2.uploader.destroy(picId);
    }

    await Product.deleteOne({_id:req.params.id});
    return res.status(200).json({success:true,msg:"Product deleted successfully"})

}

async function handleAddReview(req,res)
{
    const productId = req.params.id
    const {rating,comment} = req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product = await Product.findById(productId);
    if(!product)
    {
        return res.status(400).json({success:false,msg:"No product found"})
    }

    const alreadyReviewed = product.reviews.find((rev)=>{
        rev.user.toString() === req.user._id.toString()
    });

    if(alreadyReviewed)
    {
        product.reviews.forEach(rev=>{
            if(rev.user.toString() === req.user._id.toString())
            {
                rev.comment = comment;
                rev.rating = rating;
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length

    await product.save({validateBeforeSave:false});
    return res.status(200).json({success:true,msg:"Review added "})
}


async function handleDeleteReview(req,res)
{
    const productId  = req.params.id;
    const product = await Product.findById(productId);
    if(!product)
    {
        return res.status(400).json({success:false,msg:"No product found"})
    }

    const reviews = product.reviews.filter((rev)=>rev.user.toString()===req.user._id.toString())
    const numberOfReviews = reviews.length
    product.ratings = product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length

   await Product.findByIdAndUpdate(productId,{
    reviews,
    ratings,
    numberOfReviews
   },{
    new:true,
    runValidators:true
   })
}

async function handleGetOnlyReviews(req,res)
{
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if(!product)
    {
        return res.status(400).json({success:false,msg:"No product found"});
    }

    return res.status(200).json({success:true,reviews:product.reviews})
}
module.exports={
    handleTestProuct,
    handleAddProduct,
    handleGetAllProduct,
    handleAdminGetAllProduct,
    handleGetSingleProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddReview,
    handleDeleteReview,
    handleGetOnlyReviews
}