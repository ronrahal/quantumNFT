import bs58 from 'bs58';
import fs from 'fs';

const base58String = 'YOUR_PRIVATE_KEY_IN_BASE58'; // Replace with your actual base58-encoded private key
const wallet = bs58.decode(base58String);
fs.writeFileSync('keypair.json', JSON.stringify(Array.from(wallet)));
console.log("✅ keypair.json created successfully!");