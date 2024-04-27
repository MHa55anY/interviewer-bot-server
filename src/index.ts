import express from 'express';
import fs from "fs";
import OpenAI from "openai";
import path from 'path';
import startWebSocketServer from './wsController';
import cors from 'cors';

const app = express();
app.use(cors());

app.get("/", (req,res) => {
  res.send("hello world");
})

app.post("/talk", (req,res) => {
  res.send("hello world");
});
startWebSocketServer();
app.listen('8000', () => console.log("Server started"));

// const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});
// const speechFile = path.resolve("./speech.mp3");




// //text to speech
// async function main() {
//   const mp3 = await openai.audio.speech.create({
//     model: "tts-1",
//     voice: "echo",
//     input: "Today is a wonderful day to build something people love!",
//   });
//   console.log(speechFile);
//   const buffer = Buffer.from(await mp3.arrayBuffer());
//   await fs.promises.writeFile(speechFile, buffer);
// }
// main();

//Speech to text

// async function main() {
//   const transcription = await openai.audio.transcriptions.create({
//     file: fs.createReadStream("./speech.mp3"),
//     model: "whisper-1",
//   });

//   console.log(transcription.text);
// }
// main();

const isFileEmpty = (filePath: string) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size === 0;
  } catch (err) {
    console.error('Error checking file:', err);
    return false;
  }
};

const databasePath = path.join(__dirname, '../database.json');
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
      "role": "user", "content": "You are interviewing the user for a Full Stack Developer position. Ask short questions that are relevant to a senior level developer. Your name is John. The user is Hassan. Keep responses under 30 words and be funny sometimes."
    })
  }
  console.log(messages);
  return messages;
};

const pushToChatHistory = (message: OpenAI.Chat.Completions.ChatCompletionMessageParam) => {
  const messages = getChatHistory();
  fs.writeFile(databasePath, Buffer.from(JSON.stringify([...messages, message])), 'utf-8',(err) => {
    if(err) {
      console.log(err);
      fs.close;
    }
    console.log("File written successfully");
  });
}
// Open ai chatbot
// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{"role": "system", "content": "You are a helpful assistant."},
//         {"role": "user", "content": "Who won the world series in 2020?"},
//         {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
//         {"role": "user", "content": "Where was it played?"}],
//     model: "gpt-3.5-turbo",
//   });

//   console.log(completion.choices[0]);completion.choices[0]
// }
// main();

