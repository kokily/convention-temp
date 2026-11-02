export type AttachmentInput = {
  id?: number;
  fileName: string;
  s3Key: string;
  size: number;
};

export async function putFile(url: string, file: File, contentType: string) {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!response.ok) throw new Error("업로드 실패");
}
