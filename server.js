const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const jimp = require('jimp');
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
const querystring = require('querystring');
const ejs = require('ejs');
const jsonfile = require('jsonfile');
const varchar = require('./config/env-variables.ts');
const security = require('./config/security.ts');
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

app.use((req, res, next) => {
    try{
        const url = req.originalUrl;
        const query = url.split('?')[1];
        const params = (new URL(path.join(__dirname, url))).searchParams;
        const public_key = varchar.duplex;
        if(params.has('encode')){
            if(query!=undefined){
                const decodedUrl = security.decodedURI(query.replace('encode=',''), public_key);
                req.url = `${url.split('?')[0]}?${decodedUrl}`;
                req.query = querystring.parse(decodedUrl);
            }
        }else{
            if(query!=undefined){
                const encodedUrl = security.encodedURI(query, public_key);
                req.url = `${url}?encode=${encodedUrl}`;
                req.query = querystring.parse(encodedUrl);
            }
        }
        const my_browser = security.browser(req.headers);
        if(!security.validBrowser([my_browser[0], my_browser[1].split('.')[0]*1], varchar.browser_data)){
            res.status(422).render('notfound',{error: 422, message: "Your browser is outdated and may not support certain features. Please upgrade to a modern browser."});
        }
        next();
    }catch(e){
        res.status(401).render('notfound',{error: 401, message: "Unauthorize entry not allow, check the source or report it"});
    }
});

app.get('/', (req, res) => {
    const promises = [
        ejs.renderFile('./views/header.ejs'),
        ejs.renderFile('./views/footer.ejs'),
        ejs.renderFile('./views/service.ejs'),
        ejs.renderFile('./views/faq.ejs')
    ];
    Promise.all(promises).then(([header, footer, services, faq]) => {
        res.status(200).render('index',{header, services, faq, footer});
    });
});

app.get('/index', (req, res) => {
    res.redirect('/');
});

app.get('/varchar', async (req, res) => {
    const navi = req.headers;
    res.status(200).json({varchar, navi});
});

app.get('/converter', (req, res) => {
    const promises = [
        ejs.renderFile('./views/header.ejs'),
        ejs.renderFile('./views/footer.ejs'),
        ejs.renderFile('./views/service.ejs'),
        ejs.renderFile('./views/faq.ejs')
    ];
    Promise.all(promises).then(([header, footer, services, faq]) => {
        res.status(200).render('converter',{header, services, faq, footer});
    });
});

app.post('/converter/process', async (req, res) => {
    const imagePath = req.body.imageData;
    const extension = req.body.extension;
    const tempFilePath = path.join(__dirname,'/images/bin/temp_image.jpg');
    const imageData = imagePath.split(',')[1];
    const image = await jimp.read(Buffer.from(imageData, 'base64'));
    await image.writeAsync(`${tempFilePath}`);

    const listOfInput = [tempFilePath.replaceAll('\\','/'), extension];
    await callPythonProcess(listOfInput, 'converter').then(path => {
        res.status(200).json({path, extension});
    }).catch(error => {
        console.error('Error:', error.message);
    });
});

app.get('/imageInfo', async (req, res) => {
    try{
        imagePath = path.join(__dirname, 'public', './images/image1.jpg');
        const image = await jimp.read(imagePath);
        width = image.bitmap.width;
        height = image.bitmap.height;
        await callPythonProcess([imagePath, height, width], 'resizer').then(result => {
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
        await callPythonProcess([imagePath, height, width], 'diffForegBackg').then(result => {
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
        await callPythonProcess([imagePath, height, width], 'faceDetect').then(result => {
            res.json(result);
        }).catch(error => {
            console.error('Error:', error.message);
        });
    }catch(e){
        console.log(e);
        res.status(500).send('An Error occurred');
    }
});

function newImage(req,res,imageUrl){
    const imagePath = imageUrl;
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('Image not found');
            return;
        }
        res.setHeader('Content-Disposition', 'attachment; filename=temp.png');
        res.setHeader('Content-Type', 'image/png');
        const readStream = fs.createReadStream(imagePath);
        readStream.pipe(res);
    });
}

function WEB(port){
    this.active = true;
    this.port = port;
    this.filename = path.basename(__filename);
    this.appInfo = jsonfile.readFileSync('./public/manifest.json');
}

function callPythonProcess(list, functionValue){
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['./model/main.py', list, functionValue]);
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
