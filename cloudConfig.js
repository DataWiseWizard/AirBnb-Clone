const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.cloud_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// const storage = new cloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "wanderlust_DEV",
//         allowedFormats: ["png","jpj", "jpeg"],
//         public_id: (req, res) => 'computed-filename-using-request',
//     },
// })



module.exports = {
    cloudinary,
}