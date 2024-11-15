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
const multer = require('multer');
let varchar, security, hex, compiler;
try{
    varchar = require('./config/env-variables');
    security = require('./config/security');
    hex = require('./config/hex');
    compiler = require('./config/compiler');
}catch(e){
    varchar = require('./config/env-variables.ts');
    security = require('./config/security.ts');
    hex = require('./config/hex.ts');
    compiler = require('./config/compiler.ts');
}
require('./public/App.test.js');
require('dotenv').config();

const app = express();
let server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const AppName = "Cavernous Hoax Scanner";
let web = new WEB(PORT);
let imagePath,width,height;
let API_LINK = '';
let single_img_bin = [];
const pdf_imgPath = [];
let editor_img_path;
let pdf_limit;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/assets',express.static(path.join(__dirname,'assets')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/public',express.static(path.join(__dirname,'public')));

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

app.use((req, res, next) => {
    try{
        /*const url = req.originalUrl;
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
            // res.status(422).render('notfound',{error: 422, message: "Your browser is outdated and may not support certain features. Please upgrade to a modern browser."});
        }*/
        if(!hex.isHosted(req)){
            API_LINK = 'http://127.0.0.1:8000'
        }else{
            API_LINK = 'https://chsapi.vercel.app';
        }
        next();
    }catch(e){
        res.status(401).render('notfound',{error: 401, message: "Unauthorize entry not allow, check the source or report it"});
    }
});

const promises = [
    ejs.renderFile('./views/header.ejs'),
    ejs.renderFile('./views/footer.ejs'),
    ejs.renderFile('./views/service.ejs'),
    ejs.renderFile('./views/feed.ejs'),
    ejs.renderFile('./views/faq.ejs')
];

app.get('/', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('index',{header, services, feed, faq, footer});
    });
});

app.get('/index', (req, res) => {
    res.redirect('/');
});

app.get('/varchar', async (req, res) => {
    const navi = req.headers;
    res.status(200).json({varchar, navi, hex: {
        vaildFiles: hex.vaildFiles.toString(),
        dragAndSort: hex.dragAndSort.toString(),
        trafficAnalyser: hex.trafficAnalyser.toString(),
        popularityTest: hex.popularityTest.toString(),
        singlePartsAPI: hex.singlePartsAPI.toString()
    }});
});

app.get('/compiler', async (req, res) => {
    res.status(200).json({tools: {
        updateLineNumbers: compiler.updateLineNumbers.toString(),
        ideDeploy: compiler.ideDeploy.toString(),
        appointCode: compiler.appointCode.toString()
    },
    compilers: {
        jsCompiler: compiler.jsCompiler.toString(),
        pyInterpreter: compiler.pyInterpreter.toString()
    },
    codeset: {
        codefork: jsonfile.readFileSync('./config/codefork.json')
    }});
});

app.get('/privacy', (req, res) => {
    const promises = [
        ejs.renderFile('./views/privacyPolicy.ejs', {
            id: req.query.view==undefined?0:req.query.view,
            AppName, 
            update: (new Date().toDateString()).substring(4,8)+(new Date().toDateString()).substring(11,16),
            contact: web.appInfo.contact,
            developer: web.appInfo.developer,
            view: req.query.view==undefined?0:req.query.view,
            license: req.query.view==2?fs.readFileSync(path.join(__dirname,'LICENSE')).toString():''
        }),
    ];
    Promise.all(promises).then(([privacy]) => {
        res.status(200).json({privacy});
    });
});

app.get('/terms', (req, res) => {
    res.redirect('/privacy?encode=v65w2*y');
});

app.get('/license', (req, res) => {
    res.redirect('/privacy?encode=v65w2*x');
});

app.get('/nonAPIHost', (req, res) => {
    const error_log = web.appInfo['error_log'];
    const error = hex.pyerrorinfo(error_log, 23);
    res.status(200).json({error});
});

app.get('/imgToPdf', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('pdfConverter',{header, services, feed, faq, footer});
    });
});

let imageParts = {};
app.post('/imgToPdf/upload', upload.single('file'), async (req, res) => {
    try{
        if(!hex.isHosted(req)){
            const index = parseInt(req.body.i);
            const part = req.body.part;
            const imagePart = req.body.filePart;
            const limit = parseInt(req.body.limit);
            if(!imageParts[index]) imageParts[index] = ['', ''];
            imageParts[index][part - 1] = imagePart;
            if(imageParts[index][0] && imageParts[index][1]){
                const completeImageData = imageParts[index][0] + imageParts[index][1];
                const image = await jimp.read(Buffer.from(completeImageData.split(',')[1], 'base64'));
                const tempFilePath = path.join(__dirname, `/assets/pdfhouse/imgs/${index + 1}.png`);
                await image.writeAsync(`${tempFilePath}`);
                pdf_imgPath.push(tempFilePath.toString().replaceAll('\\', '/'));
                pdf_limit = limit;
                delete imageParts[index];
            }
            const ack = part;
            res.status(200).json({"ack": ack});
        }else{
            hex.reward(res);
        }
    }catch(e){
        res.status(403).render('notfound', {error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.post('/imgToPdf/process', async (req, res) => {
    try{
        if(!hex.isHosted(req)){
            if(pdf_limit!=0 && pdf_imgPath.length!=0){
                const listOfInput = pdf_imgPath;
                await callPythonProcess(listOfInput, 'imgToPdf').then(path => {
                    if(web.noise_detect(path)) return web.handle_error(res, path);
                    res.status(200).json({path});
                }).catch(error => {
                    console.error('Error:', error);
                });
            }else{
                res.status(200).json({error: 404, message: "Image not found to build your pdf!"});
            }
        }else{
            hex.reward(res);
        }
    }catch(e){
        res.status(403).render('notfound',{error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.post('/imgToPdf/delete', async (req, res) => {
    try{
        pdf_imgPath.length = 0;
        if(!hex.isHosted(req)){
            const dir_img = fs.readdirSync(path.join(__dirname, `/assets/pdfhouse/imgs/`));
            if(dir_img.length > 1){
                for(let i=1; i<dir_img.length; i++){
                    fs.unlink(path.join(__dirname, `/assets/pdfhouse/imgs/${dir_img[i]}`), (err) => {
                        if(err){
                            console.log('Problem to delete: ./assets/pdfhouse/imgs/',dir_img[i]);
                        }
                    });
                }
            }
        }else{
            hex.reward(res);
        }
    }catch(e){
        res.status(403).render('notfound',{error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.post('/load/single', (req, res) => {
    if(req.body.index <= req.body.limit && req.body.index > 0){
        single_img_bin.push(req.body.img);
        res.status(200).json({"ack": req.body.index, "time": (new Date).getTime()});
    }else{
        console.log("Error to upload arrive for frontend mistack");
    }
});

app.get('/converter', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('converter',{header, services, feed, faq, footer});
    });
});

app.post('/converter/process', upload.single('file'), async (req, res) => {
    try{
        const extension = req.body.extension;
        let imageData;
        let limit;
        if(req.body.load!='true'){
            imageData = req.body.imageData;
            limit = 2;
        }else{
            imageData = hex.mergeListToString(single_img_bin);
            limit = single_img_bin.length;
        }
        await hex.singlePartsAPI(`${API_LINK}/load/single`, imageData, limit).then((result) => {
            hex.chsAPI(`${API_LINK}/api/imageConverter`, {
                form: extension,
                img: '',
                load: 'true',
                key: varchar.API_KEY
            }).then((result) => {
                single_img_bin.length = 0;
                res.status(200).json(result);
            });
        }).catch((error) => {
            console.log("Error sending parts:", error);
        });
    }catch(e){
        res.status(403).render('notfound',{error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.get('/imgEditor', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('imgEditor',{header, services, feed, faq, footer});
    });
});

app.post('/imgEditor/upload', upload.single('file'), async (req, res) => {
    try{
        const index = parseInt(req.body.i);
        const imagePart = req.body.filePart;
        if(!imageParts[index]) imageParts[index] = ['', ''];
        imageParts[index][part - 1] = imagePart;
        if(imageParts[index][0] && imageParts[index][1]){
            const completeImageData = imageParts[index][0] + imageParts[index][1];
            const image = await jimp.read(Buffer.from(completeImageData.split(',')[1], 'base4'));
            const tempFilePath = path.join(__dirname, `/assets/editor/${index + 1}.png`);
            await image.writeAsync(`${tempFilePath}`);
            editor_img_path = tempFilePath.toString().replaceAll('\\','/');
            delete imageParts[index];
        }
        const ack = part;
        res.status(200).json({"ack": ack});
    }catch(e){
        res.status(403).render('notfound',{error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.get('/imgEditor/open_editior', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('imgEditor',{header, services, feed, faq, footer, editor_img_path});
    });
});

app.get('/apiPlug', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('apiPlug',{header, services, feed, faq, footer});
    });
});

app.get('/api', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('apiLanding',{header, services, feed, faq, footer});
    });
});

app.get('/about', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('about',{header, services, feed, faq, footer});
    });
});

function WEB(port){
    this.active = true;
    this.port = port;
    this.filename = path.basename(__filename);
    this.appInfo = jsonfile.readFileSync('./public/manifest.json');
}

WEB.prototype.noise_detect = function(data){
    try{
        return hex.pyerrorscanner(data);
    }catch(e){
        console.log("Error found to detect noise\n",e);
    }
}
WEB.prototype.handle_error = function(res, code){
    try{
        const error_log = web.appInfo['error_log'];
        const error = hex.pyerrorinfo(error_log, code);
        res.status(200).json({error});
        return;
    }catch(e){
        console.log("Error found to handle error\n",e);
    }
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
