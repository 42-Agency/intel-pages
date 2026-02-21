// Vercel Edge Function for B2B Benchmark Calculator Results
// Sends email via Resend + pushes to HubSpot + Resend Audience

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, result } = await request.json();

    // 1. Send email via Resend
    const emailResult = await sendResultsEmail(email, result);

    // 2. Push to HubSpot CRM
    const hubspotResult = await pushToHubSpot(email, result);

    // 3. Push to Resend Audience
    const resendContactResult = await pushToResendAudience(email);

    return new Response(JSON.stringify({
      success: true,
      emailSent: emailResult.success,
      hubspotPushed: hubspotResult.success,
      resendContactCreated: resendContactResult.success,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing calculator results:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to process results' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function sendResultsEmail(email, result) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return { success: false, reason: 'not_configured' };

  try {
    const scoreColor = result.score >= 70 ? '#10B981' : result.score >= 40 ? '#F59E0B' : '#EF4444';
    const scoreBg = result.score >= 70 ? '#D1FAE5' : result.score >= 40 ? '#FEF3C7' : '#FEE2E2';

    // Build LinkedIn metrics rows
    const linkedinRows = result.linkedin.map(m => {
      const statusColor = m.rating === 'Excellent' ? '#10B981' : m.rating === 'Good' ? '#3B82F6' : m.rating === 'Average' ? '#F59E0B' : '#EF4444';
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;">${m.name}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;font-weight:bold;">${m.value}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;color:#666;">${m.benchmark}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right;"><span style="background:${statusColor};color:white;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:bold;">${m.rating}</span></td></tr>`;
    }).join('');

    // Build Google metrics rows
    const googleRows = result.google.map(m => {
      const statusColor = m.rating === 'Excellent' ? '#10B981' : m.rating === 'Good' ? '#3B82F6' : m.rating === 'Average' ? '#F59E0B' : '#EF4444';
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;">${m.name}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;font-weight:bold;">${m.value}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;color:#666;">${m.benchmark}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right;"><span style="background:${statusColor};color:white;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:bold;">${m.rating}</span></td></tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;margin:0;padding:20px;"><div style="max-width:600px;margin:0 auto;background:white;border:2px solid #1a1a1a;border-radius:16px;overflow:hidden;"><div style="background:#DFFE68;padding:24px;border-bottom:2px solid #1a1a1a;"><table width="100%"><tr><td><div style="width:40px;height:40px;background:white;border:2px solid #1a1a1a;border-radius:8px;text-align:center;line-height:36px;font-weight:bold;">42</div></td><td style="text-align:right;"><span style="color:#1a1a1a;font-weight:bold;">B2B Benchmark Calculator Results</span></td></tr></table></div><div style="padding:32px;"><p style="color:#4a4a4a;margin:0 0 24px 0;">Here are your B2B Paid Media Benchmark results:</p><div style="text-align:center;margin:32px 0;"><div style="display:inline-block;width:120px;height:120px;border:4px solid ${scoreColor};border-radius:50%;background:${scoreBg};"><div style="margin-top:28px;"><div style="font-size:36px;font-weight:bold;color:${scoreColor};">${result.score}</div><div style="font-size:14px;font-weight:bold;color:${scoreColor};">out of 100</div></div></div><h2 style="color:#1a1a1a;margin:16px 0 4px 0;">Your Performance Score</h2><p style="color:#666;margin:0;font-size:14px;">${result.industry}</p></div><div style="background:#f5f5f5;border:2px solid #1a1a1a;border-radius:12px;padding:16px;margin:24px 0;"><h3 style="color:#0A66C2;margin:0 0 12px 0;display:flex;align-items:center;gap:8px;">LinkedIn Ads</h3><table width="100%" style="border-collapse:collapse;font-size:14px;"><tr style="color:#666;font-size:12px;"><td>Metric</td><td>Your Value</td><td>Benchmark</td><td style="text-align:right;">Rating</td></tr>${linkedinRows}</table></div><div style="background:#f5f5f5;border:2px solid #1a1a1a;border-radius:12px;padding:16px;margin:24px 0;"><h3 style="color:#4285F4;margin:0 0 12px 0;display:flex;align-items:center;gap:8px;">Google Ads</h3><table width="100%" style="border-collapse:collapse;font-size:14px;"><tr style="color:#666;font-size:12px;"><td>Metric</td><td>Your Value</td><td>Benchmark</td><td style="text-align:right;">Rating</td></tr>${googleRows}</table></div>${result.score < 70 ? `<div style="background:#DFFE68;border:2px solid #1a1a1a;border-radius:12px;padding:24px;margin:24px 0;text-align:center;"><h3 style="color:#1a1a1a;margin:0 0 12px 0;">Want Help Improving These Metrics?</h3><p style="color:#4a4a4a;margin:0 0 16px 0;">Get a free audit of your campaigns against these benchmarks.</p><a href="https://42agency.com/contact?utm_source=calculator_email&utm_medium=b2b-benchmarks" style="display:inline-block;background:#1a1a1a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Get Your Free Audit</a></div>` : ''}<p style="color:#6b6b6b;font-size:14px;margin:24px 0 0 0;">Run another calculation anytime at:<br><a href="https://intel.42agency.com/assess/calculator" style="color:#3B82F6;">intel.42agency.com/assess/calculator</a></p></div><div style="background:#1a1a1a;padding:16px 24px;text-align:center;"><p style="color:#9a9a9a;margin:0;font-size:12px;">Built by <a href="https://42agency.com" style="color:#DFFE68;">42 Agency</a> — B2B Demand Gen & Marketing Ops</p></div></div></body></html>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: '42 Agency <noreply@42agency.com>',
        to: email,
        subject: `Your B2B Benchmark Score: ${result.score}/100 (${result.industry})`,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Resend email error:', error);
    return { success: false, error };
  }
}

async function pushToHubSpot(email, result) {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!accessToken || accessToken.includes('REPLACE')) {
    return { success: false, reason: 'not_configured' };
  }

  try {
    // Search for existing contact
    const searchResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
        }],
      }),
    });

    const searchData = await searchResponse.json();
    const existingContactId = searchData.results?.[0]?.id;

    // Find weakest metric
    const allMetrics = [...result.linkedin, ...result.google].filter(m => m.rating);
    const ratingOrder = ['Poor', 'Average', 'Good', 'Excellent'];
    const weakest = allMetrics.sort((a, b) => ratingOrder.indexOf(a.rating) - ratingOrder.indexOf(b.rating))[0];

    const properties = {
      email,
      benchmark_calculator_score: result.score.toString(),
      benchmark_calculator_industry: result.industry,
      benchmark_calculator_date: new Date().toISOString().split('T')[0],
      benchmark_calculator_weakest_metric: weakest ? `${weakest.name}: ${weakest.rating}` : '',
      benchmark_calculator_linkedin_cpl: result.linkedin.find(m => m.name === 'CPL')?.value || '',
      benchmark_calculator_google_cpa: result.google.find(m => m.name === 'Cost/Conv')?.value || '',
      lifecyclestage: 'lead',
      hs_lead_status: result.score < 50 ? 'NEW' : 'OPEN',
    };

    if (existingContactId) {
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingContactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    } else {
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('HubSpot API error:', error);
    return { success: false, error };
  }
}

async function pushToResendAudience(email) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    return { success: false, reason: 'not_configured' };
  }

  try {
    const response = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Resend Audience API error:', error);
    return { success: false, error };
  }
}
