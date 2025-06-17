import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const AWS_CONFIG = {
  BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  REGION: process.env.AWS_REGION || 'us-east-1',
};

export { s3Client };
