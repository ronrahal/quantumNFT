import bs58 from 'bs58';
import fs from 'fs';

const base58String = '3yknwJKrDqrJVtyfSCvPFM1fPpNry5hpvBwuwgFByW3M5kwBDbkoepjBpbQ3KLCavLydStTBwkii3pSYL2shEoiS';
const wallet = bs58.decode(base58String);
fs.writeFileSync('keypair.json', JSON.stringify(Array.from(wallet)));
console.log("✅ keypair.json created successfully!");