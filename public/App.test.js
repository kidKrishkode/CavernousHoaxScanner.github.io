const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const { exec } = require('child_process');

const files_structure = [
    'server.js',
    'views/',
    'public/',
    'images/',
    'config/',
    'assets/',
    'model/',
    'package.json'
];

const node_module_path = path.join(__dirname,'node_modules').replace('\\public','');

const py_packages = [
    'opencv-python',
    'numpy',
    'svgwrite',
    'fpdf'
];

Object.keys(pkg.dependencies).forEach((dependency) => {
    if(!fs.existsSync(`${node_module_path}/${dependency}/`)){
        console.error(`\n>> \x1b[31m${dependency}\x1b[0m is not installed! Run \x1b[36mnpm install\x1b[0m to fix the problem...\n`);
    }
});

files_structure.forEach((file) => {
    if(!fs.existsSync(file)){
        console.error(`\n>> \x1b[31m${file}\x1b[0m does not exist! use \x1b[36mKrish\x1b[0m's git to fix the problem...\n`);
    }
});

exec('pip freeze', (err, stdout) => {
    const installed_package = stdout.split('\n').map((line) => line.split('==')[0]);
    py_packages.forEach((package) => {
        if(!installed_package.includes(package)){
            console.error(`\n>> \x1b[31m${package}\x1b[0m is not installed! Run \x1b[36mpip install\x1b[0m to fix the problem...\n`);
        } 
    });
});