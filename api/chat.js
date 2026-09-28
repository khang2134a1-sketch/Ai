const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  const apiKey = process.env.CODECRAFT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chưa cấu hình CODECRAFT_API_KEY trên Vercel.' });
  }

  try {
    const response = await fetch("https://codecraftapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "claude-fable-5.1",
        temperature: 1,
        max_tokens: 8192,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Không có phản hồi.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
