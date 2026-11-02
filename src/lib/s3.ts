import "server-only";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION!;
const bucket = process.env.S3_BUCKET!;

const client = new S3Client({
  region,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export const IMAGE_BASE = `https://${bucket}.s3.${region}.amazonaws.com/`;

export function createUploadUrl(key: string, contentType: string) {
  return getSignedUrl(client, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }), {
    expiresIn: 300,
  });
}

export function createDownloadUrl(key: string, fileName: string) {
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    }),
    { expiresIn: 60 }
  );
}

export async function deleteObjects(keys: string[]) {
  const results = await Promise.allSettled(
    keys.map((key) => client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key })))
  );

  for (const result of results) {
    if (result.status === "rejected") console.error("S3 삭제 실패", result.reason);
  }
}

export function imageKeysIn(html: string) {
  return [...html.matchAll(/src="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((src) => src.startsWith(IMAGE_BASE))
    .map((src) => src.slice(IMAGE_BASE.length));
}
