const puppeteer = require('puppeteer-core');

const BROWSERBASE_API_KEY = 'bb_live_Mxl5Mm00OqDFiki1BpeDZ4q8ZEg';
const BROWSERBASE_PROJECT_ID = '0d59ddf2-657c-4efb-915f-94b5885a06be';

async function captureScreenshot(url, outputPath, waitTime = 3000) {
  console.log(`Capturing: ${url}`);

  const response = await fetch('https://www.browserbase.com/v1/sessions', {
    method: 'POST',
    headers: {
      'x-bb-api-key': BROWSERBASE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ projectId: BROWSERBASE_PROJECT_ID })
  });

  const session = await response.json();
  console.log('Session created:', session.id);

  // Use the connectUrl directly from the response
  const browser = await puppeteer.connect({
    browserWSEndpoint: session.connectUrl
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, waitTime));
  await page.screenshot({ path: outputPath, fullPage: true });

  await browser.close();
  console.log('Screenshot saved:', outputPath);
}

const [,, url, outputPath, waitTime] = process.argv;
captureScreenshot(url, outputPath, parseInt(waitTime) || 4000).catch(console.error);
