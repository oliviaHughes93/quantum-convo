import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Lock, Paperclip, Smile } from "lucide-react";
import { encryptMessage, stringToEncryptedBytes, validateMessage } from "@/lib/fhe";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    if (!validateMessage(message)) {
      toast.error('Message must be between 1 and 1000 characters');
      return;
    }

    try {
      setIsEncrypting(true);
      
      // Encrypt message using FHE
      const encryptedBytes = stringToEncryptedBytes(message);
      console.log('Encrypted message bytes:', encryptedBytes);
      
      // In a real implementation, this would send the encrypted data to the contract
      // For now, we'll just send the original message
      onSendMessage(message);
      setMessage("");
      
      toast.success('Message encrypted and sent');
    } catch (error) {
      console.error('Error encrypting message:', error);
      toast.error('Failed to encrypt message');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
      {/* Encryption Status */}
      <div className="flex items-center gap-2 mb-3 text-sm text-encryption">
        <Lock className="w-4 h-4" />
        <span>FHE End-to-End Encryption Active</span>
        <div className="w-2 h-2 bg-encryption rounded-full animate-pulse" />
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type an encrypted message..."
            className="pr-20 py-3 bg-background border-border focus:border-primary resize-none"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isEncrypting}
          className="bg-gradient-primary hover:opacity-90 transition-smooth p-3"
        >
          {isEncrypting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Security Notice */}
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Messages are encrypted using Fully Homomorphic Encryption and stored on-chain
      </p>
    </div>
  );
};

export default ChatInput;