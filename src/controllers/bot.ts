import puppeteer, { ElementHandle } from "puppeteer";
import { startRecording, stopRecording } from "./100ms";

//EDIT template according to client code
const startBot = async (roomId:string, roomCodeForHost:string) => {
    const browser = await puppeteer.launch({
      headless:true,
      args: ['--use-fake-ui-for-media-stream'], // Use fake UI for media stream
    });
    const page = await browser.newPage();
    await page.goto(`http://localhost:3001?roomcode=${roomCodeForHost}&role=host`);

    // Wait for the iframe to be loaded - For removing the error screen in dev mode
    const iframe = await page.waitForSelector('iframe#webpack-dev-server-client-overlay') as ElementHandle<HTMLIFrameElement>;
    const frame = await iframe.contentFrame();

    const button = await frame.waitForSelector('button');
    await button?.click();

    await startRecording(roomId);
    setTimeout(() => stopRecording(roomId), 120000);
};

export default startBot;