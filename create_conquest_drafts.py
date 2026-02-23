#!/usr/bin/env python3
"""
Create Gmail drafts for Mode E (Pain-Driven Follow-Up) conquest campaigns.
Uses the gmail_sender.py create_draft function.
"""

import sys
sys.path.insert(0, '/Users/42agency/Documents/Schema Agency/lib')

from gmail_sender import create_draft

# Prospect data with complaints extracted from conquest pages
PROSPECTS = [
    {
        "name": "Jessica",
        "email": "jessica.newland@itential.com",
        "company": "Itential",
        "competitor": "Ansible Tower",
        "complaint_1": "YAML Hell & Complexity",
        "quote_1": "It's a mess of YAML and what feels like a million YAML files that is always extremely hard to follow.",
        "complaint_2": "Idempotency is Broken",
        "quote_2": "The tool is fundamentally procedural rather than declarative, making idempotency harder by design.",
        "audience_size": "45K+",
        "conquest_url": "https://intel.42agency.com/itential-conquest/"
    },
    {
        "name": "Sarah",
        "email": "sarahf@wix.com",
        "company": "Wix",
        "competitor": "Webflow & Squarespace",
        "complaint_1": "Vendor Lock-In Nightmare",
        "quote_1": "Webflow CMS data cannot be migrated. That's vendor lock in pure and simple.",
        "complaint_2": "Pricing Shock & Hidden Costs",
        "quote_2": "The Pro plan has jumped from $35 to $60 per month - an extra $360 annually.",
        "audience_size": "85K+",
        "conquest_url": "https://intel.42agency.com/wix-conquest/"
    },
    {
        "name": "Tamar",
        "email": "tamar@glyphic.ai",
        "company": "Glyphic",
        "competitor": "Gong",
        "complaint_1": "Pricing Shock & Hidden Fees",
        "quote_1": "We planned for $100K. Ended up spending closer to $140K once we factored in services and team training.",
        "complaint_2": "Complex & Hard to Use",
        "quote_2": "It's too complicated, and not intuitive at all. Searching for calls is not easy.",
        "audience_size": "120K+",
        "conquest_url": "https://intel.42agency.com/glyphic-conquest/"
    },
    {
        "name": "Kali",
        "email": "kali.geldis@graphiteconnect.com",
        "company": "Graphite Connect",
        "competitor": "SAP Ariba",
        "complaint_1": "Supplier Onboarding Nightmare",
        "quote_1": "Ariba doesn't have customers, it has prisoners.",
        "complaint_2": "Horrible User Experience",
        "quote_2": "The user experience is easily the worst imaginable. Pages don't even fit on desktop let alone mobile.",
        "audience_size": "32K+",
        "conquest_url": "https://intel.42agency.com/graphite-conquest/"
    },
    {
        "name": "Brett",
        "email": "brett.rudisill@healthmine.com",
        "company": "Healthmine",
        "competitor": "Livongo",
        "complaint_1": "Billing Nightmares & Hidden Fees",
        "quote_1": "Charges continued even when I never actually used the service. They keep sending me a message that they have 'Created a ticket.'",
        "complaint_2": "Inaccurate Device Readings",
        "quote_2": "Variance of 10-25 points between Livongo and Accu-Chek. Livongo consistently higher - high risk of taking the wrong insulin dose.",
        "audience_size": "28K+",
        "conquest_url": "https://intel.42agency.com/healthmine-conquest/"
    },
    {
        "name": "Varun",
        "email": "varun@luminai.com",
        "company": "Luminai",
        "competitor": "UiPath",
        "complaint_1": "Expensive & Complex Licensing",
        "quote_1": "Licensing costs are prohibitive, especially for small to medium-sized businesses.",
        "complaint_2": "Updates Break Everything",
        "quote_2": "When upgraded to UiPath 2024.10 release, it broke a lot of workflows.",
        "audience_size": "95K+",
        "conquest_url": "https://intel.42agency.com/luminai-conquest/"
    },
    {
        "name": "Jingning",
        "email": "jingning@plotly.com",
        "company": "Plotly",
        "competitor": "Tableau",
        "complaint_1": "Expensive Per-User Pricing",
        "quote_1": "Monthly costs for a 100-person org can exceed $30,000.",
        "complaint_2": "Steep Learning Curve",
        "quote_2": "The learning curve is really steep. It takes a long time to learn fairly basic operations.",
        "audience_size": "180K+",
        "conquest_url": "https://intel.42agency.com/plotly-conquest/"
    },
    {
        "name": "Ross",
        "email": "ross@prosperops.com",
        "company": "ProsperOps",
        "competitor": "CloudHealth",
        "complaint_1": "Manual Work Never Ends",
        "quote_1": "The interface can be slow and unintuitive, making it difficult to build complex, multidimensional reports.",
        "complaint_2": "Commitments = Lock-In Risk",
        "quote_2": "Once committed to a Savings Plan, you are stuck with it. You risk that your instance type would get cheaper over the term.",
        "audience_size": "65K+",
        "conquest_url": "https://intel.42agency.com/prosperops-conquest/"
    },
    {
        "name": "Stephany",
        "email": "slapierre@tealbook.com",
        "company": "TealBook",
        "competitor": "Dun & Bradstreet",
        "complaint_1": "Data Quality Issues",
        "quote_1": "The data quality constantly drags the whole thing down. Too many contacts outdated, people who've left, retired, or died.",
        "complaint_2": "Paying to Fix Their Errors",
        "quote_2": "Does it make sense when D&B asks you to pay to correct an error in their records?",
        "audience_size": "42K+",
        "conquest_url": "https://intel.42agency.com/tealbook-conquest/"
    }
]


def generate_email_html(prospect):
    """Generate Mode E pain-driven follow-up email HTML."""
    return f'''<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; color: #1a1a1a; line-height: 1.6;">
  <p>Hi {prospect["name"]},</p>

  <p>Following up — I ran a sentiment scan on <strong>{prospect["competitor"]}</strong> and found something interesting.</p>

  <p>Across Reddit, G2, and Hacker News, their users keep complaining about:</p>

  <ul style="margin: 16px 0; padding-left: 20px;">
    <li><strong>{prospect["complaint_1"]}</strong> — "{prospect["quote_1"]}"</li>
    <li><strong>{prospect["complaint_2"]}</strong> — "{prospect["quote_2"]}"</li>
  </ul>

  <p>There are <strong>{prospect["audience_size"]} {prospect["competitor"]} users</strong> on LinkedIn you could target with a conquest campaign.</p>

  <p>Put together a 1-pager showing the complaints + a campaign concept: <a href="{prospect["conquest_url"]}" style="color: #5BD675; font-weight: 600;">View the Weakness Map →</a></p>

  <p>Worth 15 minutes to walk through?</p>

  <p style="margin-top: 24px;">
    Kamil<br>
    <span style="color: #666; font-size: 14px;">Founder, 42 Agency</span>
  </p>
</div>'''


def main():
    print("=" * 60)
    print("Creating Gmail Drafts - Mode E Pain-Driven Follow-Ups")
    print("=" * 60)
    print()

    results = []

    for prospect in PROSPECTS:
        subject = f"{prospect['competitor']} complaints — quick opportunity"
        body_html = generate_email_html(prospect)

        print(f"Creating draft for {prospect['name']} at {prospect['company']}...")

        result = create_draft(
            to=prospect['email'],
            subject=subject,
            body_html=body_html
        )

        results.append({
            "company": prospect["company"],
            "email": prospect["email"],
            "success": result.get("success", False),
            "draft_id": result.get("draft_id"),
            "error": result.get("error")
        })

        if result.get("success"):
            print(f"  ✓ Draft created: {result.get('draft_id')}")
        else:
            print(f"  ✗ Error: {result.get('error')}")

    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)

    success_count = sum(1 for r in results if r["success"])
    print(f"\nCreated {success_count}/{len(PROSPECTS)} drafts successfully.")
    print("\nDrafts created for:")

    for r in results:
        status = "✓" if r["success"] else "✗"
        print(f"  {status} {r['company']} ({r['email']})")

    print("\n→ Check your Gmail Drafts folder to review and send.")


if __name__ == "__main__":
    main()
