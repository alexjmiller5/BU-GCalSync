const fs = require('fs');

const template = fs.readFileSync('manifest.template.json', 'utf8');
const manifest = template.replace('CLIENT_ID_PLACEHOLDER', process.env.CLIENT_ID);

fs.writeFileSync('manifest.json', manifest);