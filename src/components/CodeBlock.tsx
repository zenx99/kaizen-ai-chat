
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeBlock = ({ code, language = "", className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const runCode = () => {
    if (language.toLowerCase() === 'html' || code.includes('<html') || code.includes('<!DOCTYPE')) {
      setIsRunning(true);
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(code);
        newWindow.document.close();
      }
      setTimeout(() => setIsRunning(false), 1000);
    }
  };

  const canRun = language.toLowerCase() === 'html' || code.includes('<html') || code.includes('<!DOCTYPE');

  return (
    <div className={cn("relative group", className)}>
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {language || 'code'}
        </span>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canRun && (
            <Button
              variant="ghost"
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="h-6 px-2 text-xs"
            >
              <Play className="w-3 h-3 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-6 px-2 text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
      <div className="bg-muted/20 rounded-b-lg">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-foreground font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
