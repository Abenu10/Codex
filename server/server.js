import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
// import {Configuration, OpenAIApi} from 'openai';
import OpenAI from 'openai';
// const redis = require('./redis');

dotenv.config();
const port = 5000;
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
  apiKey: process.env.apiKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

const app = express();
app.use(cors());
app.use(express.json());
const conversations = {}; 

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!',
  });
});

app.post('/', async (req, res) => {
  try {
       const { prompt, sessionId } = req.body;

if (!conversations[sessionId]) {
      conversations[sessionId] = [];
    }

    conversations[sessionId].push({ role: 'user', content: prompt })
    
    const completion = await openai.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: conversations[sessionId],
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    let response = '';
    for await (const chunk of completion) {
      response += chunk.choices[0]?.delta?.content || '';
    }

    conversations[sessionId].push({ role: 'assistant', content: response });

    console.log('Response:', response); // Log the response

    res.status(200).json({
      bot: response,
    });
    // res.status(200).send({
    //   bot: response.data.choices[0].text,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(port, () => console.log(`AI server started on ${port}`));
