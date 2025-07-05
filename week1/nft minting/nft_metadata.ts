const wallet = require("./mym.json");
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
    // Step 1: Define image URI (you already uploaded this earlier)
    const imageUri = "https://gateway.irys.xyz/89HLsThRgroavDRkDviajXwky7UcNemF4LHEoNXvX3G8";

    // Step 2: Create metadata object
    const metadata = {
        name: "Tanziro Ji",
        symbol: "TZ",
        description: "Everything will be alright 🌸",
        image: imageUri,
        attributes: [
            { trait_type: "Mood", value: "Hopeful" },
            { trait_type: "Power", value: "Sun Breathing 🔥" }
        ],
        properties: {
            files: [
                {
                    type: "image/png",
                    uri: imageUri
                }
            ]
        },
        creators: []
    };

    // Step 3: Upload metadata JSON to IRYS
    const metadataFile = createGenericFile(
        Buffer.from(JSON.stringify(metadata)),
        "metadata.json",
        { contentType: "application/json" }
    );

    const [metadataUri] = await umi.uploader.upload([metadataFile]);

    // Step 4: Log the metadata URI
    console.log("✅ Metadata uploaded!");
    console.log("🧾 Your metadata URI:", metadataUri);

} catch (error) {
    console.log("Oops.. Something went wrong", error);
}

})();
