const puppeteer = require('puppeteer');
const fs = require('fs');

async function generatePDF() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Read the markdown and convert to clean HTML (no images)
  const mdPath = '/Users/42agency/Desktop/CI_Enable/Enable_Competitive_Intelligence_Report.md';
  let mdContent = fs.readFileSync(mdPath, 'utf8');

  // Remove image references
  mdContent = mdContent.replace(/!\[.*?\]\(.*?\)/g, '');

  // Simple markdown to HTML conversion
  let html = mdContent
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    // Tables
    .replace(/^\|(.*)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    })
    // List items
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Clean up
    .replace(/<\/h(\d)><p>/g, '</h$1>')
    .replace(/<p><h(\d)>/g, '<h$1>')
    .replace(/<p><hr>/g, '<hr>')
    .replace(/<hr><\/p>/g, '<hr>')
    .replace(/<p><li>/g, '<ul><li>')
    .replace(/<\/li><\/p>/g, '</li></ul>')
    .replace(/<\/li><li>/g, '</li><li>')
    .replace(/<p><tr>/g, '<table><tr>')
    .replace(/<\/tr><\/p>/g, '</tr></table>')
    .replace(/<\/tr><tr>/g, '</tr><tr>');

  const styledHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { margin: 20mm 15mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.6;
          color: #1a1a1a;
          max-width: 100%;
        }
        h1 { font-size: 22pt; font-weight: 800; margin: 0 0 8px 0; color: #1a1a1a; }
        h2 { font-size: 14pt; font-weight: 700; margin: 20px 0 10px 0; color: #1a1a1a; border-bottom: 2px solid #DFFE68; padding-bottom: 4px; }
        h3 { font-size: 11pt; font-weight: 700; margin: 14px 0 6px 0; color: #1a1a1a; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 9pt; }
        th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
        th { background: #1a1a1a; color: white; font-weight: 600; }
        tr:nth-child(even) { background: #f9f9f9; }
        tr:first-child td { background: #1a1a1a; color: white; font-weight: 600; }
        ul { margin: 6px 0; padding-left: 18px; }
        li { margin: 3px 0; }
        strong { font-weight: 700; }
        hr { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
        p { margin: 6px 0; }
      </style>
    </head>
    <body>
      <p>${html}</p>
    </body>
    </html>
  `;

  await page.setContent(styledHtml, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: '/Users/42agency/Desktop/CI_Enable/Enable_Competitive_Intelligence_Report.pdf',
    format: 'A4',
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    printBackground: true
  });

  await browser.close();
  console.log('PDF generated successfully');
}

generatePDF().catch(console.error);
