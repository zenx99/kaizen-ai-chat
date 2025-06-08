
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const MessageBubble = ({ message, isUser, timestamp }: MessageBubbleProps) => {
  // Parse code blocks from the message
  const parseMessage = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText.trim()) {
          parts.push({ type: 'text', content: beforeText });
        }
      }

      // Add the code block
      const language = match[1] || '';
      const code = match[2].trim();
      parts.push({ type: 'code', content: code, language });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push({ type: 'text', content: remainingText });
      }
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const messageParts = parseMessage(message);

  return (
    <div className={cn(
      "flex w-full mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] sm:max-w-[75%] md:max-w-[70%]",
        isUser 
          ? "bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-sm" 
          : "bg-transparent"
      )}>
        {/* User messages */}
        {isUser ? (
          <>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
            <p className="text-xs mt-1 opacity-70 text-right">
              {timestamp.toLocaleTimeString('th-TH', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </>
        ) : (
          /* AI messages with code block support */
          <div className="space-y-3">
            {messageParts.map((part, index) => (
              <div key={index}>
                {part.type === 'text' ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                    {part.content}
                  </p>
                ) : (
                  <CodeBlock 
                    code={part.content} 
                    language={part.language} 
                    className="my-3"
                  />
                )}
              </div>
            ))}
            <p className="text-xs opacity-60 text-muted-foreground">
              {timestamp.toLocaleTimeString('th-TH', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
