import { getAttachment } from "@/lib/notice";
import { createDownloadUrl } from "@/lib/s3";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const file = Number.isInteger(id) ? getAttachment(id) : undefined;

  if (!file) return new Response("Not Found", { status: 404 });

  return new Response(null, {
    status: 302,
    headers: {
      Location: await createDownloadUrl(file.s3Key, file.fileName),
      "Cache-Control": "no-store",
    },
  });
}
