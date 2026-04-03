import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { codeToHtml } from "shiki";
import { logError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const docPath = query.path as string;

  if (!docPath) {
    throw createError({ statusCode: 400, statusMessage: "Path is required" });
  }

  const markdownsDir = path.resolve(process.cwd(), "server", "markdowns");
  const filePath = path.resolve(markdownsDir, `${docPath}.md`);

  if (!filePath.startsWith(markdownsDir + path.sep)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid path" });
  }

  try {
    const md = await fs.readFile(filePath, "utf-8");

    // Create a custom renderer for marked to use Shiki
    const renderer = new marked.Renderer();

    renderer.code = function ({ text, lang, escaped }) {
      // We will handle this asynchronously below
      return `<!-- CODE_BLOCK_START:${lang || "plaintext"} -->${text}<!-- CODE_BLOCK_END -->`;
    };

    let html = await marked.parse(md, { renderer });

    // Find and replace code blocks with Shiki highlighted HTML
    const codeBlockRegex =
      /<!-- CODE_BLOCK_START:(.*?) -->([\s\S]*?)<!-- CODE_BLOCK_END -->/g;
    let match;
    const replacements: { placeholder: string; html: string }[] = [];

    while ((match = codeBlockRegex.exec(html)) !== null) {
      const lang = match[1] || "plaintext";
      const code = match[2] || "";
      const highlighted = await codeToHtml(code, {
        lang,
        themes: {
          light: "catppuccin-latte",
          dark: "dark-plus",
        },
      });
      replacements.push({ placeholder: match[0], html: highlighted });
    }

    for (const replacement of replacements) {
      html = html.replace(replacement.placeholder, replacement.html);
    }

    return html;
  } catch (err) {
    logError("markdown.render", err);
    throw createError({
      statusCode: 404,
      statusMessage: "Markdown file not found",
    });
  }
});
