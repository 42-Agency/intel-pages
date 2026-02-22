// Vercel Edge Function for LinkedIn Ads Budget Calculator
// Parses ICP, gets LinkedIn pricing, sends email + pushes to HubSpot

export const config = {
  runtime: 'edge',
};

// ICP parsing prompt for Claude
const ICP_PARSE_PROMPT = `You are a LinkedIn Ads targeting expert. Parse the following ICP description into LinkedIn targeting criteria.

ICP Description:
"{icp}"

Return a JSON object with these fields (use empty arrays if not applicable):
{
  "jobTitles": ["VP of Marketing", "Chief Marketing Officer", "Director of Marketing"],
  "seniorities": ["Director", "VP", "CXO"],
  "industries": ["Computer Software", "Information Technology"],
  "companySizes": ["1001-5000 employees", "5001-10,000 employees", "10,001+ employees"],
  "jobFunctions": ["Marketing"],
  "summary": "Brief 1-sentence summary of the target audience"
}

Rules:
- Generate 5-15 specific job title variations for precision targeting
- Map seniority levels: Entry, Senior, Manager, Director, VP, CXO, Owner
- Company sizes must use EXACT strings: "2-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "501-1000 employees", "1001-5000 employees", "5001-10,000 employees", "10,001+ employees"
- "Enterprise" = ["1001-5000 employees", "5001-10,000 employees", "10,001+ employees"]
- "SMB/Mid-market" = ["51-200 employees", "201-500 employees", "501-1000 employees"]
- Use industries like: "Computer Software", "Information Technology", "Internet", "Financial Services", "Hospital & Health Care", etc.

Return ONLY valid JSON, no markdown.`;

// URN mappings for LinkedIn targeting
const SENIORITY_URNS = {
  'Entry': 'urn:li:seniority:1',
  'Senior': 'urn:li:seniority:2',
  'Manager': 'urn:li:seniority:3',
  'Director': 'urn:li:seniority:4',
  'VP': 'urn:li:seniority:5',
  'CXO': 'urn:li:seniority:6',
  'Owner': 'urn:li:seniority:7',
  'Partner': 'urn:li:seniority:8',
  'Unpaid': 'urn:li:seniority:9',
  'Training': 'urn:li:seniority:10'
};

const COMPANY_SIZE_URNS = {
  '1 employee': 'urn:li:staffCountRange:(1,1)',
  '2-10 employees': 'urn:li:staffCountRange:(2,10)',
  '11-50 employees': 'urn:li:staffCountRange:(11,50)',
  '51-200 employees': 'urn:li:staffCountRange:(51,200)',
  '201-500 employees': 'urn:li:staffCountRange:(201,500)',
  '501-1000 employees': 'urn:li:staffCountRange:(501,1000)',
  '1001-5000 employees': 'urn:li:staffCountRange:(1001,5000)',
  '5001-10,000 employees': 'urn:li:staffCountRange:(5001,10000)',
  '10,001+ employees': 'urn:li:staffCountRange:(10001,2147483647)'
};

// Common job function URNs
const JOB_FUNCTION_URNS = {
  'Accounting': 'urn:li:function:1',
  'Administrative': 'urn:li:function:2',
  'Arts and Design': 'urn:li:function:3',
  'Business Development': 'urn:li:function:4',
  'Community and Social Services': 'urn:li:function:5',
  'Consulting': 'urn:li:function:6',
  'Education': 'urn:li:function:7',
  'Engineering': 'urn:li:function:8',
  'Entrepreneurship': 'urn:li:function:9',
  'Finance': 'urn:li:function:10',
  'Healthcare Services': 'urn:li:function:11',
  'Human Resources': 'urn:li:function:12',
  'Information Technology': 'urn:li:function:13',
  'Legal': 'urn:li:function:14',
  'Marketing': 'urn:li:function:15',
  'Media and Communication': 'urn:li:function:16',
  'Military and Protective Services': 'urn:li:function:17',
  'Operations': 'urn:li:function:18',
  'Product Management': 'urn:li:function:19',
  'Program and Project Management': 'urn:li:function:20',
  'Purchasing': 'urn:li:function:21',
  'Quality Assurance': 'urn:li:function:22',
  'Real Estate': 'urn:li:function:23',
  'Research': 'urn:li:function:24',
  'Sales': 'urn:li:function:25',
  'Support': 'urn:li:function:26'
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, icp } = await request.json();

    if (!icp || !email) {
      return new Response(JSON.stringify({ error: 'ICP and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 1: Parse ICP with Claude
    const parsedICP = await parseICPWithClaude(icp);
    console.log('Parsed ICP:', JSON.stringify(parsedICP));

    // Step 2: Build targeting criteria
    const targetingCriteria = buildTargetingCriteria(parsedICP);
    console.log('Targeting criteria:', JSON.stringify(targetingCriteria));

    // Step 3: Call LinkedIn Pricing API via linkedin-audience-builder proxy
    const pricingData = await getLinkedInPricing(targetingCriteria);
    console.log('Pricing data:', JSON.stringify(pricingData));

    // Step 4: Calculate budget recommendations by objective
    const budgets = calculateBudgets(pricingData.audienceCount, pricingData.pricing);

    // Step 5: Send results (async, don't block response)
    const resultPromises = [];

    // Send email via Resend
    resultPromises.push(sendResultsEmail(email, {
      icp: parsedICP.summary || icp,
      audienceCount: pricingData.audienceCount,
      pricing: pricingData.pricing,
      budgets
    }).catch(err => console.error('Email error:', err)));

    // Push to HubSpot with enhanced data
    resultPromises.push(pushToHubSpot(email, {
      icp: parsedICP.summary || icp,
      rawIcp: icp,
      audienceCount: pricingData.audienceCount,
      pricing: pricingData.pricing,
      budgets: budgets,
      targeting: {
        seniorities: parsedICP.seniorities,
        functions: parsedICP.jobFunctions,
        industries: parsedICP.industries,
        companySizes: parsedICP.companySizes
      }
    }).catch(err => console.error('HubSpot error:', err)));

    // Push to Resend Audience
    resultPromises.push(pushToResendAudience(email).catch(err => console.error('Resend Audience error:', err)));

    // Wait for all background tasks to complete
    await Promise.all(resultPromises);

    return new Response(JSON.stringify({
      success: true,
      icp: parsedICP.summary || icp,
      parsedTargeting: parsedICP,
      audienceCount: pricingData.audienceCount,
      pricing: pricingData.pricing,
      budgets,
      source: pricingData.source || 'LinkedIn Marketing API'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('LinkedIn budget calculator error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to calculate budget'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function parseICPWithClaude(icp) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = ICP_PARSE_PROMPT.replace('{icp}', icp);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text || '';

  // Parse JSON from response
  let jsonText = text.trim();
  const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  }
  if (!jsonText.startsWith('{')) {
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonText = jsonMatch[0];
  }

  return JSON.parse(jsonText);
}

function buildTargetingCriteria(parsedICP) {
  const criteria = {};

  // Add seniorities
  if (parsedICP.seniorities?.length > 0) {
    const urns = parsedICP.seniorities
      .map(s => SENIORITY_URNS[s])
      .filter(Boolean);
    if (urns.length > 0) {
      criteria['urn:li:adTargetingFacet:seniorities'] = urns;
    }
  }

  // Add company sizes
  if (parsedICP.companySizes?.length > 0) {
    const urns = parsedICP.companySizes
      .map(s => COMPANY_SIZE_URNS[s])
      .filter(Boolean);
    if (urns.length > 0) {
      criteria['urn:li:adTargetingFacet:staffCountRanges'] = urns;
    }
  }

  // Add job functions
  if (parsedICP.jobFunctions?.length > 0) {
    const urns = parsedICP.jobFunctions
      .map(f => JOB_FUNCTION_URNS[f])
      .filter(Boolean);
    if (urns.length > 0) {
      criteria['urn:li:adTargetingFacet:jobFunctions'] = urns;
    }
  }

  // Default to US location
  criteria['urn:li:adTargetingFacet:locations'] = ['urn:li:geo:103644278'];

  return criteria;
}

async function getLinkedInPricing(targetingCriteria) {
  // Call the public budget estimate endpoint on linkedin-audience-builder
  // This uses the service account token
  try {
    const response = await fetch('https://linkedin-audience-builder.vercel.app/api/public/budget-estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetingCriteria })
    });

    if (!response.ok) {
      console.error('LinkedIn pricing API error:', response.status);
      // Return fallback estimates
      return getFallbackPricing(targetingCriteria);
    }

    return await response.json();
  } catch (error) {
    console.error('LinkedIn pricing fetch error:', error);
    return getFallbackPricing(targetingCriteria);
  }
}

function getFallbackPricing(targetingCriteria) {
  // Estimate audience size based on criteria
  const hasSeniority = targetingCriteria['urn:li:adTargetingFacet:seniorities']?.length > 0;
  const hasCompanySize = targetingCriteria['urn:li:adTargetingFacet:staffCountRanges']?.length > 0;
  const hasFunction = targetingCriteria['urn:li:adTargetingFacet:jobFunctions']?.length > 0;

  // Base audience (US professionals)
  let audienceCount = 150000000;

  // Apply rough filters
  if (hasSeniority) {
    const seniorities = targetingCriteria['urn:li:adTargetingFacet:seniorities'];
    const seniorityMultiplier = seniorities.some(s => s.includes('6') || s.includes('5')) ? 0.02 : 0.1;
    audienceCount *= seniorityMultiplier;
  }

  if (hasCompanySize) {
    const sizes = targetingCriteria['urn:li:adTargetingFacet:staffCountRanges'];
    const isEnterprise = sizes.some(s => s.includes('1001') || s.includes('5001') || s.includes('10001'));
    audienceCount *= isEnterprise ? 0.15 : 0.5;
  }

  if (hasFunction) {
    audienceCount *= 0.1;
  }

  audienceCount = Math.max(10000, Math.round(audienceCount));

  // B2B benchmark pricing
  return {
    audienceCount,
    pricing: {
      awareness: { bidType: 'CPM', suggested: 55, min: 35, max: 80 },
      leadGen: { bidType: 'CPM', suggested: 65, min: 45, max: 95 },
      traffic: { bidType: 'CPC', suggested: 8, min: 5, max: 15 },
      video: { bidType: 'CPV', suggested: 0.12, min: 0.08, max: 0.20 }
    },
    source: 'Estimated (B2B Benchmarks)',
    note: 'Based on typical B2B LinkedIn advertising costs'
  };
}

function calculateBudgets(audienceCount, pricing) {
  if (!audienceCount) {
    return getDefaultBudgets();
  }

  // LinkedIn realistic benchmarks:
  // - Max monthly reach: ~40% of audience (based on 2024-2025 research)
  // - Frequency: 4-6 impressions per reached user per month
  // - B2B CTR: 0.4-0.6%
  // - Lead form conversion: 10-15% of clicks
  // - Video view rate: 25-35%

  const maxReachPercent = 0.40; // 40% max realistic reach
  const frequency = 5; // 5 impressions per person reached

  const cpm = pricing?.awareness?.suggested || 55;
  const cpc = pricing?.traffic?.suggested || 8;
  const cpv = pricing?.video?.suggested || 0.12;
  const leadGenCpm = pricing?.leadGen?.suggested || 65;

  // Calculate by objective
  const budgets = {
    // Awareness: How much to reach X% of audience with good frequency
    awareness: calculateAwarenessBudget(audienceCount, cpm, maxReachPercent, frequency),

    // Traffic: How much to get X clicks per month
    traffic: calculateTrafficBudget(audienceCount, cpc),

    // Lead Gen: How much to generate X leads per month
    leadGen: calculateLeadGenBudget(audienceCount, leadGenCpm),

    // Video: How much to get X video views
    video: calculateVideoBudget(audienceCount, cpv),
  };

  return budgets;
}

function calculateAwarenessBudget(audienceCount, cpm, maxReach, frequency) {
  // Budget tiers based on reach percentage
  const tiers = [
    { name: 'Test', reachPercent: 0.05, description: '5% reach' },
    { name: 'Growth', reachPercent: 0.15, description: '15% reach' },
    { name: 'Scale', reachPercent: maxReach, description: '40% reach (max)' },
  ];

  return tiers.map(tier => {
    const peopleReached = Math.round(audienceCount * tier.reachPercent);
    const impressions = peopleReached * frequency;
    const budget = Math.round((impressions * cpm) / 1000);
    return {
      tier: tier.name,
      budget: Math.max(1000, budget),
      peopleReached,
      impressions,
      description: tier.description,
    };
  });
}

function calculateTrafficBudget(audienceCount, cpc) {
  // B2B CTR: ~0.5% average
  const ctr = 0.005;

  // Calculate based on target clicks per month
  const tiers = [
    { name: 'Test', clicks: 100, description: '~100 clicks/mo' },
    { name: 'Growth', clicks: 500, description: '~500 clicks/mo' },
    { name: 'Scale', clicks: 1500, description: '~1,500 clicks/mo' },
  ];

  return tiers.map(tier => {
    const budget = Math.round(tier.clicks * cpc);
    const impressionsNeeded = Math.round(tier.clicks / ctr);
    return {
      tier: tier.name,
      budget: Math.max(500, budget),
      clicks: tier.clicks,
      impressions: impressionsNeeded,
      description: tier.description,
    };
  });
}

function calculateLeadGenBudget(audienceCount, cpm) {
  // Lead Gen ads: ~0.5% CTR, ~12% form fill rate = ~0.06% lead rate
  const leadRate = 0.0006; // 0.06% of impressions become leads

  const tiers = [
    { name: 'Test', leads: 10, description: '~10 leads/mo' },
    { name: 'Growth', leads: 30, description: '~30 leads/mo' },
    { name: 'Scale', leads: 75, description: '~75 leads/mo' },
  ];

  return tiers.map(tier => {
    const impressionsNeeded = Math.round(tier.leads / leadRate);
    const budget = Math.round((impressionsNeeded * cpm) / 1000);
    return {
      tier: tier.name,
      budget: Math.max(1500, budget),
      leads: tier.leads,
      impressions: impressionsNeeded,
      description: tier.description,
    };
  });
}

function calculateVideoBudget(audienceCount, cpv) {
  // Video view rate: ~30%
  const viewRate = 0.30;

  const tiers = [
    { name: 'Test', views: 5000, description: '~5K views/mo' },
    { name: 'Growth', views: 15000, description: '~15K views/mo' },
    { name: 'Scale', views: 50000, description: '~50K views/mo' },
  ];

  return tiers.map(tier => {
    const budget = Math.round(tier.views * cpv);
    const impressionsNeeded = Math.round(tier.views / viewRate);
    return {
      tier: tier.name,
      budget: Math.max(500, budget),
      views: tier.views,
      impressions: impressionsNeeded,
      description: tier.description,
    };
  });
}

function getDefaultBudgets() {
  return {
    awareness: [
      { tier: 'Test', budget: 2500, description: '5% reach' },
      { tier: 'Growth', budget: 7500, description: '15% reach' },
      { tier: 'Scale', budget: 17000, description: '40% reach (max)' },
    ],
    traffic: [
      { tier: 'Test', budget: 800, clicks: 100, description: '~100 clicks/mo' },
      { tier: 'Growth', budget: 4000, clicks: 500, description: '~500 clicks/mo' },
      { tier: 'Scale', budget: 12000, clicks: 1500, description: '~1,500 clicks/mo' },
    ],
    leadGen: [
      { tier: 'Test', budget: 3000, leads: 10, description: '~10 leads/mo' },
      { tier: 'Growth', budget: 9000, leads: 30, description: '~30 leads/mo' },
      { tier: 'Scale', budget: 22500, leads: 75, description: '~75 leads/mo' },
    ],
    video: [
      { tier: 'Test', budget: 600, views: 5000, description: '~5K views/mo' },
      { tier: 'Growth', budget: 1800, views: 15000, description: '~15K views/mo' },
      { tier: 'Scale', budget: 6000, views: 50000, description: '~50K views/mo' },
    ],
  };
}

async function sendResultsEmail(email, result) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return { success: false, reason: 'not_configured' };

  const { icp, audienceCount, pricing, budgets } = result;

  // Get recommended budgets (Growth tier from each objective)
  const awarenessGrowth = budgets?.awareness?.[1] || { budget: 7500 };
  const trafficGrowth = budgets?.traffic?.[1] || { budget: 4000, clicks: 500 };
  const leadGenGrowth = budgets?.leadGen?.[1] || { budget: 9000, leads: 30 };

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:white;border:2px solid #1a1a1a;border-radius:16px;overflow:hidden;">
  <div style="background:#0A66C2;padding:24px;border-bottom:2px solid #1a1a1a;">
    <table width="100%"><tr>
      <td><div style="width:40px;height:40px;background:white;border:2px solid #1a1a1a;border-radius:8px;text-align:center;line-height:36px;font-weight:bold;">42</div></td>
      <td style="text-align:right;"><span style="color:white;font-weight:bold;">LinkedIn Budget Estimate</span></td>
    </tr></table>
  </div>
  <div style="padding:32px;">
    <p style="color:#4a4a4a;margin:0 0 24px 0;">Here are your LinkedIn Ads budget estimates:</p>

    <div style="text-align:center;margin:24px 0;padding:24px;background:#f5f5f5;border-radius:12px;">
      <div style="font-size:48px;font-weight:800;color:#0A66C2;">${formatNumber(audienceCount)}</div>
      <div style="color:#6b6b6b;font-size:14px;">people in your audience</div>
      <div style="margin-top:12px;font-weight:600;color:#1a1a1a;">${icp}</div>
    </div>

    <h3 style="color:#1a1a1a;margin:24px 0 16px 0;font-size:16px;">Pricing Estimates</h3>
    <table width="100%" style="border-collapse:collapse;">
      <tr><td style="padding:12px;background:#f5f5f5;border-radius:8px;">Awareness (CPM)</td><td style="padding:12px;text-align:right;font-weight:bold;">$${(pricing?.awareness?.suggested || 0).toFixed(2)}</td></tr>
      <tr><td style="padding:12px;">Lead Gen (CPM)</td><td style="padding:12px;text-align:right;font-weight:bold;">$${(pricing?.leadGen?.suggested || 0).toFixed(2)}</td></tr>
      <tr><td style="padding:12px;background:#f5f5f5;border-radius:8px;">Traffic (CPC)</td><td style="padding:12px;text-align:right;font-weight:bold;">$${(pricing?.traffic?.suggested || 0).toFixed(2)}</td></tr>
      <tr><td style="padding:12px;">Video (CPV)</td><td style="padding:12px;text-align:right;font-weight:bold;">$${(pricing?.video?.suggested || 0).toFixed(4)}</td></tr>
    </table>

    <h3 style="color:#1a1a1a;margin:24px 0 16px 0;font-size:16px;">Recommended Monthly Budgets by Objective</h3>
    <p style="color:#6b6b6b;font-size:13px;margin:0 0 16px 0;">LinkedIn max reach is ~40% of audience per month. Based on B2B benchmarks.</p>
    <table width="100%" style="border-collapse:collapse;">
      <tr><td style="padding:12px;background:#f5f5f5;border-radius:8px;"><strong>Awareness</strong><br><span style="font-size:12px;color:#6b6b6b;">15% reach, 5x frequency</span></td><td style="padding:12px;background:#f5f5f5;border-radius:8px;text-align:right;font-weight:bold;font-size:18px;">$${awarenessGrowth.budget.toLocaleString()}</td></tr>
      <tr><td style="padding:12px;"><strong>Website Traffic</strong><br><span style="font-size:12px;color:#6b6b6b;">~${trafficGrowth.clicks} clicks/mo</span></td><td style="padding:12px;text-align:right;font-weight:bold;font-size:18px;">$${trafficGrowth.budget.toLocaleString()}</td></tr>
      <tr><td style="padding:12px;background:#f5f5f5;border-radius:8px;"><strong>Lead Generation</strong><br><span style="font-size:12px;color:#6b6b6b;">~${leadGenGrowth.leads} leads/mo</span></td><td style="padding:12px;background:#f5f5f5;border-radius:8px;text-align:right;font-weight:bold;font-size:18px;">$${leadGenGrowth.budget.toLocaleString()}</td></tr>
    </table>

    <div style="background:#DFFE68;border:2px solid #1a1a1a;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
      <h3 style="color:#1a1a1a;margin:0 0 8px 0;">Build This Audience in Marvin</h3>
      <p style="color:#4a4a4a;margin:0 0 16px 0;font-size:14px;">Use our AI-powered LinkedIn Ads Copilot to build targeting and push directly to your ad account.</p>
      <a href="https://copilot.42agency.com?utm_source=linkedin_budget_email&utm_medium=intel" style="display:inline-block;background:#1a1a1a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Open Marvin</a>
    </div>

    <p style="color:#6b6b6b;font-size:14px;margin:24px 0 0 0;">Run another estimate anytime at:<br><a href="https://intel.42agency.com/tools/linkedin-budget-calculator" style="color:#0A66C2;">intel.42agency.com/tools/linkedin-budget-calculator</a></p>
  </div>
  <div style="background:#1a1a1a;padding:16px 24px;text-align:center;">
    <p style="color:#9a9a9a;margin:0;font-size:12px;">Built by <a href="https://42agency.com" style="color:#DFFE68;">42 Agency</a> — B2B Demand Gen & Marketing Ops</p>
  </div>
</div></body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: '42 Agency <noreply@42agency.com>',
        to: email,
        subject: `Your LinkedIn Budget Estimate: ${formatNumber(audienceCount)} audience`,
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

    // HubSpot payload - using simple property names
    // Note: Custom properties must exist in HubSpot first
    const properties = {
      email,
      lifecyclestage: 'lead',
    };

    // Try to add custom properties (will be ignored if they don't exist)
    const customProps = {
      linkedin_budget_icp: (result.rawIcp || result.icp || '').substring(0, 500),
      linkedin_budget_audience: result.audienceCount?.toString() || '',
      linkedin_budget_cpm: result.pricing?.awareness?.suggested?.toFixed(2) || '',
      linkedin_budget_date: new Date().toISOString().split('T')[0],
    };

    // Merge custom props
    Object.assign(properties, customProps);

    let response;
    if (existingContactId) {
      console.log('Updating existing HubSpot contact:', existingContactId);
      response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingContactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    } else {
      console.log('Creating new HubSpot contact for:', email);
      response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('HubSpot API error response:', JSON.stringify(errorData));
      return { success: false, error: errorData };
    }

    console.log('HubSpot contact saved successfully');
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

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return Math.round(num / 1000) + 'K';
  return num?.toLocaleString() || '0';
}
