// Cloudflare Worker for axinbox waitlist
// Deploy: wrangler deploy

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders()
    })
  }

  // Only accept POST requests
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const body = await request.json()
    const email = body.email

    // Validate email
    if (!email || !isValidEmail(email)) {
      return jsonResponse({ error: 'Valid email required' }, 400)
    }

    // Send notification email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'waitlist@axinbox.com',
        to: 'resend@axinbox.com',
        subject: `New Waitlist Signup: ${email}`,
        html: `
          <h2>New Waitlist Signup</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        `
      })
    })

    if (!resendResponse.ok) {
      const error = await resendResponse.text()
      console.error('Resend error:', error)
      return jsonResponse({ error: 'Failed to subscribe' }, 500)
    }

    return jsonResponse({ success: true, message: 'Added to waitlist!' }, 200)

  } catch (error) {
    console.error('Error:', error)
    return jsonResponse({ error: 'Internal server error' }, 500)
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  })
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://axinbox.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}
