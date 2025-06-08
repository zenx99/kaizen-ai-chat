
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { sendMessage, ConversationMessage } from "@/utils/apiService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => Date.now().toString());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getConversationHistory = (): ConversationMessage[] => {
    return messages.filter(msg => !msg.isTyping).map(msg => ({
      role: msg.isUser ? 'user' as const : 'assistant' as const,
      content: msg.text
    }));
  };

  const handleSendMessage = async (text: string) => {
    const messageId = `${conversationId}-${Date.now()}`;
    const userMessage: Message = {
      id: messageId,
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = getConversationHistory();
      const response = await sendMessage(text, conversationHistory);
      
      const aiMessageId = `${conversationId}-${Date.now() + 1}`;
      const aiMessage: Message = {
        id: aiMessageId,
        text: response,
        isUser: false,
        timestamp: new Date(),
        isTyping: true,
      };

      console.log('User Message ID:', messageId);
      console.log('AI Response ID:', aiMessageId);
      console.log('Conversation History:', conversationHistory);

      setMessages(prev => [...prev, aiMessage]);
      
      // Remove typing indicator after a delay to allow typing animation to complete
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, isTyping: false } : msg
          )
        );
      }, response.length * 20 + 1000); // Adjust timing based on message length
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessageId = `${conversationId}-error-${Date.now()}`;
      const errorMessage: Message = {
        id: errorMessageId,
        text: "ขออภัย เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header - More compact on mobile */}
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <h1 className="text-lg sm:text-xl font-semibold">AI Chat</h1>
              <span className="text-xs text-muted-foreground hidden sm:inline">ID: {conversationId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages - Better mobile spacing */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">ยินดีต้อนรับสู่ AI Chat</h2>
            <p className="text-muted-foreground max-w-md text-sm sm:text-base">
              เริ่มบทสนทนากับ AI อัจฉริยะ ถามคำถามอะไรก็ได้ ฉันพร้อมช่วยเหลือคุณ
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                isTyping={message.isTyping}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Better mobile layout */}
      <div className="sticky bottom-0 bg-background border-t">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
