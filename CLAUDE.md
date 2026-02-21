# Intel Pages - Lead Magnet Site

**URL:** https://intel.42agency.com
**Hosting:** Vercel (project: `intel-pages`)
**Deploy:** `cd ~/Documents/Schema\ Agency/web/intel-pages && vercel --prod`

## Overview

Lead magnet landing pages for 42 Agency. Gated downloads (email capture → HubSpot) for templates, audits, and toolkits.

## Tech Stack

- Static HTML/CSS (no framework)
- HubSpot Collected Forms API for email capture
- GTM Container: `GTM-MM5BTNS`
- HubSpot Portal: `44888286`

## Design System

```css
--accent: #DFFE68;        /* Yellow-green highlight */
--black: #1a1a1a;
--google: #4285F4;        /* Google Ads pages */
--linkedin: #0A66C2;      /* LinkedIn pages */
--meta: #0668E1;          /* Meta/Facebook pages */
```

- 2px solid black borders
- 4px box shadows
- Inter font

## Logo

**File:** `/42-logo.png` (horizontal, 674x171)
**Source:** `~/Documents/Schema Agency/assets/42_logo_horizontal.png`

**CSS (all pages):**
```css
.logo { flex-shrink: 0; }
.logo img { height: 32px; width: auto; }
```

## HubSpot Form Integration

All download forms submit to HubSpot Collected Forms API:

```javascript
async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;

    await fetch('https://api.hsforms.com/submissions/v3/integration/submit/44888286/collected-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fields: [{ name: 'email', value: email }],
            context: { pageUri: window.location.href, pageName: 'Page Name Here' }
        })
    });

    // Trigger download after submission
    window.location.href = '/path/to/file.xlsx';
}
```

## Pages

### Main Index (`/`)
- Resource hub listing all lead magnets
- Footer grid: 5 columns (42 Agency, Essays, AI Tools, Paid Media Audits, Resources)

### Paid Media Audits

| Page | Template | Sheets | Brand Color |
|------|----------|--------|-------------|
| `/google-ads-audit/` | `42_Google_Ads_Audit_Template.xlsx` | 9 | `#4285F4` |
| `/linkedin-audit/` | `42_LinkedIn_Ads_Audit_Template.xlsx` | 9 | `#0A66C2` |
| `/meta-audit/` | `42_Meta_Ads_Audit_Template.xlsx` | 9 | `#0668E1` |

**Audit Template Structure (9 sheets each):**
1. **Audit Overview** - Executive summary, health scores, priority issues
2. **Conversion Tracking** - Platform-specific tracking checks
3. **Account/Campaign Structure** - Organization, naming, overlap
4. **Audience/Keyword Strategy** - Targeting analysis
5. **Creative Performance** - Format mix, CTR benchmarks, fatigue
6. **Budget & Bidding** - Pacing, bid strategies, efficiency
7. **Lead Gen Forms / Ad Copy** - Platform-specific
8. **Benchmarks Reference** - Industry CPLs, Poor→Excellent scoring
9. **Recommendations** - P0/P1/P2/P3 prioritized actions

**Each check includes:**
- Status: ✅ Pass / ⚠️ Check / ❌ Fail
- Current State (realistic placeholder)
- Benchmark / Best Practice (specific numbers)
- Risk Level (🔴 High / 🟡 Medium / 🟢 Low)
- **42 Agency POV** (expert commentary)

### MOPS & HubSpot

| Page | Template |
|------|----------|
| `/hubspot-audit/` | `42_HubSpot_Audit_Template.xlsx` |
| `/mops-funnel/` | `42_MOPS_Funnel_Workbook.xlsx` |
| `/hubspot-salesforce/` | Google Doc checklist |

### ABM & GTM

| Page | Content |
|------|---------|
| `/zenabm/` | ABM toolkit (3 templates) |
| `/zenabm/audit.html` | GTM Maturity Assessment (interactive) |
| `/abm-campaign/` | ABM Campaign Planner |

### LinkedIn Targeting

| Page | Content |
|------|---------|
| `/linkedin-targeting/` | Targeting checklist hub |
| `/linkedin-targeting/audience-sizing/` | Audience size guide |
| `/linkedin-targeting/job-title-targeting/` | Job title strategy |
| `/linkedin-targeting/account-lists/` | Company list uploads |

### AI & Automation

| Page | Content |
|------|---------|
| `/exitfive/` | Claude Code 101 workshop materials |

## Creating New Audit Templates (Python)

Templates created with openpyxl:

```python
import openpyxl
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment

# Styling
header_fill = PatternFill(start_color="4285F4", fill_type="solid")  # Platform color
header_font = Font(bold=True, color="FFFFFF", size=11)
good_fill = PatternFill(start_color="D4EDDA", fill_type="solid")    # Green
warning_fill = PatternFill(start_color="FFF3CD", fill_type="solid") # Yellow
bad_fill = PatternFill(start_color="F8D7DA", fill_type="solid")     # Red

# Check item columns:
# A: Check Item
# B: Status (Pass/Check/Fail)
# C: Current State
# D: Benchmark / Best Practice
# E: Risk Level
# F: 42 Agency POV
```

## Footer Structure

**Social Links:** LinkedIn, X/Twitter, YouTube

```html
<div class="social-links">
    <a href="https://linkedin.com/company/42agency">LinkedIn</a>
    <a href="https://x.com/get42agency">X/Twitter</a>
    <a href="https://www.youtube.com/@Get42Agency">YouTube</a>
</div>

<div class="footer-grid">  <!-- 5 columns -->
    <div class="footer-col">42 Agency</div>
    <div class="footer-col">42/ Essays</div>
    <div class="footer-col">AI Tools</div>
    <div class="footer-col">Paid Media Audits</div>
    <div class="footer-col">Resources</div>
</div>
```

```css
.footer-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
}
```

## Email Validation (REQUIRED FOR ALL NEW PAGES)

**API:** mails.so (real-time email verification)
**Endpoint:** `/api/validate-email?email=...`
**API Key:** `774d5d47-342e-46e9-acc2-5dff192e00ac`

### Adding to New Pages

**ALWAYS include this script before `</body>` on any page with a download form:**

```html
<script src="/js/email-validation.js"></script>
```

**Form requirements:**
- Form must have `id="downloadForm"` or `id="subscribeForm"`
- Form must have class `email-form` with flex layout
- Email input must be `type="email"`
- The script automatically intercepts `onsubmit` handlers

**Example form structure:**
```html
<form class="email-form" id="downloadForm" onsubmit="handleSubmit(event)">
    <input type="email" name="email" placeholder="you@company.com" required>
    <button type="submit">Get Template</button>
</form>

<!-- Email validation MUST be included -->
<script src="/js/email-validation.js"></script>
```

### How It Works
1. Script intercepts the form's `onsubmit` handler
2. User types email → debounce 600ms → validates via API
3. On submit: blocks if invalid, only calls original handler if valid
4. Invalid emails cannot download content

### Validation Logic
| mails.so result | Action |
|-----------------|--------|
| `deliverable` | ✅ Allow |
| `catch_all` | ✅ Allow (risky flag) |
| `unknown` | ✅ Allow (fail open) |
| `is_disposable: true` | ❌ Block |
| `invalid` | ❌ Block |
| `undeliverable` | ❌ Block |

### Files
- `/api/validate-email.js` - Vercel Edge function (proxies to mails.so)
- `/js/email-validation.js` - Client-side validation + UX (handles flex layout)

---

## Creating New Pages Checklist

When creating a new lead magnet page:

- [ ] Use horizontal logo (`/42-logo.png`) with `flex-shrink: 0`
- [ ] Include GTM snippet in `<head>`
- [ ] Include HubSpot tracking script in `<head>`
- [ ] Form has `id="downloadForm"` and `class="email-form"`
- [ ] **Add `<script src="/js/email-validation.js"></script>` before `</body>`**
- [ ] Footer has 5 columns with YouTube link
- [ ] Test email validation blocks disposable emails (try mailinator.com)

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Logo stretched | Use horizontal logo (674x171), add `flex-shrink: 0` to `.logo` |
| Footer columns wrapping | Set `grid-template-columns: repeat(5, 1fr)` |
| Form not submitting to HubSpot | Check API endpoint, verify `collected-forms` in URL |
| Download works with invalid email | Missing `/js/email-validation.js` script |
| Button becomes giant with validation | Script handles this automatically via flex wrapper |

## File Locations

- **Excel templates:** In each page's subdirectory (e.g., `/linkedin-audit/42_LinkedIn_Ads_Audit_Template.xlsx`)
- **Logo:** `/42-logo.png` (horizontal version)
- **Assets source:** `~/Documents/Schema Agency/assets/`

---

## B2B Benchmarks Pages (`/b2b-benchmarks/`)

**URL:** https://intel.42agency.com/b2b-benchmarks
**Last Updated:** February 19, 2026

### Site Structure

| Page | URL | Purpose |
|------|-----|---------|
| Main Benchmarks | `/b2b-benchmarks/` | Gated lead magnet - ungated preview + email gate for industry data |
| Calculator | `/b2b-benchmarks/calculator/` | Interactive tool - input your metrics, compare to benchmarks |
| **Industry pSEO** | | |
| Legal Tech | `/b2b-benchmarks/legal-tech-linkedin-ads/` | pSEO - $97-$350 CPL, role-specific content |
| Healthcare Tech | `/b2b-benchmarks/healthcare-tech-linkedin-ads/` | pSEO - InMail + gift cards, $400-$600 CPL |
| DevOps | `/b2b-benchmarks/devops-linkedin-ads/` | pSEO - $100 Amazon GC = 46% open, $265-$422 CPL |
| FinTech | `/b2b-benchmarks/fintech-linkedin-ads/` | pSEO - Enterprise premium, segment-specific |
| **Tactic/Channel pSEO** | | |
| InMail Benchmarks | `/b2b-benchmarks/linkedin-inmail-benchmarks/` | Gift card strategy - 60-70% CPL reduction |
| Meta Ads | `/b2b-benchmarks/meta-ads-benchmarks/` | B2B retargeting - $50-$150 CPL, ROAS 300-500% |

### Main Page Structure

**Ungated (free preview):**
- Hero stats (87 clients, 14 industries, $5M+ spend)
- LinkedIn Ads benchmark cards + rating scale
- Google Ads benchmark cards + rating scale

**Gated (requires email):**
- LinkedIn CPL by Industry table (14 industries)
- LinkedIn InMail benchmarks (gift card vs no incentive)
- Google Search CPL by Industry
- E-commerce/ROAS benchmarks

**Gate Implementation:**
- One unified sticky gate covering all gated sections
- Email submits to HubSpot Collected Forms API
- localStorage remembers unlock state
- GTM event: `benchmarks_unlocked`

### Overview

Proprietary B2B paid media benchmarks based on real 42 Agency client data. NOT survey data.

**Coverage:**
- 87 B2B clients
- 14 industries
- $5M+ ad spend analyzed
- 4 years of data (2022-2026)

### Data Sources

1. **Google Drive (Primary)** - Campaign planners, monthly insight summaries, recaps
   - Shared Drive ID: `0AOfcq4y0GNrwUk9PVA`
   - Root Folders: `132P9M_MXOW6Kqg2IaKfPjOn4ZOHzTZ8o`, `14-THmjClg6cOI3K27UXLVw3bF-Lymk_r`, `14zmNBaPMxwWgWnZWb6CgvE7FAPr1nYGE`, `1MRhiHSA9z00d92mUCSbHvTVQAAoV1a5s`

2. **42 RAG Database** - Indexed content from Drive, Slack, ClickUp
   - Database: Neon PostgreSQL (see `/Users/42agency/42-rag/.env.local`)

3. **Databox MCP** - Live metrics from connected accounts

### Extraction Scripts

Located in `/Users/42agency/42-rag/scripts/`:

| Script | Purpose |
|--------|---------|
| `list-drive-clients.ts` | List all 87 client folders from Drive |
| `extract-benchmarks.ts` | Extract metrics from monthly reports |
| `extract-all-benchmarks.ts` | Comprehensive extraction from campaign planners |
| `extract-clean-benchmarks.ts` | Verified/cleaned benchmark extraction |
| `read-campaign-planners.ts` | Read raw content from specific planners |
| `final-benchmarks.json` | Compiled benchmark data (JSON) |

### Running Extraction Scripts

```bash
cd ~/42-rag
npx tsx scripts/list-drive-clients.ts        # List all clients
npx tsx scripts/extract-clean-benchmarks.ts  # Extract verified data
```

**Note:** Scripts use Google OAuth via 42 RAG app. Token auto-refreshes from database.

### Key Files with Benchmark Data

| File | Client | Key Metrics |
|------|--------|-------------|
| `STENO Monthly Insight Summary - January` | Steno | LinkedIn CPL $97-341, Google CPL $965 |
| `WestCX Monthly Insight Summary - January` | WestCX | CPL $921, Cost/MQL $1,279 |
| `Sanitaire - Monthly Insight Summary` | Bissell | ROAS 499%, Meta CPL $87 |
| `Ethyca Recap Dec 2025` | Ethyca | CPL $130 (EU AI Act), $288-380 (ICP) |
| `Unblocked <> 42A Campaign Planner` | Unblocked | InMail CPL $265-422 (w/ GC) |
| `Rose Rocket <> 42 Campaign Planner` | Rose Rocket | Cost/SQL $1,778 |
| `Float Campaign Planner` | Float | LinkedIn CPL $1,613 (50+ emp) |

### Industries Covered

1. Legal Tech (Steno, DISCO, Part3)
2. Privacy/Security (Ethyca, Cerby, Teleport, Odaseva)
3. Healthcare Tech (WestCX/TeleVox, OnCall Health, HR for Health)
4. FinTech/Payments (PayNearMe, Float, A2X, Metronome)
5. Logistics (Transfix, Rose Rocket, Afresh, SVT)
6. DevOps/Engineering (Unblocked, Opsera, Stainless)
7. Digital Workplace (Unily, Teamwork, Communo)
8. EdTech/HR (InStride, Mathison, Cognota, Guru)
9. Construction Tech (eSUB, Uptick, Knowify)
10. E-commerce (TryNow, Cin7, Repspark)
11. MarTech (SharpSpring, Klue, Pocus, Knak)
12. Life Sciences (Redica, Cytena, ACTO)
13. UCaaS/Telecom (Evolve IP, PiiComm)
14. Consumer/B2B (Bissell/Sanitaire)

### Quarterly Update Process

1. **Run extraction scripts** to pull latest data from Drive
   ```bash
   cd ~/42-rag
   npx tsx scripts/extract-clean-benchmarks.ts
   ```

2. **Review new Monthly Insight Summaries** - Search Drive for recent months

3. **Update `final-benchmarks.json`** with new data points

4. **Edit `/b2b-benchmarks/index.html`** - Update metrics, add new industries if needed

5. **Update hero stats** - Client count, spend total, date range

6. **Deploy**
   ```bash
   cd ~/Documents/Schema\ Agency/web/intel-pages && vercel --prod
   ```

### Key Benchmark Insights

| Finding | Data Point |
|---------|------------|
| InMail gift cards reduce CPL 60-70% | $1,500+ → $400-500 |
| Role-specific content wins | $97 (Paralegal Playbook) vs $341 (generic) |
| Regulatory content performs | $130 CPL (EU AI Act) |
| Exact match 2x better | $1,200 vs $2,800 MQL |
| Search > PMax for ROAS | 553% vs 436% |
| Construction has lowest Google CPL | $150-300 |
| FinTech enterprise premium | $1,500-1,800 CPL (50+ emp) |

---

*Last updated: February 19, 2026 - Added B2B benchmarks documentation with 87 clients across 14 industries*
