const cloudinary = require('cloudinary');

cloudinary.config ({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_KAY ,
    api_secret : process.env.CLOUD_SECRIT,
});
// cloudinary upload image
const cloudUpload = async (file) => {
    try {
        const data = await cloudinary.uploader.upload(file,{
            resource_type: 'auto',
        })
        return data;
    }catch (error) {
        console.log(error)
    }
    throw new Error ('Error in uploading image');
}

// دالة حذف الصورة
const removeImage = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Image deleted:', result);
      return result;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

module.exports = {
    removeImage,
    cloudUpload,
};
