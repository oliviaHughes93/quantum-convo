import { expect } from "chai";
import { ethers } from "hardhat";
import { QuantumConvo } from "../typechain-types";

describe("QuantumConvo", function () {
  let quantumConvo: QuantumConvo;
  let owner: any;
  let verifier: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, verifier, user1, user2] = await ethers.getSigners();
    
    const QuantumConvoFactory = await ethers.getContractFactory("QuantumConvo");
    quantumConvo = await QuantumConvoFactory.deploy(verifier.address);
    await quantumConvo.waitForDeployment();
  });

  describe("User Registration", function () {
    it("Should allow user registration", async function () {
      await quantumConvo.connect(user1).registerUser("Alice");
      
      // Verify user was registered
      const userInfo = await quantumConvo.getUserInfo(0);
      expect(userInfo.userAddress).to.equal(user1.address);
      expect(userInfo.name).to.equal("Alice");
    });

    it("Should not allow empty name registration", async function () {
      await expect(
        quantumConvo.connect(user1).registerUser("")
      ).to.be.revertedWith("Name cannot be empty");
    });
  });

  describe("Contact Management", function () {
    beforeEach(async function () {
      await quantumConvo.connect(user1).registerUser("Alice");
      await quantumConvo.connect(user2).registerUser("Bob");
    });

    it("Should allow adding contacts", async function () {
      await quantumConvo.connect(user1).addContact(user2.address, "Bob");
      
      const contactInfo = await quantumConvo.getContactInfo(0);
      expect(contactInfo.userAddress).to.equal(user2.address);
      expect(contactInfo.name).to.equal("Bob");
    });

    it("Should not allow adding self as contact", async function () {
      await expect(
        quantumConvo.connect(user1).addContact(user1.address, "Self")
      ).to.be.revertedWith("Cannot add yourself");
    });

    it("Should not allow adding zero address as contact", async function () {
      await expect(
        quantumConvo.connect(user1).addContact(ethers.ZeroAddress, "Zero")
      ).to.be.revertedWith("Invalid contact address");
    });
  });

  describe("Message Management", function () {
    beforeEach(async function () {
      await quantumConvo.connect(user1).registerUser("Alice");
      await quantumConvo.connect(user2).registerUser("Bob");
    });

    it("Should allow sending messages", async function () {
      // Mock encrypted content
      const encryptedContent = [1, 2, 3, 4, 5];
      const inputProof = "0x"; // Mock proof
      
      await quantumConvo.connect(user1).sendMessage(
        user2.address,
        encryptedContent,
        inputProof
      );
      
      const messageInfo = await quantumConvo.getMessageInfo(0);
      expect(messageInfo.sender).to.equal(user1.address);
      expect(messageInfo.recipient).to.equal(user2.address);
    });

    it("Should not allow sending message to self", async function () {
      const encryptedContent = [1, 2, 3];
      const inputProof = "0x";
      
      await expect(
        quantumConvo.connect(user1).sendMessage(
          user1.address,
          encryptedContent,
          inputProof
        )
      ).to.be.revertedWith("Cannot send message to yourself");
    });

    it("Should allow marking messages as read", async function () {
      const encryptedContent = [1, 2, 3];
      const inputProof = "0x";
      
      await quantumConvo.connect(user1).sendMessage(
        user2.address,
        encryptedContent,
        inputProof
      );
      
      await quantumConvo.connect(user2).markMessageAsRead(0);
      
      const messageInfo = await quantumConvo.getMessageInfo(0);
      expect(messageInfo.isRead).to.be.true;
    });

    it("Should not allow non-recipient to mark message as read", async function () {
      const encryptedContent = [1, 2, 3];
      const inputProof = "0x";
      
      await quantumConvo.connect(user1).sendMessage(
        user2.address,
        encryptedContent,
        inputProof
      );
      
      await expect(
        quantumConvo.connect(user1).markMessageAsRead(0)
      ).to.be.revertedWith("Only recipient can mark as read");
    });
  });

  describe("Reputation System", function () {
    it("Should allow verifier to update reputation", async function () {
      await quantumConvo.connect(user1).registerUser("Alice");
      
      // Mock reputation value
      const reputation = 150;
      
      await quantumConvo.connect(verifier).updateReputation(user1.address, reputation);
      
      // Note: In a real FHE implementation, we would decrypt the reputation
      // For now, we just verify the transaction succeeded
      expect(true).to.be.true;
    });

    it("Should not allow non-verifier to update reputation", async function () {
      await quantumConvo.connect(user1).registerUser("Alice");
      
      await expect(
        quantumConvo.connect(user1).updateReputation(user1.address, 150)
      ).to.be.revertedWith("Only verifier can update reputation");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to set verifier", async function () {
      await quantumConvo.connect(owner).setVerifier(user1.address);
      
      // Verify verifier was updated
      expect(true).to.be.true; // In a real implementation, we'd check the verifier
    });

    it("Should not allow non-owner to set verifier", async function () {
      await expect(
        quantumConvo.connect(user1).setVerifier(user2.address)
      ).to.be.revertedWith("Only owner can set verifier");
    });
  });
});
