const puppeteer = require("puppeteer")
const fs = require('fs')
const path = require('path')

const compile = async (templateName, data) => {
	const filePath = path.join(__dirname, "templates", `${templateName}.hbs`);
	if (!filePath) {
		throw new Error(`Could not find ${templateName}.hbs in generatePDF`);
	}
	const html = await fs.readFile(filePath, "utf-8");
	return hbs.compile(html)(data);
};


let browser; 
const generatePDF = async () => {
	try {
		if (!browser) {
			browser = await puppeteer.launch({
				args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage"
				],
				headless: true,
			})
		}
        const context = await browser.createIncognitoBrowserContext()
		const page = await context.newPage()

        const assetFilePath = path.join(__dirname, "../test.html")

        await page.goto(`file://${assetFilePath}`, {
            waitUntil: "networkidle0"
        })

        // const html = await page.evaluate(() => {
        //     return document.documentElement.innerHTML;
        //   });
          
        // console.log(html);
 
		// await page.goto(`data: text/html, ${content}`, { 
		// 	waitUntil: "networkidle0" 
		// });
		// await page.setContent(content);
		// await page.emulateMedia("screen");

        const exportFilePath = 'exports/test.pdf'

        if (fs.existsSync(exportFilePath)) {
            fs.unlinkSync(exportFilePath)
        }

        const pdf = await page.pdf({
            width: 620,
            height: 620,
			// format: "A4",
			// printBackground: true,
            path: exportFilePath
		})
 
		await context.close()
		return pdf
	} catch (err) {
		console.log('error generating pdf: ', err)
    }
}

module.exports = {
    generatePDF
}