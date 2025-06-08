
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Prism from 'prismjs';

// Import languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-html';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeBlock = ({ code, language = "", className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState(code);

  useEffect(() => {
    if (language && Prism.languages[language]) {
      try {
        const highlighted = Prism.highlight(code, Prism.languages[language], language);
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error('Syntax highlighting error:', error);
        setHighlightedCode(code);
      }
    } else {
      setHighlightedCode(code);
    }
  }, [code, language]);

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
    <div className={cn("relative group my-3 rounded-lg border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between bg-muted/30 px-3 py-2 border-b text-xs">
        <span className="font-medium text-muted-foreground">
          {language || 'plaintext'}
        </span>
        <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
          {canRun && (
            <Button
              variant="ghost"
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="h-7 px-2 text-xs hover:bg-accent"
            >
              <Play className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{isRunning ? 'Running...' : 'Run'}</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-7 px-2 text-xs hover:bg-accent"
          >
            <Copy className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
        </div>
      </div>

      {/* Code content */}
      <div className="relative">
        <pre className="p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed bg-muted/10">
          <code 
            className="font-mono text-foreground block"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
