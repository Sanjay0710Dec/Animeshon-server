import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const bucketName = process.env.AWS_BUCKET_NAME || "";
const bucketRegion = process.env.AWS_BUCKET_REGION || "";
const accessKey = process.env.AWS_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

export async function signedUrlToGetObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command);
    return signedUrl;
  } catch (error: any) {
    throw error;
  }
}

export async function signedUrlToPutObject(fileName: string, fileType: string) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 120 });
    return signedUrl;
  } catch (error: any) {
    throw error;
  }
}
