export default function extractionS3ImageKey(url) {
  return url.substr(process.env.AWS_S3_BASE_URL.length + 1);
}
