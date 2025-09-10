import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddFriendDialogProps {
  onAddFriend: (address: string, name: string) => void;
}

const AddFriendDialog = ({ onAddFriend }: AddFriendDialogProps) => {
  const [open, setOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [friendName, setFriendName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress.trim() && friendName.trim()) {
      onAddFriend(walletAddress.trim(), friendName.trim());
      setWalletAddress("");
      setFriendName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white py-3 rounded-lg hover:opacity-90 transition-smooth">
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Friend</DialogTitle>
          <DialogDescription>
            Enter your friend's wallet address and display name to start chatting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Enter friend's name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Wallet Address</Label>
            <Input
              id="address"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono text-sm"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Add Friend
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;