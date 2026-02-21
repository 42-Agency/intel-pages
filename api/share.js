// Dynamic Share Page with OG Meta Tags
// URL: /api/share?d=[base64-encoded-data]&t=[tool-type]

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const encodedData = url.searchParams.get('d');
  const toolType = url.searchParams.get('t') || 'calculator'; // 'calculator' or 'hubspot'

  if (!encodedData) {
    return new Response('Missing data parameter', { status: 400 });
  }

  let data;
  try {
    data = JSON.parse(atob(encodedData));
  } catch (e) {
    return new Response('Invalid data', { status: 400 });
  }

  // Use static branded OG image (dynamic image generation requires Next.js framework)
  // The title and description are dynamic with the actual score
  const ogImageUrl = `https://intel.42agency.com/og-share.png`;

  // Tool-specific content
  const toolConfig = {
    calculator: {
      title: `B2B Benchmark Score: ${data.score}/100`,
      description: `${data.industry} - See how your paid media performance compares to 87 B2B campaigns.`,
      url: 'https://intel.42agency.com/assess/calculator/',
      ctaText: 'Take the B2B Benchmark Calculator'
    },
    hubspot: {
      title: `HubSpot CRM Health: ${data.percentage}% (Grade ${data.grade})`,
      description: `42-point diagnostic assessment. ${data.criticalIssues || 0} critical issues found.`,
      url: 'https://intel.42agency.com/assessments/hubspot-health/',
      ctaText: 'Take the HubSpot Health Assessment'
    }
  };

  const config = toolConfig[toolType] || toolConfig.calculator;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title} | 42 Agency</title>

    <!-- Open Graph / LinkedIn -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${request.url}">
    <meta property="og:title" content="${config.title}">
    <meta property="og:description" content="${config.description}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${config.title}">
    <meta name="twitter:description" content="${config.description}">
    <meta name="twitter:image" content="${ogImageUrl}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .card {
            background: white;
            border: 2px solid #1a1a1a;
            border-radius: 20px;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 6px 6px 0px 0px #1a1a1a;
        }
        .logo {
            width: 48px;
            height: 48px;
            background: #DFFE68;
            border: 2px solid #1a1a1a;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 18px;
            margin-bottom: 1.5rem;
        }
        .score {
            font-size: 4rem;
            font-weight: 800;
            color: ${data.score >= 70 || data.percentage >= 70 ? '#10B981' : data.score >= 40 || data.percentage >= 40 ? '#F59E0B' : '#EF4444'};
            line-height: 1;
        }
        .score-label {
            color: #666;
            margin-top: 0.5rem;
            font-size: 1.1rem;
        }
        .industry {
            margin-top: 1rem;
            font-weight: 600;
            color: #1a1a1a;
        }
        .cta {
            display: inline-block;
            margin-top: 2rem;
            padding: 1rem 2rem;
            background: #DFFE68;
            border: 2px solid #1a1a1a;
            border-radius: 12px;
            color: #1a1a1a;
            text-decoration: none;
            font-weight: 700;
            box-shadow: 4px 4px 0px 0px #1a1a1a;
            transition: all 0.15s;
        }
        .cta:hover {
            box-shadow: 6px 6px 0px 0px #1a1a1a;
            transform: translate(-2px, -2px);
        }
        .footer {
            margin-top: 2rem;
            font-size: 0.85rem;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">42</div>
        <div class="score">${toolType === 'hubspot' ? data.percentage + '%' : data.score}</div>
        <div class="score-label">${toolType === 'hubspot' ? 'Grade ' + data.grade : 'out of 100'}</div>
        <div class="industry">${data.industry || ''}</div>
        <a href="${config.url}" class="cta">${config.ctaText}</a>
        <div class="footer">Powered by 42 Agency</div>
    </div>

    <script>
        // Auto-redirect to the assessment after a short delay
        // This helps people who land here directly take the assessment
    </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
