export const isAwsConfigured = () => {
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET_NAME']
  return required.every(key => process.env[key] && process.env[key].trim() !== '')
}