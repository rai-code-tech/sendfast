import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9002";
if (!endpoint.startsWith("http")) {
  throw new Error(
    `MINIO_ENDPOINT must include protocol (http/https). Got: "${endpoint}"`
  );
}

export const s3 = new S3Client({
  endpoint,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.MINIO_BUCKET || "sendfast";

let bucketReady = false;

export async function ensureBucket() {
  if (bucketReady) return;

  console.log(`[s3] ensureBucket — endpoint=${endpoint} bucket=${BUCKET}`);

  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log(`[s3] bucket exists`);
  } catch (err: unknown) {
    const status = (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 404) {
      console.log(`[s3] bucket not found, creating...`);
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
      console.log(`[s3] bucket created`);
    } else {
      console.error(`[s3] HeadBucket failed — status=${status}`, err);
      throw err;
    }
  }

  // Set CORS so browsers can PUT directly via presigned URLs
  try {
    await s3.send(
      new PutBucketCorsCommand({
        Bucket: BUCKET,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedOrigins: ["*"],
              AllowedMethods: ["GET", "PUT", "HEAD"],
              AllowedHeaders: ["*"],
              ExposeHeaders: ["ETag"],
              MaxAgeSeconds: 3600,
            },
          ],
        },
      })
    );
    console.log(`[s3] CORS configured`);
  } catch (err: unknown) {
    // Non-fatal — CORS may already be set or managed externally
    console.warn(`[s3] PutBucketCors failed (non-fatal):`, err);
  }

  bucketReady = true;
}

export async function getPresignedUploadUrl(key: string) {
  await ensureBucket();
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: "application/octet-stream",
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export async function getPresignedDownloadUrl(key: string, filename: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${encodeURIComponent(filename)}"`,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export async function deleteFile(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}
