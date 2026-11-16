import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props { children: string; }

export function MarkdownContent({ children }: Props) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: content }) => (
            <a href={href} target="_blank" rel="noreferrer">{content}</a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
