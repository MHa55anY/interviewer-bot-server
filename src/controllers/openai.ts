import OpenAI from "openai";
import fs from 'fs';
import path from "path";
import isFileEmpty from "../helper/isFileEmpty";
import dotenv from 'dotenv';
import { Uploadable } from "openai/uploads";

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});

//Speech to text
export async function transcribeSpeechAndPushToHistory() {
  try {
      const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream("./test.mp3"),
          model: "whisper-1",
        });
      
      console.log(transcription.text);
      pushToChatHistory({
          role: 'user',
          content: transcription.text
      });
  } catch (error) {
      console.log(error);
  }
};

//Text to Speech
export async function textToSpeech(text: string) {
  try {
    const wav = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",
      input: text,
      response_format: "wav"
    });
    return Buffer.from(await wav.arrayBuffer());
  } catch (error) {
    console.log(error);
  }
}

//send response to chatgpt
const databasePath = path.join(__dirname, '../../database.json');
const isDbEmpty = isFileEmpty(databasePath);
const getChatHistory = () => {
    const messages:OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    let jsonData;
    if (!isDbEmpty) {
      try {
        const data = fs.readFileSync(databasePath, 'utf-8');
        jsonData = JSON.parse(data);
      } catch (error) {
        console.log(error);
      }
      messages.push(...jsonData);
    }
    else {
      messages.push({
        "role": "system", "content": "Act as an interviewer for a Full Stack Developer position. Ask short questions that are relevant to a senior level developer. Your name is John. The user is Hassan. Start with an intro to yourself. Keep your responses under 30 words and be funny sometimes."
      })
    }
    return messages;
  };

const pushToChatHistory = (message: OpenAI.Chat.Completions.ChatCompletionMessageParam) => {
    const messages = getChatHistory();
    try {
        fs.writeFileSync(databasePath, Buffer.from(JSON.stringify([...messages, message])), 'utf-8');
        console.log("File written successfully");     
    } catch (error) {
        console.log(error);
    }
};

// Open ai chatbot
export async function talkToGpt() {
    try {
        const completion = await openai.chat.completions.create({
            messages: getChatHistory(),
            model: "gpt-3.5-turbo",
            });
            console.log(completion.choices);
            pushToChatHistory(completion.choices[0].message);
            return completion.choices[0].message.content;
    } catch (error) {
        console.log(error)
    }
}

export default openai;