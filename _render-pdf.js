const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const globalRoot = execSync('npm root -g').toString().trim();
const puppeteer = require(path.join(globalRoot, 'puppeteer'));
const { marked } = require(path.join(__dirname, 'node_modules', 'marked'));

const CSS = `
@page { size: A4; margin: 18mm 16mm; }
body {
  font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  color: #1a1a1a;
  line-height: 1.55;
  font-size: 10.5pt;
}
h1 {
  font-size: 1.9em;
  border-bottom: 2px solid #222;
  padding-bottom: 0.25em;
  margin-top: 1.6em;
  page-break-before: always;
}
h1:first-of-type { page-break-before: avoid; margin-top: 0.4em; }
h2 {
  font-size: 1.4em;
  margin-top: 1.6em;
  border-bottom: 1px solid #bbb;
  padding-bottom: 0.18em;
}
h3 { font-size: 1.13em; margin-top: 1.3em; }
h4 { font-size: 1em; margin-top: 1.1em; }
p, ul, ol { margin: 0.5em 0; }
li { margin: 0.18em 0; }
code {
  font-family: "JetBrains Mono", "Cascadia Mono", Consolas, "Courier New", monospace;
  font-size: 0.88em;
  background: #f1f1f1;
  padding: 0.08em 0.32em;
  border-radius: 3px;
}
pre {
  background: #f6f8fa;
  border: 1px solid #e3e6e8;
  border-radius: 4px;
  padding: 0.7em 0.9em;
  overflow-x: auto;
  page-break-inside: avoid;
  font-size: 0.86em;
}
pre code { background: transparent; padding: 0; font-size: 1em; }
table {
  border-collapse: collapse;
  margin: 0.7em 0;
  width: 100%;
  font-size: 0.92em;
  page-break-inside: avoid;
}
th, td {
  border: 1px solid #c2c2c2;
  padding: 0.4em 0.6em;
  text-align: left;
  vertical-align: top;
}
th { background: #ececec; font-weight: 600; }
blockquote {
  border-left: 3px solid #888;
  margin: 0.7em 0;
  padding: 0.25em 0.9em;
  background: #f8f8f8;
  color: #3a3a3a;
}
hr { border: none; border-top: 1px solid #bbb; margin: 1.4em 0; }
strong { color: #000; }
`;

async function generate(mdPath, pdfPath) {
  const md = fs.readFileSync(mdPath, 'utf8');
  marked.setOptions({ gfm: true, breaks: false });
  const htmlBody = marked.parse(md);

  const html = `<!doctype html>
<html><head><meta charset="utf-8">
<title>${path.basename(mdPath, '.md')}</title>
<style>${CSS}</style>
</head><body>${htmlBody}</body></html>`;

  const tmpHtml = mdPath.replace(/\.md$/, '.tmp.html');
  fs.writeFileSync(tmpHtml, html);

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    const fileUrl = 'file:///' + path.resolve(tmpHtml).replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'load' });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' }
    });
  } finally {
    await browser.close();
    try { fs.unlinkSync(tmpHtml); } catch {}
  }
  console.log('wrote', path.basename(pdfPath));
}

(async () => {
  await generate(
    path.join(__dirname, 'foundations-guide.md'),
    path.join(__dirname, 'foundations-guide.pdf')
  );
  await generate(
    path.join(__dirname, 'foundations-guide-ru.md'),
    path.join(__dirname, 'foundations-guide-ru.pdf')
  );
})().catch(err => {
  console.error(err);
  process.exit(1);
});
