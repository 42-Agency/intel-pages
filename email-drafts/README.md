# Mode E Conquest Email Drafts

9 pain-driven follow-up emails ready to copy into Gmail.

## Quick Copy Instructions

1. Open Gmail and click "Compose"
2. Copy the **To:** and **Subject:** fields
3. Click the "..." menu > "Insert HTML" or paste the body
4. Review and send

## Drafts

| Company | Contact | Email | Conquest Page |
|---------|---------|-------|---------------|
| Itential | Jessica Newland | jessica.newland@itential.com | [View](https://intel.42agency.com/itential-conquest/) |
| Wix | Sarah Friedlander Garcia | sarahf@wix.com | [View](https://intel.42agency.com/wix-conquest/) |
| Glyphic | Tamar Martirosyan | tamar@glyphic.ai | [View](https://intel.42agency.com/glyphic-conquest/) |
| Graphite Connect | Kali Geldis | kali.geldis@graphiteconnect.com | [View](https://intel.42agency.com/graphite-conquest/) |
| Healthmine | Brett Rudisill | brett.rudisill@healthmine.com | [View](https://intel.42agency.com/healthmine-conquest/) |
| Luminai | Varun Boriah | varun@luminai.com | [View](https://intel.42agency.com/luminai-conquest/) |
| Plotly | Jingning Zhang | jingning@plotly.com | [View](https://intel.42agency.com/plotly-conquest/) |
| ProsperOps | Ross Clurman | ross@prosperops.com | [View](https://intel.42agency.com/prosperops-conquest/) |
| TealBook | Stephany Lapierre | slapierre@tealbook.com | [View](https://intel.42agency.com/tealbook-conquest/) |

## To Re-Authenticate Gmail for Draft Creation

```bash
cd ~/Documents/Schema\ Agency && source venv/bin/activate
rm ~/.config/42agency/gmail_token.json
python3 lib/gmail_sender.py --setup
```

Then re-run: `python3 /Users/42agency/intel-pages/create_conquest_drafts.py`
