# Intel Pages Update - February 21, 2026

## Summary
Added 17 new lead magnet pages and 2 API endpoints based on RAG database analysis of 42 Agency knowledge base.

## New Pages

### Industry Benchmark pSEO Pages (10)
All follow the Intel design system with LinkedIn blue hero, stats grid, benchmark tables, insight boxes, and email capture CTAs.

| Industry | URL | Key Metrics |
|----------|-----|-------------|
| Privacy & Security | `/b2b-benchmarks/privacy-security-linkedin-ads/` | CPL $130-$400 |
| Logistics & Supply Chain | `/b2b-benchmarks/logistics-linkedin-ads/` | CPL $300-$600, Google SQL $1,500-$3,000 |
| Construction Tech | `/b2b-benchmarks/construction-tech-linkedin-ads/` | Google CPL $150-$300, LinkedIn $400-$700 |
| E-commerce & Retail Tech | `/b2b-benchmarks/ecommerce-retail-linkedin-ads/` | Meta CPL $50-$100, ROAS 300-500% |
| Digital Workplace | `/b2b-benchmarks/digital-workplace-linkedin-ads/` | CPL $500-$800 |
| EdTech & HR Tech | `/b2b-benchmarks/edtech-hrtech-linkedin-ads/` | CPL $250-$500 |
| MarTech & SalesTech | `/b2b-benchmarks/martech-salestech-linkedin-ads/` | CPL $300-$600 |
| Life Sciences & Pharma | `/b2b-benchmarks/life-sciences-linkedin-ads/` | CPL $400-$800 |
| UCaaS & Telecom | `/b2b-benchmarks/ucaas-telecom-linkedin-ads/` | LinkedIn CPL $300-$500, Google $200-$400 |
| Consumer/B2B Hybrid | `/b2b-benchmarks/consumer-b2b-linkedin-ads/` | ROAS 450-550%, Meta CPL $80-$100 |

### Calculator Tools (2)
Interactive tools with email-gated results, Chart.js visualizations, and HubSpot/Resend integration.

| Tool | URL | Features |
|------|-----|----------|
| LinkedIn InMail ROI Calculator | `/tools/linkedin-inmail-calculator/` | Gift card analysis, CPL comparison, break-even table |
| Meta Budget Calculator | `/tools/meta-budget-calculator/` | Campaign type selector, budget tiers, reach estimates |

### Playbooks (5 + hub)
Gated downloadable content with practical frameworks and templates.

| Playbook | URL | Focus |
|----------|-----|-------|
| Hub | `/playbooks/` | Index of all playbooks |
| Closed Lost Revival | `/playbooks/closed-lost-revival/` | Timing triggers, re-engagement sequences |
| Lead Scoring Framework | `/playbooks/lead-scoring-framework/` | ICP fit + engagement scoring |
| Lead Re-Engagement | `/playbooks/lead-reengagement/` | Cold lead segmentation, sunset policies |
| Intent Signals | `/playbooks/intent-signals/` | First/second/third-party intent data |
| ABM Enrichment | `/playbooks/abm-enrichment/` | Account data, contact acquisition |

## New API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/inmail-calculator` | InMail ROI Calculator → Email + HubSpot CRM + Resend |
| `/api/meta-budget` | Meta Budget Calculator → Email + HubSpot CRM + Resend |

## Documentation Updated
- `CLAUDE.md` - Added new URLs and API endpoints to site architecture
- `LEAD-MAGNET-IDEAS.md` - Full analysis of potential lead magnets from RAG
- `LEAD-MAGNET-AUDIT.md` - Gap analysis comparing existing vs new assets

## Deployment
- Git commit: `a4b803d`
- Production URL: https://intel.42agency.com
- All pages live and functional
