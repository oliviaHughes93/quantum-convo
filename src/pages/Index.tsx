import { useState } from "react";
import { useAccount } from 'wagmi';
import ChatHeader from "@/components/ChatHeader";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useContract } from "@/hooks/useContract";

interface Message {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
  isEncrypted: boolean;
}

interface Contact {
  id: string;
  name: string;
  address: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

const Index = () => {
  const { isConnected, address } = useAccount();
  const { addContact, isLoading } = useContract();
  
  const [contacts, setContacts] = useState<Contact[]>([
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
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey Alice! Testing the FHE encryption.",
      isSent: true,
      timestamp: "10:30",
      isEncrypted: true,
    },
    {
      id: "2",
      text: "Amazing! This encrypted messaging is working perfectly. The on-chain storage is seamless.",
      isSent: false,
      timestamp: "10:32",
      isEncrypted: true,
    },
    {
      id: "3",
      text: "Yes! And the best part is that the messages are computationally private even on the blockchain.",
      isSent: true,
      timestamp: "10:33",
      isEncrypted: true,
    },
  ]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAddFriend = async (contactAddress: string, name: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Add contact to blockchain
      await addContact(contactAddress, name);
      
      // Add contact to local state
      const newContact: Contact = {
        id: Date.now().toString(),
        name,
        address: contactAddress,
        lastMessage: "No messages yet",
        timestamp: "now",
        isOnline: Math.random() > 0.5, // Random online status
        unreadCount: 0,
      };
      setContacts(prev => [...prev, newContact]);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div className="flex h-screen bg-chat-bg">
      {/* Sidebar */}
      <ChatSidebar contacts={contacts} onAddFriend={handleAddFriend} />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader />
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-chat-bg to-background/50">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isSent={message.isSent}
                timestamp={message.timestamp}
                isEncrypted={message.isEncrypted}
              />
            ))}
          </div>
        </div>
        
        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Index;
