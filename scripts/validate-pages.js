#!/usr/bin/env node
/**
 * Intel Pages Validation Script
 *
 * Checks all pages in pages-manifest.json return HTTP 200.
 * Run after deployments to catch broken pages.
 *
 * Usage:
 *   node scripts/validate-pages.js           # Check all pages
 *   node scripts/validate-pages.js --critical # Check only critical pages
 *   node scripts/validate-pages.js --category tools # Check specific category
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'pages-manifest.json');
const BASE_URL = 'https://intel.42agency.com';
const CONCURRENT_REQUESTS = 10;
const TIMEOUT_MS = 10000;

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

async function checkPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeout);
    return { url, status: response.status, ok: response.ok };
  } catch (error) {
    clearTimeout(timeout);
    return { url, status: 0, ok: false, error: error.message };
  }
}

async function checkBatch(urls) {
  return Promise.all(urls.map(url => checkPage(url)));
}

async function validatePages(options = {}) {
  // Load manifest
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

  // Collect pages to check
  let pagesToCheck = [];
  const categories = manifest.categories;

  for (const [categoryName, category] of Object.entries(categories)) {
    // Skip non-critical if --critical flag
    if (options.criticalOnly && category.critical === false) {
      continue;
    }

    // Filter by category if specified
    if (options.category && categoryName !== options.category) {
      continue;
    }

    for (const pagePath of category.pages) {
      pagesToCheck.push({
        url: `${BASE_URL}${pagePath}`,
        category: categoryName,
        path: pagePath
      });
    }
  }

  console.log(`\n${colors.bold}Intel Pages Validation${colors.reset}`);
  console.log(`Checking ${pagesToCheck.length} pages...\n`);

  const results = {
    passed: [],
    failed: [],
    redirected: []
  };

  // Process in batches
  for (let i = 0; i < pagesToCheck.length; i += CONCURRENT_REQUESTS) {
    const batch = pagesToCheck.slice(i, i + CONCURRENT_REQUESTS);
    const batchResults = await checkBatch(batch.map(p => p.url));

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const pageInfo = batch[j];

      if (result.ok && result.status === 200) {
        results.passed.push({ ...pageInfo, status: result.status });
        process.stdout.write(`${colors.green}.${colors.reset}`);
      } else if (result.status >= 300 && result.status < 400) {
        results.redirected.push({ ...pageInfo, status: result.status });
        process.stdout.write(`${colors.yellow}R${colors.reset}`);
      } else {
        results.failed.push({ ...pageInfo, status: result.status, error: result.error });
        process.stdout.write(`${colors.red}X${colors.reset}`);
      }
    }
  }

  console.log('\n');

  // Summary
  console.log(`${colors.bold}Results:${colors.reset}`);
  console.log(`  ${colors.green}Passed:${colors.reset} ${results.passed.length}`);
  console.log(`  ${colors.yellow}Redirected:${colors.reset} ${results.redirected.length}`);
  console.log(`  ${colors.red}Failed:${colors.reset} ${results.failed.length}`);

  // Show failures
  if (results.failed.length > 0) {
    console.log(`\n${colors.red}${colors.bold}Failed Pages:${colors.reset}`);
    for (const page of results.failed) {
      console.log(`  ${colors.red}✗${colors.reset} ${page.path} (${page.category})`);
      console.log(`    Status: ${page.status || 'N/A'}`);
      if (page.error) console.log(`    Error: ${page.error}`);
    }
  }

  // Show redirects
  if (results.redirected.length > 0 && options.showRedirects) {
    console.log(`\n${colors.yellow}Redirected Pages:${colors.reset}`);
    for (const page of results.redirected) {
      console.log(`  ${colors.yellow}→${colors.reset} ${page.path} (${page.status})`);
    }
  }

  console.log('');

  // Exit code
  if (results.failed.length > 0) {
    console.log(`${colors.red}${colors.bold}Validation failed!${colors.reset} ${results.failed.length} page(s) are broken.\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}All pages validated successfully!${colors.reset}\n`);
    process.exit(0);
  }
}

// Parse CLI args
const args = process.argv.slice(2);
const options = {
  criticalOnly: args.includes('--critical'),
  showRedirects: args.includes('--show-redirects'),
  category: null
};

const categoryIndex = args.indexOf('--category');
if (categoryIndex !== -1 && args[categoryIndex + 1]) {
  options.category = args[categoryIndex + 1];
}

// Run validation
validatePages(options);
