const fs = require('fs');
const PDFParser = require("pdf2json");
const getUrls = require('get-urls');
const fetch = require('node-fetch');
const table = require('asciitable');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const links = getUrls(pdfParser.getRawTextContent().replace(/-\r?\n|\r?\n|\r/g, ''));
    const errors = [];
    const promises = [];
    links.forEach((link) => {
       promises.push(fetch(link, {disableRedirects: true}).catch(err => {errors.push({url: link, status: 0})}));
    });
    Promise.all(promises)
        .then(responses => {
            for (const res of responses) {
                if (res && res.status !== 200) {
                    errors.push({url: res.url, status: res.status})
                }
            }
            console.log(table(errors));
        })
        .catch((err) => {
            console.log(err);
        })
});

pdfParser.loadPDF("./pdf/file.pdf");
