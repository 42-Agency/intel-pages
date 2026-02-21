export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(`https://api.mails.so/v1/validate?email=${encodeURIComponent(email)}`, {
      headers: {
        'x-mails-api-key': '774d5d47-342e-46e9-acc2-5dff192e00ac',
      },
    });

    const json = await response.json();
    const data = json.data || json;

    // Determine if email is valid
    // Block ONLY: bad format (invalid) or disposable emails
    // Allow: deliverable, undeliverable (SMTP checks often fail on corporate domains), catch_all, unknown
    const isDisposable = data.is_disposable === true;
    const isBadFormat = data.result === 'invalid' || data.isv_format === false;
    const isValid = !isBadFormat && !isDisposable;
    const isRisky = data.result === 'catch_all' || data.result === 'unknown' || data.result === 'undeliverable';

    return new Response(JSON.stringify({
      valid: isValid,
      risky: isRisky,
      result: data.result,
      reason: isDisposable ? 'disposable' : data.result,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    // Fail open - if API fails, allow submission
    return new Response(JSON.stringify({ valid: true, risky: true, result: 'api_error' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
