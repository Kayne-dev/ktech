// /api/submit.js — Vercel Serverless Function
// Proxies contact form submissions to Notion CRM.
// Set these in Vercel → Settings → Environment Variables:
//   NOTION_API_KEY      = your integration token (secret_...)
//   NOTION_DATABASE_ID  = your database ID (32-char hex)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, service, plan, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !service || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const NOTION_API_KEY     = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.error('Missing Notion env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Notion select fields reject commas and special characters.
  // Strip everything — just keep the first word (Basic / Professional / Business)
  const cleanPlan = (plan || 'Not specified')
    .replace(/[₦,()\/]/g, '')   // remove ₦ , ( ) /
    .trim()
    .split(' ')[0]               // take only the first word
    || 'Not specified';

  // Same safety net for service just in case
  const cleanService = (service || 'Other').replace(/,/g, ' ');

  try {
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          'Name': {
            title: [{ text: { content: `${firstName} ${lastName}` } }]
          },
          'Email': {
            email: email
          },
          'Phone': {
            phone_number: phone
          },
          'Service': {
            select: { name: cleanService }
          },
          'Plan': {
            select: { name: cleanPlan }
          },
          'Status': {
            select: { name: 'New' }
          },
          'Message': {
            rich_text: [{ text: { content: message } }]
          }
        }
      })
    });

    if (!notionRes.ok) {
      const errBody = await notionRes.text();
      console.error('Notion API error:', errBody);
      return res.status(500).json({ error: 'Failed to save to Notion' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};