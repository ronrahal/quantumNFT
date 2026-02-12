# 🚀 Quantum NFT: High-Performance Solana Batch Minter

**Quantum NFT** is a professional-grade open-source engine for mass-minting NFTs on the **Solana 2026 stack**. It utilizes **Metaplex MPL-Core**—the fastest and cheapest NFT standard on the network—and **Arweave via Turbo SDK** for permanent, decentralized asset storage.



---

## ⚡ Key Features
* **MPL-Core Integration:** Uses the most efficient Solana NFT standard, reducing on-chain rent costs by ~90% compared to legacy standards (~0.0029 SOL vs ~0.022 SOL).
* **Permanent Storage:** Integrated with **Arweave (Turbo SDK)** to ensure metadata and images are immutable and live forever.
* **Beast Mode Batching:** Parallelized processing using ES Modules to maximize throughput.
* **Simulation Guard:** Built-in "Simulation Mode" to verify metadata and logic off-chain before committing SOL.
* **Trader Optimized:** Includes priority fee configurations to ensure transactions land during high network congestion.

---

## 🛠 Technical Stack
| Component | Technology |
| :--- | :--- |
| **Blockchain** | Solana (Mainnet-Beta / Devnet) |
| **NFT Standard** | Metaplex MPL-Core |
| **Storage** | Arweave (via ArDrive Turbo SDK) |
| **Runtime** | Node.js (ES Modules v24+) |

---

## 📦 1. Installation

Clone the repository and install the dependencies:

```bash
git clone [https://github.com/ronrahal/quantumnft.git](https://github.com/ronrahal/quantumnft.git)
cd quantumnft
npm install

🔑 2. Security & Wallet SetupThe engine requires a keypair.json to sign transactions. For security, this file is ignored by Git via .gitignore.Converting Private Keys:If you are exporting a secret key from a browser wallet (Phantom/Solflare), use the included converter:Open PKConverter.js.Insert your Base58 string into the base58String variable.Run: node PKConverter.jsThis will generate your secure keypair.json byte array.
📂 3. ConfigurationEdit the CONFIG object in batch-mint.js:
  JavaScriptconst CONFIG = {
  KEYPAIR_PATH: './keypair.json',
  METADATA_FOLDER: './nfts',
  IS_SIMULATION: true, // 🧪 Set to false for LIVE minting
  BATCH_SIZE: 5,       // ⚡ Concurrent uploads
  PRIORITY_FEE: 50000, // ⛽ Micro-lamports (Priority Fees)
  NETWORK: 'mainnet-beta'
};

🚀 4. Deployment Workflow
  Step 1 Prepare Assets: Place your images in /images and your metadata JSON files in /nfts. Ensure each JSON file contains an imagePath pointing to the correct image.
  Step 2 Run Simulation: Verify your paths and metadata without spending SOL: node batch-mint.js
  Step 3 Go Live: Change IS_SIMULATION to false in batch-mint.js and execute: node batch-mint.js

📈 Economics (Cost Comparison)
Metric            Legacy Standard    MPL-Core (Quantum)
On-Chain Rent     ~0.022 SOL         ~0.0029 SOL
Storage           Centralized/Temp   Permanent (Arweave)
Scalability       Sequential         Parallelized
 
License & DisclaimerThis project is licensed under the MIT License.Disclaimer: High-frequency minting involves financial costs. Always test on Devnet or in Simulation Mode first. 
The authors are not responsible for lost funds or failed transactions.
---

