// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract QuantumConvo is SepoliaConfig {
    using FHE for *;
    
    struct Message {
        euint32 messageId;
        euint32 senderId;
        euint32 recipientId;
        euint8[] encryptedContent; // Encrypted message content
        ebool isRead;
        uint256 timestamp;
        address sender;
        address recipient;
    }
    
    struct Contact {
        euint32 contactId;
        address userAddress;
        string name;
        ebool isOnline;
        uint256 lastSeen;
        euint32 unreadCount;
    }
    
    struct User {
        euint32 userId;
        address userAddress;
        string name;
        ebool isActive;
        euint32 reputation;
        uint256 joinDate;
    }
    
    mapping(uint256 => Message) public messages;
    mapping(uint256 => Contact) public contacts;
    mapping(uint256 => User) public users;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32[]) public userContacts;
    mapping(address => euint32[]) public userMessages;
    
    uint256 public messageCounter;
    uint256 public contactCounter;
    uint256 public userCounter;
    
    address public owner;
    address public verifier;
    
    event MessageSent(uint256 indexed messageId, address indexed sender, address indexed recipient);
    event ContactAdded(uint256 indexed contactId, address indexed user, address indexed contact);
    event UserRegistered(uint256 indexed userId, address indexed userAddress, string name);
    event MessageRead(uint256 indexed messageId, address indexed reader);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function registerUser(string memory _name) public returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        uint256 userId = userCounter++;
        
        users[userId] = User({
            userId: FHE.asEuint32(0), // Will be set properly later
            userAddress: msg.sender,
            name: _name,
            isActive: FHE.asEbool(true),
            reputation: FHE.asEuint32(100), // Default reputation
            joinDate: block.timestamp
        });
        
        emit UserRegistered(userId, msg.sender, _name);
        return userId;
    }
    
    function addContact(address _contactAddress, string memory _name) public returns (uint256) {
        require(_contactAddress != address(0), "Invalid contact address");
        require(_contactAddress != msg.sender, "Cannot add yourself");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        uint256 contactId = contactCounter++;
        
        contacts[contactId] = Contact({
            contactId: FHE.asEuint32(0), // Will be set properly later
            userAddress: _contactAddress,
            name: _name,
            isOnline: FHE.asEbool(false), // Default offline
            lastSeen: block.timestamp,
            unreadCount: FHE.asEuint32(0)
        });
        
        // Add to user's contact list
        userContacts[msg.sender].push(FHE.asEuint32(contactId));
        
        emit ContactAdded(contactId, msg.sender, _contactAddress);
        return contactId;
    }
    
    function sendMessage(
        address _recipient,
        externalEuint32[] calldata encryptedContent,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(_recipient != address(0), "Invalid recipient");
        require(_recipient != msg.sender, "Cannot send message to yourself");
        require(encryptedContent.length > 0, "Message content cannot be empty");
        
        uint256 messageId = messageCounter++;
        
        // Convert external encrypted content to internal euint8 array
        euint8[] memory internalContent = new euint8[](encryptedContent.length);
        for (uint256 i = 0; i < encryptedContent.length; i++) {
            internalContent[i] = FHE.fromExternal(encryptedContent[i], inputProof);
        }
        
        messages[messageId] = Message({
            messageId: FHE.asEuint32(0), // Will be set properly later
            senderId: FHE.asEuint32(0), // Will be set properly later
            recipientId: FHE.asEuint32(0), // Will be set properly later
            encryptedContent: internalContent,
            isRead: FHE.asEbool(false),
            timestamp: block.timestamp,
            sender: msg.sender,
            recipient: _recipient
        });
        
        // Add to user's message list
        userMessages[msg.sender].push(FHE.asEuint32(messageId));
        userMessages[_recipient].push(FHE.asEuint32(messageId));
        
        // Update unread count for recipient
        // This would need to be implemented with proper FHE operations
        
        emit MessageSent(messageId, msg.sender, _recipient);
        return messageId;
    }
    
    function markMessageAsRead(uint256 _messageId) public {
        require(messages[_messageId].recipient == msg.sender, "Only recipient can mark as read");
        
        messages[_messageId].isRead = FHE.asEbool(true);
        
        emit MessageRead(_messageId, msg.sender);
    }
    
    function updateUserStatus(ebool _isOnline) public {
        // This would update the user's online status
        // Implementation depends on how user data is stored
    }
    
    function updateReputation(address _user, euint32 _reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(_user != address(0), "Invalid user address");
        
        userReputation[_user] = _reputation;
        
        emit ReputationUpdated(_user, 0); // FHE.decrypt(_reputation) - will be decrypted off-chain
    }
    
    function getMessageInfo(uint256 _messageId) public view returns (
        address sender,
        address recipient,
        uint256 timestamp,
        bool isRead
    ) {
        Message storage message = messages[_messageId];
        return (
            message.sender,
            message.recipient,
            message.timestamp,
            false // FHE.decrypt(message.isRead) - will be decrypted off-chain
        );
    }
    
    function getContactInfo(uint256 _contactId) public view returns (
        address userAddress,
        string memory name,
        uint256 lastSeen,
        bool isOnline,
        uint32 unreadCount
    ) {
        Contact storage contact = contacts[_contactId];
        return (
            contact.userAddress,
            contact.name,
            contact.lastSeen,
            false, // FHE.decrypt(contact.isOnline) - will be decrypted off-chain
            0 // FHE.decrypt(contact.unreadCount) - will be decrypted off-chain
        );
    }
    
    function getUserInfo(uint256 _userId) public view returns (
        address userAddress,
        string memory name,
        bool isActive,
        uint32 reputation,
        uint256 joinDate
    ) {
        User storage user = users[_userId];
        return (
            user.userAddress,
            user.name,
            false, // FHE.decrypt(user.isActive) - will be decrypted off-chain
            0, // FHE.decrypt(user.reputation) - will be decrypted off-chain
            user.joinDate
        );
    }
    
    function getUserReputation(address _user) public view returns (uint32) {
        return 0; // FHE.decrypt(userReputation[_user]) - will be decrypted off-chain
    }
    
    function getMessageCount(address _user) public view returns (uint256) {
        return userMessages[_user].length;
    }
    
    function getContactCount(address _user) public view returns (uint256) {
        return userContacts[_user].length;
    }
    
    // Admin functions
    function setVerifier(address _newVerifier) public {
        require(msg.sender == owner, "Only owner can set verifier");
        require(_newVerifier != address(0), "Invalid verifier address");
        verifier = _newVerifier;
    }
    
    function emergencyPause() public {
        require(msg.sender == owner, "Only owner can pause");
        // Implementation for emergency pause
    }
    
    function emergencyUnpause() public {
        require(msg.sender == owner, "Only owner can unpause");
        // Implementation for emergency unpause
    }
}
