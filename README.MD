🚀 Quantum NFT: High-Performance 
Solana Batch MinterQuantum NFT is a professional-grade open-source engine for mass-minting NFTs on the Solana 2026 stack. It utilizes Metaplex MPL-Core—the fastest and cheapest NFT standard on the network—and Arweave via Turbo SDK for permanent, decentralized asset storage.⚡ Key FeaturesMPL-Core Integration: Uses the most efficient Solana NFT standard, reducing on-chain rent costs by ~90% compared to legacy standards.Permanent Storage: Integrated with Arweave (Turbo SDK) to ensure metadata and images are immutable and live forever.Beast Mode Batching: Parallelized processing using ES Modules to maximize throughput.Simulation Guard: Built-in "Simulation Mode" to verify metadata and logic off-chain before committing SOL.Trader Optimized: Includes priority fee configurations to ensure transactions land during high network congestion.🛠 Technical StackComponentTechnologyBlockchainSolana (Mainnet-Beta / Devnet)NFT StandardMetaplex MPL-CoreStorageArweave (via ArDrive Turbo)RuntimeNode.js (ES Modules)
📦 1. InstallationClone the repository and install the dependencies:Bashgit clone https://github.com/ronrahal/quantumnft.git
cd quantumnft
npm install
🔑 2. Security & Wallet SetupThe engine requires a keypair.json to sign transactions. For security, this file is ignored by Git.Converting Private Keys:If you are using a Base58 string (exported from Phantom/Solflare), use the included converter:Open PKConverter.js.Insert your Base58 string into the base58String variable.Run: node PKConverter.jsThis will generate your secure keypair.json byte array.📂 3. ConfigurationEdit the CONFIG object in batch-mint.js:JavaScriptconst CONFIG = {
  KEYPAIR_PATH: './keypair.json',
  METADATA_FOLDER: './nfts',
  IS_SIMULATION: true, // 🧪 Set to false for LIVE minting
  BATCH_SIZE: 5,       // ⚡ Concurrent uploads
  PRIORITY_FEE: 50000, // ⛽ Micro-lamports
  NETWORK: 'mainnet-beta'
};
🚀 4. Deployment WorkflowStep 1: Prepare AssetsPlace your images in /images and your metadata JSON files in /nfts. Ensure each JSON file contains an imagePath pointing to the correct image.Step 2: Run SimulationVerify your paths and metadata without spending SOL:Bashnode batch-mint.js
Step 3: Go LiveChange IS_SIMULATION to false and execute:Bashnode batch-mint.js
📈 Economics (Cost per 1k Mints)MetricLegacy StandardMPL-Core (Quantum)On-Chain Rent~22.0 SOL~2.9 SOLStorageVariablePermanent (Arweave)EfficiencySequentialParallelized🛡 License & DisclaimerThis project is open-source under the MIT License.Disclaimer: Use at your own risk. High-frequency minting involves financial costs. Always test on Devnet or in Simulation Mode first.
