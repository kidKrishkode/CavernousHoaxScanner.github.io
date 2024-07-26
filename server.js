const express = require('express');
const http = require('http');
const path = require('path');
const jimp = require('jimp');
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
const querystring = require('querystring');
const ejs = require('ejs');
const jsonfile = require('jsonfile');
require('./public/App.test.js');
require('dotenv').config();

const app = express();
let server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const AppName = "Cavernous Hoax Scanner";
let web = new WEB(PORT);
let imagePath,width,height;
const pixelData = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/public',express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    ejs.renderFile('./views/header.ejs').then(header => {
        res.status(200).render('index',{header});
    });
});

app.get('/imageInfo', async (req, res) => {
    try{
        imagePath = path.join(__dirname, 'public', './images/image1.jpg');
        const image = await jimp.read(imagePath);
        width = image.bitmap.width;
        height = image.bitmap.height;
        await callPythonProcess(imagePath, height, width, 'resizer').then(result => {
            imagePath = result.path=="Image size under conditions"?imagePath:result.path;
        }).catch(error => {
            console.error('Error:', error.message);
        });
        const newimg = await jimp.read(imagePath);
        width = newimg.bitmap.width;
        height = newimg.bitmap.height;
        for(let y=0; y<height; y++){
            for(let x=0; x<width; x++){
                const pixel = jimp.intToRGBA(newimg.getPixelColor(x,y));
                pixelData.push(pixel);
            }
        }
        res.json([pixelData, height, width]);
    }catch(e){
        console.log(e);
        res.status(500).send('An Error occurred');
    }
});

app.get('/forgBackg', async (req, res) => {
    try{
        await callPythonProcess(imagePath, height, width, 'diffForegBackg').then(result => {
            res.json(result);
        }).catch(error => {
            console.error('Error:', error.message);
        });
    }catch(e){
        console.log(e);
        res.status(500).send('An Error occurred');
    }
});

app.get('/faceIdentify', async (req, res) => {
    try{
        await callPythonProcess(imagePath, height, width, 'faceDetect').then(result => {
            res.json(result);
        }).catch(error => {
            console.error('Error:', error.message);
        });
    }catch(e){
        console.log(e);
        res.status(500).send('An Error occurred');
    }
});

async function newImage(imagePath){
    let pixelDatas = [];
    const image = await jimp.read(imagePath);
    width = image.bitmap.width;
    height = image.bitmap.height;
    for(let y=0; y<height; y++){
        for(let x=0; x<width; x++){
            const pixel = jimp.intToRGBA(image.getPixelColor(x,y));
            pixelDatas.push(pixel);
        }
    }
    return pixelDatas;
}

function WEB(port){
    this.active = true;
    this.port = port;
    this.filename = path.basename(__filename);
}

function callPythonProcess(imagePath, height, width, functionValue){
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['./model/main.py', imagePath, height, width, functionValue]);
        let resultData = '';
        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        pythonProcess.on('close', (code) => {
            if(code !== 0){
                console.log(`Python script exited with code ${code}`);
            }
            try{
                const result = JSON.parse(resultData);
                resolve(result);
            }catch(error){
                console.error(`Error parsing JSON: ${error.message}`);
                reject(new Error("Error parsing JSON from Python script"));
            }
        });
    });
}

app.get('*', (req, res) => {
    res.status(404).render('notfound',{error: 404, message: "Page not found on this url, check the source or report it"});
});

server.listen(PORT, (err) => {
    if(err) console.log("Oops an error occure:  "+err);
    console.log(`Compiled successfully!\n\nYou can now view \x1b[33m./${path.basename(__filename)}\x1b[0m in the browser.`);
    console.info(`\thttp://localhost:${PORT}`);
    console.log("\n\x1b[32mNode web compiled!\x1b[0m \n");
});

/*
1. image upload
2. image to pixel data
3. identify foreground & background
4. identify face
5. compare face
6. detect goal
7. pint statement
*/
