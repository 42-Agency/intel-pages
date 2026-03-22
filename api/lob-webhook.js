// Lob Webhook Handler - Postcard Delivery Notifications
// Receives events from Lob and posts to Slack

export const config = { runtime: 'edge' };

const LOB_EVENTS = {
    "postcard.mailed": { emoji: "📬", message: "Postcard mailed" },
    "postcard.in_transit": { emoji: "🚚", message: "Postcard in transit" },
    "postcard.in_local_area": { emoji: "📍", message: "Postcard in local area" },
    "postcard.delivered": { emoji: "✅", message: "Postcard delivered" },
    "postcard.re-routed": { emoji: "🔄", message: "Postcard re-routed" },
    "postcard.returned_to_sender": { emoji: "⚠️", message: "Postcard returned" },
};

export default async function handler(request) {
    // Handle GET for health check
    if (request.method === 'GET') {
        return Response.json({ status: 'ok', service: 'lob-webhook' });
    }

    try {
        const data = await request.json();

        if (!data) {
            return Response.json({ status: 'ignored', reason: 'empty payload' });
        }

        const eventType = data.event_type?.id || '';
        console.log(`Lob webhook received: ${eventType}`);

        if (!LOB_EVENTS[eventType]) {
            return Response.json({ status: 'ignored', reason: 'untracked event' });
        }

        // Extract postcard details
        const body = data.body || {};
        const postcardId = body.id || 'unknown';
        const description = body.description || '';
        const toAddress = body.to || {};
        const recipientName = toAddress.name || 'Unknown';
        const recipientCompany = toAddress.company || '';
        const recipientCity = toAddress.address_city || '';
        const recipientState = toAddress.address_state || '';
        const expectedDelivery = body.expected_delivery_date || '';

        const eventInfo = LOB_EVENTS[eventType];

        // Build Slack message
        const slackMessage = {
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `${eventInfo.emoji} ${eventInfo.message}`,
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        { type: "mrkdwn", text: `*Recipient:*\n${recipientName}` },
                        { type: "mrkdwn", text: `*Company:*\n${recipientCompany || 'N/A'}` },
                        { type: "mrkdwn", text: `*Location:*\n${recipientCity}, ${recipientState}` },
                        { type: "mrkdwn", text: `*Expected:*\n${expectedDelivery || 'N/A'}` }
                    ]
                },
                {
                    type: "context",
                    elements: [
                        { type: "mrkdwn", text: `Campaign: ${description} | ID: \`${postcardId}\`` }
                    ]
                }
            ]
        };

        // Send to Slack
        const slackWebhook = process.env.SLACK_WEBHOOK_URL;
        if (slackWebhook) {
            await fetch(slackWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slackMessage)
            });
        }

        return Response.json({ status: 'ok', event: eventType });

    } catch (error) {
        console.error('Lob webhook error:', error);
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
