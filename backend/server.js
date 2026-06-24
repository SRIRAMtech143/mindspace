const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are MindSpace AI, a supportive and empathetic mental wellness companion for students and young adults.

Your role:
- Listen with empathy and validate feelings without judgment
- Offer gentle, practical coping suggestions (breathing exercises, grounding techniques, journaling prompts)
- Encourage professional help when appropriate, especially for serious concerns
- Keep responses warm, concise (2-4 sentences), and conversational — not clinical or robotic
- Never diagnose any mental health condition
- If someone expresses thoughts of self-harm or suicide, gently but clearly encourage them to contact a crisis helpline immediately (iCall: 9152987821 in India) and to reach out to someone they trust, while staying supportive and non-judgmental

You are not a replacement for therapy or professional care — you are a supportive first step and a safe space to talk.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert message history into Gemini's format
    // Skip the very first message if it's from the assistant (the initial greeting)
    let conversationMessages = messages.slice(0, -1);
    if (conversationMessages.length > 0 && conversationMessages[0].role === 'assistant') {
      conversationMessages = conversationMessages.slice(1);
    }

    const history = conversationMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    
    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Something went wrong talking to the AI.' });
  }
});

app.get('/', (req, res) => {
  res.send('MindSpace backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});