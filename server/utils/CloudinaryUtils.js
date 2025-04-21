import cloudinary from '../config/cloudinary.js';

// Helper to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1]; // e.g. "abc123.jpg"
  const publicId = fileName.split('.')[0];  // e.g. "abc123"
  const folder = parts[parts.length - 2];   // e.g. "users"

  return `${folder}/${publicId}`;           // e.g. "users/abc123"
};

export const uploadImage = async (base64Image, folder = 'users') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
    });
    return result.secure_url; // only return the URL
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message);
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    const publicId = getPublicIdFromUrl(imageUrl);
    await cloudinary.uploader.destroy(publicId);
    return { message: 'Image deleted successfully' };
  } catch (error) {
    throw new Error('Image deletion failed: ' + error.message);
  }
};
