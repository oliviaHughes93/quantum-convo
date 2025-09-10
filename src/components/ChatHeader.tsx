import { MessageCircle, Shield, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletConnect from "./WalletConnect";

interface ChatHeaderProps {
  contactName?: string;
  contactAddress?: string;
  isOnline?: boolean;
}

const ChatHeader = ({ contactName = "Alice", contactAddress = "0x1234...5678", isOnline = true }: ChatHeaderProps) => {
  return (
    <div className="bg-gradient-header border-b border-border shadow-header">
      <div className="flex items-center justify-between p-4">
        {/* Left Section - App Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="w-8 h-8 text-primary" />
            <Shield className="absolute -bottom-1 -right-1 w-4 h-4 text-encryption" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Quantum Convo</h1>
            <p className="text-sm text-muted-foreground">FHE Encrypted Messaging</p>
          </div>
        </div>

        {/* Right Section - Wallet */}
        <WalletConnect />
      </div>

      {/* Chat Contact Info */}
      {contactName && (
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                {contactName.charAt(0)}
              </div>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-online border-2 border-background rounded-full" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{contactName}</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-mono">{contactAddress}</span>
                <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-online" : "bg-muted-foreground"}`} />
                <span className="text-xs text-muted-foreground">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;