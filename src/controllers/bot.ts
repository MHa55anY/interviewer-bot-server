import puppeteer from "puppeteer";

const startBot = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    // Perform further actions...
    // Fill out the form fields
    await page.type('#userName', 'Bot'); // Replace 'Your Name' with the desired value for the userName field
    await page.type('#roomCode', 'rqv-crdr-lrl');
    
    await page.click('button.btn-primary');
};

export default startBot;