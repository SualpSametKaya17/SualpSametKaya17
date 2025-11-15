import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-sm max-w-none"
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />
        ),
        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
        ),
        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-gray-800 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            />
          ) : (
            <code
              className="block bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm font-mono my-2"
              {...props}
            />
          ),
        pre: ({ node, ...props }) => (
          <pre className="bg-gray-900 rounded-lg overflow-x-auto my-2" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border border-gray-300" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold text-left" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 px-3 py-2" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-blue-500 pl-4 italic my-2 text-gray-600"
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a className="text-blue-600 hover:underline" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        em: ({ node, ...props }) => <em className="italic" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
