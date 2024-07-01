const express = require('express');
const http = require('http');
const path = require('path');
const jimp = require('jimp');
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
require('dotenv').config();

const app = express();
let server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const AppName = "Cavernous Hoax Scanner";
let imagePath,width,height;
const pixelData = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).render('index');
});

app.get('/imageInfo', async (req, res) => {
    try{
        imagePath = path.join(__dirname, 'public', 'image1.jpg');
        const image = await jimp.read(imagePath);
        width = image.bitmap.width;
        height = image.bitmap.height;
        for(let y=0; y<height; y++){
            for(let x=0; x<width; x++){
                const pixel = jimp.intToRGBA(image.getPixelColor(x,y));
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

app.get('/resize', async (req, res) => {
    try{
        await callPythonProcess(imagePath, height, width, 'resizer').then(result => {
            imagePath = result.path=="Image size under conditions"?imagePath:result.path;
            let pixelDatas = newImage(imagePath);
            res.json([pixelDatas, result.height, result.width]);
        }).catch(error => {
            console.error('Error:', error.message);
        });
    }catch(e){
        console.log(e);
        res.status(500).send('An Error occurred');
    }
});

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
    res.send({message: "No page found!"});
});

server.listen(PORT, (err) => {
    if(err) console.log("Oops an error occure:  "+err);
    console.log(`Compiled successfully!\n\nYou can now view ./${path.basename(__filename)} in the browser.`);
    console.info(`\thttp://localhost:${PORT}`);
    console.log("\nNode web compiled!\n");
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
