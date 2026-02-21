# 42 Agency Account Scoring Template

## How to Use This Template

1. Copy this into Google Sheets
2. Add your target accounts in the "Account Scorer" tab
3. Input signal data for each account
4. Scores calculate automatically
5. Use scores to prioritize and route accounts

---

## TAB 1: Scoring Model

### Signal Categories & Point Values

| Category | Signal | Threshold | Points |
|----------|--------|-----------|--------|
| **ENGAGEMENT** | LinkedIn Impressions | 40+ | 5 |
| | LinkedIn Impressions | 100+ | 10 |
| | LinkedIn Impressions | 200+ | 15 |
| | LinkedIn Clicks | 5+ | 5 |
| | LinkedIn Clicks | 10+ | 10 |
| | LinkedIn Clicks | 20+ | 15 |
| | Website Visits | 1 | 5 |
| | Website Visits | 3+ | 10 |
| | Website Visits (High Intent Page) | Any | 15 |
| | Email Opens | Any | 5 |
| | Email Clicks | Any | 5 |
| **Category Max** | | | **30** |
| | | | |
| **HIGH INTENT PAGES** | Pricing Page Visit | Yes | 15 |
| | Product Tour Started | Yes | 10 |
| | Demo Page Visit | Yes | 15 |
| | Integration/Docs Page | Yes | 10 |
| **Category Max** | | | **25** |
| | | | |
| **INTENT DATA** | HG Insights Score | 20-49 | 5 |
| | HG Insights Score | 50-69 | 10 |
| | HG Insights Score | 70+ | 15 |
| | ZoomInfo Intent | 20-49 | 5 |
| | ZoomInfo Intent | 50-69 | 10 |
| | ZoomInfo Intent | 70+ | 15 |
| | Bombora Surge | Active | 10 |
| **Category Max** | | | **15** |
| | | | |
| **BUYING GROUP DEPTH** | Contacts Engaged | 2+ | 5 |
| | Contacts Engaged | 3+ | 10 |
| | Director+ Engaged | Yes | 10 |
| | VP+ Engaged | Yes | 15 |
| **Category Max** | | | **15** |
| | | | |
| **SALES READINESS** | Product Tour Completed | Yes | 10 |
| | Demo Requested | Yes | 15 |
| | Responded to Outbound | Yes | 10 |
| | Meeting Booked | Yes | 15 |
| **Category Max** | | | **15** |

**TOTAL POSSIBLE: 100 points**

---

## TAB 2: Score Decay

### Recency Multiplier

| Days Since Last Activity | Score Retained |
|--------------------------|----------------|
| 0-90 days | 100% |
| 91-120 days | 70% |
| 121-150 days | 40% |
| 151-200 days | 10% |
| 201+ days | 0% |

**Formula:** `Final Score = Raw Score × Recency Multiplier`

**Example:**
- Account scored 65 points
- Last activity was 100 days ago
- Recency multiplier = 70%
- Final Score = 65 × 0.70 = **45.5**

---

## TAB 3: Score to Stage Mapping

| Score Range | Lifecycle Stage | Definition | Owner |
|-------------|-----------------|------------|-------|
| 0-9 | **Identified** | On target list, no engagement | Marketing |
| 10-24 | **Awareness** | Basic signals (impressions, opens) | Marketing |
| 25-49 | **Consideration** | Multi-channel engagement | Marketing + BDR |
| 50-69 | **XQA** | Buying signals, multi-threaded | BDR + AE |
| 70+ | **SQA** | Active opportunity ready | AE |

---

## TAB 4: Account Scorer (Input Sheet)

### Instructions
1. Add account name in Column A
2. Fill in signal data (Y/N or numbers) in each column
3. Score calculates automatically in the SCORE column
4. Sort by score to prioritize

| Account | LI Impr | LI Clicks | Web Visits | Email Opens | Email Clicks | Pricing Page | Demo Page | Product Tour | HG Score | ZI Score | Contacts Engaged | Director+ | Outbound Reply | Last Activity Date | RAW SCORE | DECAY MULT | FINAL SCORE | STAGE |
|---------|---------|-----------|------------|-------------|--------------|--------------|-----------|--------------|----------|----------|------------------|-----------|----------------|--------------------|-----------| ------------|-------------|-------|
| Example Corp | 150 | 12 | 5 | Y | Y | Y | N | Y | 65 | 55 | 3 | Y | N | 2026-01-15 | 75 | 1.0 | 75 | SQA |
| Acme Inc | 80 | 5 | 2 | Y | N | N | N | N | 35 | 40 | 1 | N | N | 2025-11-01 | 30 | 0.7 | 21 | Awareness |
| | | | | | | | | | | | | | | | | | | |

---

## TAB 5: Scoring Logic (for Google Sheets formulas)

### LinkedIn Impressions Score
```
=IF(B2>=200, 15, IF(B2>=100, 10, IF(B2>=40, 5, 0)))
```

### LinkedIn Clicks Score
```
=IF(C2>=20, 15, IF(C2>=10, 10, IF(C2>=5, 5, 0)))
```

### Website Visits Score
```
=IF(D2>=3, 10, IF(D2>=1, 5, 0))
```

### Email Score
```
=IF(E2="Y", 5, 0) + IF(F2="Y", 5, 0)
```

### High Intent Pages Score
```
=IF(G2="Y", 15, 0) + IF(H2="Y", 15, 0) + IF(I2="Y", 10, 0)
```

### Intent Data Score (use higher of HG or ZI)
```
=MAX(
  IF(J2>=70, 15, IF(J2>=50, 10, IF(J2>=20, 5, 0))),
  IF(K2>=70, 15, IF(K2>=50, 10, IF(K2>=20, 5, 0)))
)
```

### Buying Group Score
```
=IF(L2>=3, 10, IF(L2>=2, 5, 0)) + IF(M2="Y", 10, 0)
```

### Sales Readiness Score
```
=IF(N2="Y", 10, 0)
```

### Decay Multiplier
```
=IF(TODAY()-O2<=90, 1, IF(TODAY()-O2<=120, 0.7, IF(TODAY()-O2<=150, 0.4, IF(TODAY()-O2<=200, 0.1, 0))))
```

### Final Score
```
=P2 * Q2
```

### Stage Assignment
```
=IF(R2>=70, "SQA", IF(R2>=50, "XQA", IF(R2>=25, "Consideration", IF(R2>=10, "Awareness", "Identified"))))
```

---

## TAB 6: Signal Sources Reference

### Where to Get Each Signal

| Signal | Source | How to Pull |
|--------|--------|-------------|
| LinkedIn Impressions | LinkedIn Campaign Manager | Export → Company Report |
| LinkedIn Clicks | LinkedIn Campaign Manager | Export → Company Report |
| Website Visits | HubSpot / GA4 / Clearbit Reveal | Company-level traffic report |
| Email Opens/Clicks | HubSpot / Outreach / Salesloft | Engagement by company |
| Pricing Page | HubSpot / Heap / Syft | High-intent page filter |
| Product Tour | Navattic / Storylane / Reprise | Completion report |
| HG Insights | HG Insights | Intent score export |
| ZoomInfo Intent | ZoomInfo | Intent signals export |
| Contacts Engaged | HubSpot | Contacts by company |
| Outbound Reply | Outreach / Salesloft | Reply tracking |

---

## Quick Start

1. **Export LinkedIn data** (Campaign Manager → Reporting → Companies)
2. **Export HubSpot contacts** (filter by company, engagement)
3. **Match to target accounts** (VLOOKUP by domain)
4. **Fill in scoring sheet** (or automate with Zapier/Clay)
5. **Sort by Final Score** (descending)
6. **Route to BDR/AE** based on stage

---

*Built by 42 Agency | 42agency.com*
