import "server-only";
import sanitizeHtml from "sanitize-html";
import { IMAGE_BASE } from "@/lib/s3";

export function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "strong",
      "em",
      "s",
      "u",
      "code",
      "pre",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https"],
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src?.startsWith(IMAGE_BASE),
  });
}

export function toPlainText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
}
