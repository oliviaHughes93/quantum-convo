import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy QuantumConvo contract
  const QuantumConvo = await ethers.getContractFactory("QuantumConvo");
  
  // Set verifier address (you can change this to any address you want)
  const verifierAddress = deployer.address; // For now, using deployer as verifier
  
  const quantumConvo = await QuantumConvo.deploy(verifierAddress);
  await quantumConvo.waitForDeployment();

  const contractAddress = await quantumConvo.getAddress();
  
  console.log("QuantumConvo deployed to:", contractAddress);
  console.log("Verifier address:", verifierAddress);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    verifierAddress,
    deployerAddress: deployer.address,
    network: "sepolia",
    timestamp: new Date().toISOString(),
  };
  
  console.log("Deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Verifier Address:", verifierAddress);
  console.log("Deployer Address:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
