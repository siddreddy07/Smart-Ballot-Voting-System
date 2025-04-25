import cloudinary from '../config/cloudinary.js';

// Helper to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1]; // e.g., "abc123.jpg"
  const publicId = fileName.split('.')[0];  // e.g., "abc123"
  const folder = parts[parts.length - 2];   // e.g., "users"

  return `${folder}/${publicId}`; // e.g., "users/abc123"
};

// Upload Image
export const uploadImage = async (base64Image, folder = 'users') => {
  try {
    if (!base64Image) {
      throw new Error('No image data provided.');
    }

    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
    });

    return result.secure_url; // Return only the URL
  } catch (error) {
    console.error('Cloudinary upload error:', error); // Log full error for debugging
    const errorMessage = error?.message || error?.error?.message || JSON.stringify(error);
    throw new Error('Image upload failed: ' + errorMessage);
  }
};

// Delete Image
export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      throw new Error('No image URL provided.');
    }

    const publicId = getPublicIdFromUrl(imageUrl);
    await cloudinary.uploader.destroy(publicId);
    return { message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Cloudinary delete error:', error); // Log full error for debugging
    const errorMessage = error?.message || error?.error?.message || JSON.stringify(error);
    throw new Error('Image deletion failed: ' + errorMessage);
  }
};
