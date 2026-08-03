import React, { useState } from "react";
import { Copy, Check, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  role: "user" | "model" | "system";
  content: string;
}

interface MessageItemProps {
  message: Message;
}

const renderInlineMarkdown = (line: string) => {
  const parts: React.ReactNode[] = [];
  const inlineRegex = /(\*\*|__)(.*?)\1|`([^`]+)`/g;
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(line)) !== null) {
    const textBefore = line.slice(lastIndex, match.index);
    if (textBefore) {
      parts.push(textBefore);
    }

    if (match[1]) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={`code-${match.index}`}
          className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-primary"
        >
          {match[3]}
        </code>
      );
    }

    lastIndex = inlineRegex.lastIndex;
  }

  const textAfter = line.slice(lastIndex);
  if (textAfter) {
    parts.push(textAfter);
  }

  return parts.length > 0 ? parts : line;
};

const renderTextBlocks = (text: string) => {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 my-2 space-y-1 text-muted-foreground">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith("•") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith("*")
    ) {
      const content = trimmed.substring(1).trim();
      currentList.push(
        <li key={`li-${index}`} className="text-sm leading-relaxed text-muted-foreground">
          {renderInlineMarkdown(content)}
        </li>
      );
    } else {
      flushList(index);
      if (trimmed === "") {
        elements.push(<div key={`space-${index}`} className="h-2" />);
      } else {
        elements.push(
          <p key={`p-${index}`} className="text-sm leading-relaxed text-muted-foreground my-1">
            {renderInlineMarkdown(line)}
          </p>
        );
      }
    }
  });

  flushList(lines.length);
  return elements;
};

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-border/80 bg-zinc-950 text-zinc-100 font-mono text-xs shadow-md">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900 text-zinc-400 select-none">
        <span className="text-[10px] font-bold uppercase tracking-wider">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 hover:text-zinc-200 transition-colors text-[11px]"
          title="Copy code"
        >
          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed scrollbar-thin">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

const MessageItem = ({ message }: MessageItemProps) => {
  const isBot = message.role === "model" || message.role === "system";
  const [copied, setCopied] = useState(false);

  const copyMessageText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown into code blocks & text blocks
  const parseBlocks = (text: string) => {
    const blocks: React.ReactNode[] = [];
    const codeBlockRegex = /```([a-zA-Z0-9-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    let blockCount = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const textBefore = text.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        blocks.push(
          <div key={`text-${blockCount++}`}>
            {renderTextBlocks(textBefore)}
          </div>
        );
      }
      blocks.push(
        <CodeBlock
          key={`code-block-${blockCount++}`}
          language={match[1] || "code"}
          code={match[2]}
        />
      );
      lastIndex = codeBlockRegex.lastIndex;
    }

    const textAfter = text.slice(lastIndex);
    if (textAfter.trim() || blocks.length === 0) {
      blocks.push(
        <div key={`text-${blockCount++}`}>
          {renderTextBlocks(textAfter)}
        </div>
      );
    }

    return blocks;
  };

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%] animate-fade-in mb-4",
        isBot ? "self-start" : "self-end flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0 border select-none",
          isBot
            ? "bg-primary/10 border-primary/20 text-primary"
            : "bg-muted border-border text-muted-foreground"
        )}
      >
        {isBot ? <Bot size={16} /> : <User size={16} />}
      </div>

      {/* Message Box */}
      <div className="flex flex-col gap-1 group">
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-200 relative",
            isBot
              ? "bg-card border border-border text-foreground rounded-tl-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm"
          )}
        >
          {isBot ? (
            parseBlocks(message.content)
          ) : (
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Timestamp / Actions */}
        {isBot && (
          <button
            onClick={copyMessageText}
            className="flex items-center gap-1 self-start text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5 hover:text-foreground pl-1"
          >
            {copied ? (
              <>
                <Check size={10} className="text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={10} />
                <span>Copy message</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
