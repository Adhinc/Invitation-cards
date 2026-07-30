const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace('<head>', '<head><script>window.addEventListener("error", e => { document.body.innerHTML += `<div style="color:red; font-size:24px; z-index:9999; position:fixed; top:0; background:white;">${e.error ? e.error.stack : e.message}</div>`; });</script>');
fs.writeFileSync('index.html', content);
