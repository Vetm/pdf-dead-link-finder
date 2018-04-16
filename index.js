const fs = require('fs');
const PDFParser = require("pdf2json");
const getUrls = require('get-urls');
const fetch = require('node-fetch');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const links = getUrls(pdfParser.getRawTextContent().replace(/-\r?\n|\r?\n|\r/g, ''));
    for (const link of links) {
        fetch(link)
            .then(res => {
                if (res.status !== 200) {
                    console.log(res.status, link);
                }
            })
            .catch(err => {
                console.log('error', link)
            })

    }
});

pdfParser.loadPDF("./pdf/file.pdf");
