import { Lock } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isSent: boolean;
  timestamp: string;
  isEncrypted?: boolean;
}

const ChatMessage = ({ message, isSent, timestamp, isEncrypted = true }: ChatMessageProps) => {
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-message transition-bounce hover:scale-[1.02] ${
          isSent
            ? "bg-gradient-message text-message-text-sent rounded-br-md"
            : "bg-message-received text-message-text-received rounded-bl-md"
        }`}
      >
        <div className="flex items-start gap-2 mb-1">
          {isEncrypted && (
            <Lock className="w-3 h-3 text-encryption mt-0.5 flex-shrink-0" />
          )}
          <p className="text-sm leading-relaxed break-words">{message}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs opacity-70 ${isSent ? "text-message-text-sent" : "text-message-text-received"}`}>
            {timestamp}
          </span>
          {isSent && (
            <div className="flex space-x-1 ml-2">
              <div className={`w-1 h-1 rounded-full ${isEncrypted ? "bg-encryption" : "bg-current opacity-50"}`} />
              <div className={`w-1 h-1 rounded-full ${isEncrypted ? "bg-encryption" : "bg-current opacity-50"}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;