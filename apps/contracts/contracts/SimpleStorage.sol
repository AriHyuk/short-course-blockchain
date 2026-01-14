// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    // --- STATE VARIABLES (Data disimpan di Blockchain) ---
    uint256 private storedValue;
    address public owner;           // Task 3.1: Ownership
    string public myMessage;        // Task 4: Tambahan state (Message)

    // --- EVENTS (Log untuk Frontend) ---
    event ValueUpdated(uint256 newValue);       // Task 3.2
    event OwnerSet(address indexed newOwner);   // Task 3.2
    event MessageUpdated(string newMessage);    // Log buat fitur message baru

    // --- MODIFIER (Keamanan) ---
    // Task 4: Access Control (Cuma bos yang boleh ganti data)
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner: Minggir lu!");
        _;
    }

    // --- CONSTRUCTOR ---
    constructor() {
        owner = msg.sender; // Set kamu sebagai bos saat deploy
        emit OwnerSet(owner);
    }

    // --- FUNCTIONS ---

    // 1. Ganti Angka (Pakai onlyOwner)
    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    // 2. Baca Angka
    function getValue() public view returns (uint256) {
        return storedValue;
    }

    // 3. Ganti Pesan (FITUR BARU TASK 4)
    function setMessage(string memory _message) public onlyOwner {
        myMessage = _message;
        emit MessageUpdated(_message);
    }
}