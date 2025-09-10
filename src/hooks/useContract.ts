import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { toast } from 'sonner';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "registerUser",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contactAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addContact",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_messageId",
        "type": "uint256"
      }
    ],
    "name": "markMessageAsRead",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_messageId",
        "type": "uint256"
      }
    ],
    "name": "getMessageInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isRead",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const useContract = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (name: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'registerUser',
        args: [name],
      });
      toast.success('User registration initiated');
    } catch (err) {
      console.error('Error registering user:', err);
      toast.error('Failed to register user');
    } finally {
      setIsLoading(false);
    }
  };

  const addContact = async (contactAddress: string, name: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'addContact',
        args: [contactAddress as `0x${string}`, name],
      });
      toast.success('Contact added successfully');
    } catch (err) {
      console.error('Error adding contact:', err);
      toast.error('Failed to add contact');
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: number) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'markMessageAsRead',
        args: [BigInt(messageId)],
      });
      toast.success('Message marked as read');
    } catch (err) {
      console.error('Error marking message as read:', err);
      toast.error('Failed to mark message as read');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    addContact,
    markMessageAsRead,
    isLoading: isLoading || isPending || isConfirming,
    isConfirmed,
    error,
    isConnected,
    address,
  };
};

export const useMessageInfo = (messageId: number) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getMessageInfo',
    args: [BigInt(messageId)],
  });

  return {
    messageInfo: data,
    isLoading,
    error,
  };
};
