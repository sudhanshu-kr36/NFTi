# NFTi
Dynamic NFT ticketing system

## Overview
Dynamic NFT Ticketing System is a full-stack web application that revolutionizes event ticketing by leveraging blockchain technology, dynamic NFTs (Non-Fungible Tokens), and loyalty rewards. With this platform, organizers can create secure event tickets as NFTs, users can purchase and verify tickets easily, and attendees earn ERC-20 loyalty tokens for their participation.

Features
Event Creation
Organizers can create events with custom ticket tiers (Gold, Silver, Default), set date/time, location, price, and seat limits.

NFT Ticketing
Each ticket is minted on blockchain as a unique NFT. It includes metadata, QR code for verification, and owner info.

Marketplace
Users can browse available events and purchase NFT tickets directly via integrated Web3 wallet.

Attendee Verification
QR code scanning enables fast, secure check-in. Used (burned) tickets trigger reward minting.

Loyalty Reward System
Attendees receive ERC-20 loyalty tokens once their ticket has been checked in (burned). These tokens can be tracked in their wallet and used for future event rewards.

Sales Analytics & Management
Organizers can track ticket sales, revenue, and participant verification in real time.

## Technology Stack
Layer	Technology

Frontend	React, TypeScript, Chakra UI, Framer Motion
Blockchain	Klaytn (or Ethereum), Hardhat, OpenZeppelin
Storage/Backend	Firebase, IPFS, Express.js, Pinata
Loyalty Token	ERC-20 Smart Contract
Wallet Integration	MetaMask, ethers.js
QR Code Management	react-qr-reader, html2canvas

## How It Works

Create Event:
Organizer enters event details, selects ticket types, sets price/limits, and deploys event smart contract.

Mint Tickets:
Tickets are generated as dynamic NFTs stored on the blockchain and metadata on IPFS.

Purchase:
Users connect their wallet, buy tickets, and receive NFTs representing entry rights.

Verification:
At the event, QR codes are scanned at entry. Verified tickets are burned.

## Getting Started
Prerequisites

Node.js, npm

Coinbase (for testing and Wallet Integration)

Firebase account and IPFS/Pinata API keys

# Installation

cd NFTi    (after clonning the github repository)

### for both backend and app folders
npm install                   

### Compile contracts
npx hardhat compile           

### Start frontend and backend servers
npm start

Environment Variables
Set blockchain RPC URLs, wallet private keys, and Pinata API keys in .env.

Smart Contracts
EventTicketNft.sol: ERC-721 for ticket NFTs, includes burn/verify logic and loyalty interop.

API Endpoints
/upload (Backend): Uploads ticket images to IPFS via Pinata.

Blockchain calls: Mint, burn, reward loyalty handled via frontend (ethers.js).

## Usage

Organizer:

Create an event.

Configure ticket types and deploy contract.

Track sales and participant verification.

Attendee:

Browse events/purchase ticket.

Scan QR code at entry.

# Screenshots

<img width="1912" height="845" alt="Screenshot 2025-08-31 065606" src="https://github.com/user-attachments/assets/88b30a78-fa63-4f37-8976-58b2e2a9adbf" />


# License
MIT (or any)

Authors
[Two_Pointers Team]


Ready to bring transparency, security, and rewards to event ticketing!

