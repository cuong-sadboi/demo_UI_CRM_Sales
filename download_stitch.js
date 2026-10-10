const fs = require('fs');
const path = require('path');

async function main() {
  const apiKey = process.env.STITCH_API_KEY || 'YOUR_STITCH_API_KEY';
  const projectId = '13098932382894710925';

  console.log('Fetching screen list from Stitch MCP...');
  const res = await fetch('https://stitch.googleapis.com/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'list_screens',
        arguments: { projectId }
      }
    })
  });

  const data = await res.json();
  const rawText = data.result.content[0].text;
  const parsed = JSON.parse(rawText);

  const outDir = path.join(__dirname, 'stitch_screens');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(parsed.screens, null, 2), 'utf8');

  console.log(`Found ${parsed.screens.length} screens. Downloading HTML and metadata...`);

  for (const s of parsed.screens) {
    const screenId = s.name.split('/').pop();
    const sanitizedTitle = s.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
    console.log(`Downloading: [${screenId}] ${s.title}`);

    if (s.htmlCode && s.htmlCode.downloadUrl) {
      const htmlRes = await fetch(s.htmlCode.downloadUrl, {
        headers: { 'X-Goog-Api-Key': apiKey }
      });
      const html = await htmlRes.text();
      fs.writeFileSync(path.join(outDir, `${screenId}.html`), html, 'utf8');
    }

    if (s.screenshot && s.screenshot.downloadUrl) {
      try {
        const imgRes = await fetch(s.screenshot.downloadUrl);
        const buffer = await imgRes.arrayBuffer();
        fs.writeFileSync(path.join(outDir, `${screenId}.png`), Buffer.from(buffer));
      } catch (err) {
        console.error(`Failed to download screenshot for ${screenId}:`, err.message);
      }
    }
  }

  console.log('Successfully saved all screens to stitch_screens/');
}

main().catch(console.error);
