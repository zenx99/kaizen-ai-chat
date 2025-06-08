
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
    return messages.map(msg => ({
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
      // ส่งประวัติการสนทนาไปด้วย
      const conversationHistory = getConversationHistory();
      const response = await sendMessage(text, conversationHistory);
      
      const aiMessageId = `${conversationId}-${Date.now() + 1}`;
      const aiMessage: Message = {
        id: aiMessageId,
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      console.log('User Message ID:', messageId);
      console.log('AI Response ID:', aiMessageId);
      console.log('Conversation History:', conversationHistory);

      setMessages(prev => [...prev, aiMessage]);
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
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-center p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold">AI Chat</h1>
            <span className="text-xs text-muted-foreground">ID: {conversationId}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">ยินดีต้อนรับสู่ AI Chat</h2>
            <p className="text-muted-foreground max-w-md">
              เริ่มบทสนทนากับ AI อัจฉริยะ ถามคำถามอะไรก็ได้ ฉันพร้อมช่วยเหลือคุณ
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
