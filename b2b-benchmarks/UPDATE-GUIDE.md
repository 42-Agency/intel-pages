# B2B Benchmarks Quarterly Update Guide

**Last Updated:** February 19, 2026
**Live URL:** https://intel.42agency.com/b2b-benchmarks

## Site Structure

| Page | URL | Purpose |
|------|-----|---------|
| Main Benchmarks | `/b2b-benchmarks/` | Gated lead magnet with all industry data |
| Calculator | `/b2b-benchmarks/calculator/` | Interactive benchmark comparison tool |
| **Industry Pages** | | |
| Legal Tech | `/b2b-benchmarks/legal-tech-linkedin-ads/` | pSEO - $97-$350 CPL |
| Healthcare Tech | `/b2b-benchmarks/healthcare-tech-linkedin-ads/` | pSEO - $400-$600 CPL |
| DevOps | `/b2b-benchmarks/devops-linkedin-ads/` | pSEO - Gift card strategy |
| FinTech | `/b2b-benchmarks/fintech-linkedin-ads/` | pSEO - Enterprise vs SMB |
| **Tactic/Channel Pages** | | |
| InMail Benchmarks | `/b2b-benchmarks/linkedin-inmail-benchmarks/` | Gift card strategy, 60-70% CPL reduction |
| Meta Ads Benchmarks | `/b2b-benchmarks/meta-ads-benchmarks/` | B2B retargeting, ROAS 300-500% |

## Quick Stats

- **87 clients** across **14 industries**
- **$5M+** ad spend analyzed
- **4 years** of data (2022-2026)

---

## Update Process

### Step 1: Extract Fresh Data

```bash
cd ~/42-rag
npx tsx scripts/list-drive-clients.ts        # Check for new clients
npx tsx scripts/extract-clean-benchmarks.ts  # Pull latest metrics
```

### Step 2: Check Recent Reports

Search Google Drive for:
- `[Client] Monthly Insight Summary - [Month]`
- `[Client] Recap`
- `[Client] Campaign Planner`

**Key files with benchmark data:**
- Monthly Insight Summaries (STENO, WestCX, Sanitaire)
- Campaign Planners (all clients)
- Recap documents (Ethyca, TeleVox, Redica)

### Step 3: Update Benchmark Data

Edit `benchmarks-data.json` with new metrics.

### Step 4: Update HTML

Edit `index.html`:
1. Update hero stats (client count, spend, date range)
2. Add/update industry CPL tables
3. Add new insights

### Step 5: Deploy

```bash
cd ~/Documents/Schema\ Agency/web/intel-pages && vercel --prod
```

---

## Data Sources

| Source | Access | Key Data |
|--------|--------|----------|
| Google Drive | 42 RAG OAuth | Campaign planners, monthly reports |
| 42 RAG Database | Neon PostgreSQL | Indexed content (may be stale) |
| Databox MCP | API | Live metrics from connected accounts |

**Google Drive Folders:**
- `0AOfcq4y0GNrwUk9PVA` (Shared Drive)
- `1MRhiHSA9z00d92mUCSbHvTVQAAoV1a5s` (Additional clients)

---

## Industry Reference

| Industry | Clients | LinkedIn CPL | Google CPL |
|----------|---------|--------------|------------|
| Legal Tech | Steno, DISCO, Part3 | $97-350 | $900-1,500 |
| Privacy/Security | Ethyca, Cerby, Teleport | $130-400 | — |
| Healthcare Tech | WestCX, OnCall, HRFH | $400-1,000 | $800-1,100 |
| FinTech | PayNearMe, Float, A2X | $200-1,800 | — |
| Logistics | Transfix, Rose Rocket | $300-600 | $1,500-3,000 |
| DevOps | Unblocked, Opsera | $400-2,500 | — |
| Digital Workplace | Unily, Teamwork | $350-800 | $1,000-3,000 |
| EdTech/HR | InStride, Mathison | $150-500 | — |
| Construction | eSUB, Uptick | $150-700 | $150-300 |
| E-commerce | TryNow, Cin7 | — | ROAS 300-500% |
| MarTech | SharpSpring, Klue | $300-600 | — |
| Life Sciences | Redica, Cytena | $300-800 | — |
| UCaaS | Evolve IP, PiiComm | $300-500 | $200-400 |
| Consumer/B2B | Bissell/Sanitaire | $50-100 | ROAS 500% |

---

## Key Insights to Track

1. **InMail with gift cards** - Should see 60-70% CPL reduction
2. **Role-specific content** - 2-4x better than generic
3. **Regulatory content** - Low CPL for compliance topics
4. **Exact vs phrase match** - 2x efficiency difference
5. **Search vs PMax** - Search typically 20% better ROAS

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main benchmark page |
| `benchmarks-data.json` | Structured benchmark data |
| `UPDATE-GUIDE.md` | This file |

**Extraction scripts:** `~/42-rag/scripts/`
