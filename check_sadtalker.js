
const Replicate = require('replicate');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const tokenMatch = envContent.match(/REPLICATE_API_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : null;

if (!token) {
    console.error("Could not find REPLICATE_API_TOKEN in .env.local");
    process.exit(1);
}

const replicate = new Replicate({
    auth: token,
});

async function checkModel(owner, name) {
    try {
        console.log(`Checking ${owner}/${name}...`);
        const model = await replicate.models.get(owner, name);
        // console.log(JSON.stringify(model)); 
        console.log(`Latest version for ${owner}/${name}: ${model.latest_version.id}`);

        // Also list versions to see if we can rollback
        // const versions = await replicate.models.versions.list(owner, name);
        // console.log(`Versions for ${owner}/${name}:`, versions.results.map(v => v.id).slice(0, 3));

        return model.latest_version.id;
    } catch (e) {
        console.error(`Error checking ${owner}/${name}:`, e.message);
    }
}

async function main() {
    // Try other users/implementations found in public docs/examples
    await checkModel("yoyo-nb", "video-retalking");
    await checkModel("daanelson", "whisper-sadtalker"); // often used
    await checkModel("cjwbw", "video-retalking");

    // Check if we can find a diff version of cjwbw/sadtalker (maybe latest is broken?)
    try {
        const versions = await replicate.models.versions.list("cjwbw", "sadtalker");
        console.log("Previous versions of cjwbw/sadtalker:");
        versions.results.slice(0, 5).forEach(v => console.log(`${v.created_at}: ${v.id}`));
    } catch (e) {
        console.error("Failed to list versions for cjwbw/sadtalker");
    }
}

main();
