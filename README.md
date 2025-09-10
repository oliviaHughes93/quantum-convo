# Quantum Convo - FHE Encrypted Messaging

A decentralized messaging application built with Fully Homomorphic Encryption (FHE) for complete privacy and security.

## Features

- **FHE Encryption**: All messages are encrypted using Fully Homomorphic Encryption
- **Wallet Integration**: Connect with MetaMask, WalletConnect, and other Web3 wallets
- **Real-time Messaging**: Send and receive encrypted messages in real-time
- **Contact Management**: Add and manage contacts securely
- **Reputation System**: Built-in reputation system for users
- **On-chain Storage**: Messages stored on blockchain with FHE encryption

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Blockchain**: Solidity, Hardhat, FHEVM
- **Wallet**: RainbowKit, Wagmi
- **Encryption**: Zama FHE Library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/oliviaHughes93/quantum-convo.git
cd quantum-convo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

### Smart Contract Deployment

1. Install Hardhat dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @fhevm/hardhat-plugin
```

2. Deploy the contract:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## Project Structure

```
quantum-convo/
├── contracts/          # Smart contracts
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utility functions
│   └── hooks/          # Custom React hooks
├── scripts/            # Deployment scripts
└── public/             # Static assets
```

## Smart Contract

The `QuantumConvo` contract provides:

- User registration and management
- Contact management
- Encrypted message sending and receiving
- Reputation system
- Message read status tracking

## Environment Variables

- `VITE_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID
- `VITE_CONTRACT_ADDRESS`: Deployed contract address
- `VITE_SEPOLIA_RPC_URL`: Sepolia RPC URL
- `PRIVATE_KEY`: Private key for deployment

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Smart Contract

Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub.
