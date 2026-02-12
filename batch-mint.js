/**
 * Modular Batch NFT Minting Script for Solana Mainnet (2026)
 * Optimizations: Parallelized Uploads, Simulation Mode, MPL-Core
 */

import { TurboFactory } from '@ardrive/turbo-sdk';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
    createSignerFromKeypair, 
    signerIdentity, 
    generateSigner 
} from '@metaplex-foundation/umi';
import mplCorePkg from '@metaplex-foundation/mpl-core';
const { create, mplCore, setComputeUnitPrice } = mplCorePkg;

import bs58 from 'bs58';
import fs from 'fs';
import path from 'path';

// ============ CONFIGURATION ============
const CONFIG = {
  KEYPAIR_PATH: './keypair.json',
  METADATA_FOLDER: './nfts',
  NETWORK: 'mainnet-beta',
  ROYALTY_PERCENTAGE: 5,
  PRIORITY_FEE: 50_000, 
  IS_SIMULATION: true, // 🧪 Set to false for live Mainnet minting
  BATCH_SIZE: 3,       // ⚡ Number of parallel processes
  RPC_URL: 'https://api.mainnet-beta.solana.com', 
};

// ============ HELPER FUNCTIONS ============

function calculateSize(filePath) {
  return fs.statSync(filePath).size;
}

async function uploadFile(turbo, filePath, contentType) {
  if (CONFIG.IS_SIMULATION) return `https://arweave.net/simulation_id_${Math.random().toString(36).substring(7)}`;

  const fileSize = calculateSize(filePath);
  const fileBuffer = fs.readFileSync(filePath);
  
  // Dynamic top-up logic for Arweave
  const uploadPrice = (await turbo.getUploadCosts({ bytes: [fileSize] }))[0].winc;
  const currentBalance = (await turbo.getBalance()).winc;
  if (uploadPrice > currentBalance) {
    const requiredWinc = uploadPrice - currentBalance;
    const wincForOneSol = (await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc;
    const topUpAmount = Math.ceil((requiredWinc / wincForOneSol) * 1_000_000_000);
    console.log(` 💰 Topping up Arweave with ${topUpAmount} lamports...`);
    await turbo.topUpWithTokens({ tokenAmount: topUpAmount });
  }

  const upload = await turbo.uploadFile({
    fileStreamFactory: () => fileBuffer,
    fileSizeFactory: () => fileSize,
    dataItemOpts: { tags: [{ name: 'Content-Type', value: contentType }] }
  });
  return `https://arweave.net/${upload.id}`;
}

async function mintSingleNFT(turbo, umi, nftConfig) {
  // 1. Upload Image
  const imageUrl = await uploadFile(turbo, nftConfig.imagePath, 'image/jpeg');

  // 2. Prepare & Upload Metadata
  const metadata = {
    name: nftConfig.name,
    description: nftConfig.description,
    image: imageUrl,
    attributes: nftConfig.attributes || [],
    properties: { files: [{ uri: imageUrl, type: 'image/jpeg' }], category: 'image' }
  };
  const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));
  
  let metadataUri;
  if (CONFIG.IS_SIMULATION) {
    metadataUri = `https://arweave.net/sim_metadata_${Math.random().toString(36).substring(7)}`;
  } else {
    const metaUpload = await turbo.uploadFile({
      fileStreamFactory: () => metadataBuffer,
      fileSizeFactory: () => metadataBuffer.length,
      dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] }
    });
    metadataUri = `https://arweave.net/${metaUpload.id}`;
  }

  // 3. On-Chain Minting
  const assetSigner = generateSigner(umi);
  if (CONFIG.IS_SIMULATION) {
    console.log(` 🧪 [SIM] Would mint: ${nftConfig.name} | Asset: ${assetSigner.publicKey}`);
    return { name: nftConfig.name, asset: assetSigner.publicKey, status: 'simulated' };
  }

  await create(umi, {
    asset: assetSigner,
    name: nftConfig.name,
    uri: metadataUri,
    plugins: [{
      type: 'Royalties',
      basisPoints: (nftConfig.royaltyPercentage || CONFIG.ROYALTY_PERCENTAGE) * 100,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: { type: 'None' }
    }]
  })
  .add(setComputeUnitPrice(umi, { microLamports: CONFIG.PRIORITY_FEE }))
  .sendAndConfirm(umi);

  return { name: nftConfig.name, asset: assetSigner.publicKey, status: 'success', metadataUri };
}

// ============ MAIN BATCH PROCESS ============

async function batchMintNFTs() {
  console.log(`🚀 Mode: ${CONFIG.IS_SIMULATION ? 'SIMULATION' : 'LIVE MAINNET'}`);
  
  const secretKey = JSON.parse(fs.readFileSync(CONFIG.KEYPAIR_PATH, 'utf-8'));
  const privateKey = bs58.encode(Uint8Array.from(secretKey));
  const umi = createUmi(CONFIG.RPC_URL).use(mplCore());
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(secretKey));
  umi.use(signerIdentity(createSignerFromKeypair(umi, umiKeypair)));

  const turbo = TurboFactory.authenticated({ privateKey, token: 'solana' });
  const configFiles = fs.readdirSync(CONFIG.METADATA_FOLDER).filter(f => f.endsWith('.json')).sort();
  
  const results = [];
  console.log(`📦 Processing ${configFiles.length} NFTs in chunks of ${CONFIG.BATCH_SIZE}...\n`);

  for (let i = 0; i < configFiles.length; i += CONFIG.BATCH_SIZE) {
    const chunk = configFiles.slice(i, i + CONFIG.BATCH_SIZE);
    console.log(`▶️ Processing Batch ${Math.floor(i / CONFIG.BATCH_SIZE) + 1}...`);

    const chunkPromises = chunk.map(async (file) => {
      try {
        const nftData = JSON.parse(fs.readFileSync(path.join(CONFIG.METADATA_FOLDER, file), 'utf-8'));
        const res = await mintSingleNFT(turbo, umi, nftData);
        console.log(`  ✅ Finished: ${nftData.name}`);
        return res;
      } catch (err) {
        console.error(`  ❌ Failed: ${file} - ${err.message}`);
        return { file, status: 'failed', error: err.message };
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  fs.writeFileSync('batch-mint-results.json', JSON.stringify(results, null, 2));
  console.log(`\n📊 Done. Results saved to batch-mint-results.json`);
}

batchMintNFTs().catch(console.error);