# Quantum Convo Deployment Guide

## Prerequisites

1. Node.js (v18 or higher)
2. npm or yarn
3. Git
4. Vercel account
5. WalletConnect Project ID
6. Sepolia testnet ETH for contract deployment

## Environment Setup

1. Copy the environment example file:
```bash
cp env.example .env
```

2. Update the `.env` file with your configuration:
```env
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_SEPOLIA_RPC_URL=https://rpc.sepolia.org
VITE_MAINNET_RPC_URL=https://eth.llamarpc.com
PRIVATE_KEY=your_private_key_for_deployment
VERIFIER_ADDRESS=your_verifier_address
```

## Smart Contract Deployment

1. Install Hardhat dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @fhevm/hardhat-plugin
```

2. Deploy the contract to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

3. Copy the deployed contract address to your `.env` file.

## Frontend Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit: Quantum Convo FHE messaging app"
git push origin main
```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

3. Set environment variables in Vercel:
   - `VITE_WALLET_CONNECT_PROJECT_ID`
   - `VITE_CONTRACT_ADDRESS`
   - `VITE_SEPOLIA_RPC_URL`
   - `VITE_MAINNET_RPC_URL`

4. Deploy:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Method 2: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables:
```bash
vercel env add VITE_WALLET_CONNECT_PROJECT_ID
vercel env add VITE_CONTRACT_ADDRESS
vercel env add VITE_SEPOLIA_RPC_URL
vercel env add VITE_MAINNET_RPC_URL
```

5. Redeploy with environment variables:
```bash
vercel --prod
```

## Post-Deployment

1. Test the application:
   - Connect your wallet
   - Register a user
   - Add contacts
   - Send encrypted messages

2. Verify contract interactions:
   - Check transaction history on Sepolia Etherscan
   - Verify contract functions are working correctly

## Troubleshooting

### Common Issues

1. **WalletConnect Project ID Error**:
   - Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Ensure the project ID is correctly set in environment variables

2. **Contract Not Found**:
   - Verify the contract address is correct
   - Ensure the contract is deployed on the correct network
   - Check that the contract ABI matches the deployed contract

3. **Build Errors**:
   - Check that all dependencies are installed
   - Verify TypeScript configuration
   - Ensure all environment variables are set

4. **FHE Operations Not Working**:
   - Verify FHEVM is properly configured
   - Check that the contract is deployed with FHE support
   - Ensure proper encryption/decryption functions are implemented

### Support

For issues and questions:
- Check the GitHub repository issues
- Review the FHEVM documentation
- Contact the development team

## Security Notes

1. Never commit private keys to version control
2. Use environment variables for sensitive data
3. Test thoroughly on testnets before mainnet deployment
4. Verify all FHE operations are working correctly
5. Implement proper access controls in smart contracts
