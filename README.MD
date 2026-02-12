# Solana NFT Minting - Complete Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core @ardrive/turbo-sdk bs58
```

### 2. Prepare Files
- Put your **artwork.jpeg** in this folder
- Put your **keypair.json** (Solana wallet) in this folder

### 3. Configure
Edit `mint-nft.js` and update the CONFIG section:
```javascript
const CONFIG = {
  KEYPAIR_PATH: './keypair.json',
  IMAGE_PATH: './artwork.jpeg',
  NFT_NAME: 'Your NFT Name',
  NFT_DESCRIPTION: 'Your description',
  NFT_ATTRIBUTES: [...], // Optional
  NETWORK: 'mainnet-beta', // or 'devnet' for testing
  ROYALTY_PERCENTAGE: 5 // 5% royalties
};
```

### 4. Run
```bash
node mint-nft.js
```

## Step-by-Step Process

### What the script does:

1. **Loads your wallet** from keypair.json
2. **Uploads image** to Arweave (permanent decentralized storage)
3. **Creates metadata** JSON with image link
4. **Uploads metadata** to Arweave
5. **Mints NFT** on Solana blockchain using Metaplex Core
6. **Saves results** to mint-results.json

### Listing on Tensor:

After minting:
1. Go to https://www.tensor.trade/
2. Connect the same wallet
3. Portfolio → NFTs
4. Find your NFT → Click "List"
5. Set price and confirm

## Cost Breakdown

- **Image upload**: ~$0.01-0.10 (depending on size)
- **Metadata upload**: ~$0.001
- **Minting fee**: ~$0.02 (Solana transaction)
- **Total**: Usually < $0.15

## Important Notes

- **Test on devnet first** (set NETWORK: 'devnet')
- Arweave storage is **permanent** (can't delete)
- Keep your keypair.json **secure** (never share)
- Minimum SOL balance needed: ~0.1 SOL

## Troubleshooting

**"Insufficient funds"**: Add more SOL to your wallet
**"Upload failed"**: Check internet connection
**"Invalid keypair"**: Verify keypair.json format is correct array of 64 numbers

## Advanced: Bulk Minting

For multiple NFTs, create a folder structure:
```
metadata/
├─ 0.json
├─ 1.json
├─ 2.json
images/
├─ 0.jpeg
├─ 1.jpeg
├─ 2.jpeg
```

Then use Turbo's `uploadFolder()` method for efficient batch uploads.