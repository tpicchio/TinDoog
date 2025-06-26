import { S3Client } from '@aws-sdk/client-s3';
import { isAwsConfigured } from './aws';

// Singleton pattern for S3 client (similar to Prisma)
const globalForS3 = globalThis;

export const s3Client = globalForS3.s3Client ?? (
  isAwsConfigured() ? new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }) : null
);

if (process.env.NODE_ENV !== 'production') globalForS3.s3Client = s3Client;

export const AWS_CONFIG = {
  BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  REGION: process.env.AWS_REGION || 'us-east-1',
  isConfigured: isAwsConfigured,
};
