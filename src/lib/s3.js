import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_CONFIG } from './aws-config';

/**
 * Generate fresh presigned URL for S3 object
 * @param {string} s3Key - S3 object key
 * @param {number} expiresIn - URL expiry in seconds (default: 15 minutes)
 * @param {string} placeholder - Fallback placeholder type
 * @returns {Promise<string>} Presigned URL or placeholder
 */
export async function generatePresignedUrl(s3Key, expiresIn = 900, placeholder = 'profile') {
  if (!s3Client || !AWS_CONFIG.isConfigured()) {
    const placeholders = {
      profile: 'https://via.placeholder.com/400x400/6366f1/white?text=Profile',
      photo: 'https://via.placeholder.com/300x400/gray/white?text=Photo',
      error: 'https://via.placeholder.com/400x400/red/white?text=Error'
    };
    
    return placeholders[placeholder] || placeholders.profile;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: s3Key,
    });
    
    return await getSignedUrl(s3Client, command, {
      expiresIn,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return 'https://via.placeholder.com/400x400/red/white?text=Error';
  }
}

/**
 * Generate multiple presigned URLs for image array
 * @param {Array} images - Array of objects with s3Key property
 * @param {number} expiresIn - URL expiry in seconds
 * @returns {Promise<Array<string>>} Array of presigned URLs
 */
export async function generateMultiplePresignedUrls(images, expiresIn = 900) {
  if (!images || images.length === 0) {
    return [];
  }

  const urlPromises = images.map(async (image) => {
    try {
      return await generatePresignedUrl(image.s3Key, expiresIn, 'photo');
    } catch (error) {
      console.error(`Error generating URL for image ${image.s3Key}:`, error);
      return 'https://via.placeholder.com/300x400/gray/white?text=Error';
    }
  });
  
  return Promise.all(urlPromises);
}

// Re-export s3Client for direct use when needed
export { s3Client };