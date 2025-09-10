import { Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddFriendDialog from "@/components/AddFriendDialog";

interface Contact {
  id: string;
  name: string;
  address: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Alice",
    address: "0x1234...5678",
    lastMessage: "Hey, got your encrypted message!",
    timestamp: "2m",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Bob",
    address: "0x9876...4321",
    lastMessage: "FHE encryption is working perfectly",
    timestamp: "1h",
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Carol",
    address: "0xabcd...efgh",
    lastMessage: "Can you share the contract address?",
    timestamp: "3h",
    isOnline: true,
    unreadCount: 1,
  },
];

interface ChatSidebarProps {
  contacts: Contact[];
  onAddFriend: (address: string, name: string) => void;
}

const ChatSidebar = ({ contacts, onAddFriend }: ChatSidebarProps) => {
  return (
    <div className="w-80 bg-chat-sidebar border-r border-border flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 bg-background/50 border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-smooth"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {contact.name.charAt(0)}
                </div>
                {contact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-online border-2 border-chat-sidebar rounded-full" />
                )}
              </div>

              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                  <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3 text-encryption" />
                  <span className="text-xs text-muted-foreground font-mono">{contact.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate flex-1">
                    {contact.lastMessage}
                  </p>
                  {contact.unreadCount > 0 && (
                    <div className="ml-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-semibold">
                        {contact.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Friend Button */}
      <div className="p-4 border-t border-border">
        <AddFriendDialog onAddFriend={onAddFriend} />
      </div>
    </div>
  );
};

export default ChatSidebar;