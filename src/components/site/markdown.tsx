/**
 * Minimal markdown renderer for our own author-controlled legal-page content
 * (headings, paragraphs, bold, italic, links, simple lists). Not a general
 * markdown parser and not meant for user-generated content.
 */

function renderInline(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  // Matches **bold**, [text](url), or plain runs of text.
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[1]}</strong>);
    } else if (match[2] !== undefined && match[3] !== undefined) {
      const href = match[3];
      const isExternal = href.startsWith("http");
      nodes.push(
        <a
          key={`${keyPrefix}-${i++}`}
          href={href}
          className="text-gold underline underline-offset-2 transition-colors hover:text-gold/80"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {match[2]}
        </a>,
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.split("\n\n").filter((b) => b.trim().length > 0);

  return (
    <div className="space-y-5 text-[1.04rem] leading-[1.75] text-muted-foreground">
      {blocks.map((block, blockIndex) => {
        const key = `block-${blockIndex}`;

        if (block.startsWith("## ")) {
          return (
            <h2 key={key} className="font-display text-2xl font-semibold text-foreground pt-4">
              {block.slice(3)}
            </h2>
          );
        }

        if (block.startsWith("_") && block.endsWith("_") && !block.includes("\n")) {
          return (
            <p key={key} className="italic text-sm">
              {block.slice(1, -1)}
            </p>
          );
        }

        const lines = block.split("\n");
        if (lines[0]?.startsWith("- ")) {
          // A source line that doesn't start with "- " is a soft-wrapped
          // continuation of the previous bullet, not a new one.
          const items: string[] = [];
          for (const line of lines) {
            if (line.startsWith("- ")) {
              items.push(line.slice(2));
            } else if (items.length > 0) {
              items[items.length - 1] += " " + line;
            }
          }
          return (
            <ul key={key} className="ml-6 list-disc space-y-2">
              {items.map((item, i) => (
                <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
              ))}
            </ul>
          );
        }

        // Join wrapped source lines into one string before applying inline
        // formatting - **bold** or a [link](url) can span across a line
        // break in the source and won't match if processed line-by-line.
        return <p key={key}>{renderInline(lines.join(" "), key)}</p>;
      })}
    </div>
  );
}
