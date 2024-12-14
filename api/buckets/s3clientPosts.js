import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();

const bucketRegion = process.env.BUCKET_REGION1;
const accessKey = process.env.ACCESS_KEY1;
const secretAccessKey = process.env.SECRET_ACCESS_KEY1;

export const s3Posts = new S3Client({
  credentials: {
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKey,
  },
  region: bucketRegion,
});
