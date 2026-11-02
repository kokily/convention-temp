import "server-only";
import sanitizeHtml from "sanitize-html";

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
  });
}

export function toPlainText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
}
