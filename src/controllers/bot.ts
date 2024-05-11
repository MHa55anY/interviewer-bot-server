import puppeteer, { ElementHandle } from "puppeteer";

//EDIT template according to client code
const startBot = async () => {
    const browser = await puppeteer.launch({
        args: ['--use-fake-ui-for-media-stream'], // Use fake UI for media stream
    });
    const page = await browser.newPage();
    await page.goto(`http://localhost:3001?roomcode=rqv-crdr-lrl`);

      // Wait for the iframe to be loaded - For removing the error screen in dev mode
    const iframe = await page.waitForSelector('iframe#webpack-dev-server-client-overlay') as ElementHandle<HTMLIFrameElement>;
    const frame = await iframe.contentFrame();

    const button = await frame.waitForSelector('button');
    await button?.click();

    await page.waitForSelector('#name');
    await page.type('#name', 'Bot');
    // await page.type('#roomCode', 'rqv-crdr-lrl');

    await page.waitForSelector('#submit');
    await page.click('#submit');
};

export default startBot;