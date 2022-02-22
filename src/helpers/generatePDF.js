const puppeteer = require("puppeteer")
const fs = require('fs')
const path = require('path')

const tempHTMLFilePath = "../temp/temp.html"

const writeTempHTML = () => {

    const data = {
        "planets":{"Lilith":[18], "Chiron":[18], "Pluto":[63], "Neptune":[110, 0.2], "Uranus":[318], "Saturn":[201, -0.2], "Jupiter":[192], "Mars":[210], "Moon":[268], "Sun":[281], "Mercury":[312], "Venus":[330], "NNode":[2]},
        "cusps":[296, 350, 30, 56, 75, 94, 116, 170, 210, 236, 255, 274]			
    }

    const dataAsString = JSON.stringify(data)

    const content = `
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>Radix</title>  
                <style>
                    #paper{
                        background:#999;
                    }
                </style>                   
            </head>
            <body>    	    
                <div id="paper"></div>

                <script src="../helpers/astrochart.min.js"></script>
                <script type="text/javascript"> 
                
                    var data = ${dataAsString}
                                                              
                    window.onload = function () {            	     
                        var radix = new astrology.Chart('paper', 600, 600).radix( data );
                                        
                        // Aspect calculation
                        // default is planet to planet, but it is possible add some important points:				
                        radix.addPointsOfInterest( {"As":[data.cusps[0]],"Ic":[data.cusps[3]],"Ds":[data.cusps[6]],"Mc":[data.cusps[9]]});				
                        radix.aspects();																								
                    };
                </script>		    
            </body>
        </html>
        `
    const newFilePath = path.join(__dirname, tempHTMLFilePath)

    try {
        fs.writeFileSync(newFilePath, content)
        //file written successfully
    } catch (err) {
        console.error(err)
    }
}

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

        // Write the html file to render
        writeTempHTML()

        const context = await browser.createIncognitoBrowserContext()
		const page = await context.newPage()

        const assetFilePath = path.join(__dirname, tempHTMLFilePath)

        // Go to the page that was written above
        await page.goto(`file://${assetFilePath}`, {
            waitUntil: "networkidle0"
        })

        const exportFilePath = path.join(__dirname, '../temp/temp.pdf')

        if (fs.existsSync(exportFilePath)) {
            fs.unlinkSync(exportFilePath)
        }

        // Export pdf to temp directory
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