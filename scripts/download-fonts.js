const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

async function downloadFont(url, filename) {
  console.log(`Downloading ${filename}...`);
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(path.join(fontsDir, filename), Buffer.from(buffer));
  console.log(`Saved ${filename}`);
}

async function main() {
  await downloadFont(
    'https://github.com/google/fonts/raw/main/ofl/sarabun/Sarabun-Regular.ttf',
    'Sarabun-Regular.ttf'
  );
  await downloadFont(
    'https://github.com/google/fonts/raw/main/ofl/sarabun/Sarabun-Bold.ttf',
    'Sarabun-Bold.ttf'
  );
}

main().catch(console.error);
