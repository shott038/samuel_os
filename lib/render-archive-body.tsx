import type { ReactNode } from "react";

/**
 * Render an archive body string into JSX.
 * Splits on blank lines into paragraphs; lines starting with `- ` inside a
 * paragraph become a `<ul>`. Pure function — no side effects.
 */
export function renderArchiveBody(body: string): ReactNode {
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return paragraphs.map((para, pi) => {
    const lines = para.split("\n");
    const isList = lines.every((l) => l.trim().startsWith("- "));

    if (isList) {
      return (
        <ul key={pi} className="list-disc space-y-1 pl-5 text-text/85">
          {lines.map((l, li) => (
            <li key={li} className="leading-relaxed">
              {l.replace(/^\s*-\s+/, "")}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={pi} className="leading-relaxed text-text/85">
        {para}
      </p>
    );
  });
}
