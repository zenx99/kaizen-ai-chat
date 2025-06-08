
const TypingIndicator = () => {
  return (
    <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[70%] bg-muted/30 rounded-2xl px-4 py-3 mb-6">
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
        </div>
        <span className="text-sm text-muted-foreground">AI กำลังตอบ...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
