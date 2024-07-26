const fs = require('fs');

const files_structure = [
    'server.js',
    'views/',
    'public/',
    'images/',
    'package.json'
];

files_structure.forEach((file) => {
    if(!fs.existsSync(file)){
        console.error(`\n>> \x1b[31m${file}\x1b[0m does not exist! use \x1b[36mKrish\x1b[0m's git to fix the problem...\n`);
    }
});