const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const PDFDocument = require("pdfkit");
const querystring = require('querystring');
const ejs = require('ejs');
const jsonfile = require('jsonfile');
const multer = require('multer');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
let varchar, security, hex, compiler, DataBase;
try{
    varchar = require('./config/env-variables');
    security = require('./config/security');
    hex = require('./config/hex');
    compiler = require('./config/compiler');
    DataBase = require('./config/memory');
}catch(e){
    varchar = require('./config/env-variables');
    security = require('./config/security');
    hex = require('./config/hex');
    compiler = require('./config/compiler');
    DataBase = require('./config/memory');
}
require('./public/App.test.js');
require('dotenv').config();

class WEB{
    constructor(port){
        this.active = true;
        this.port = port;
        this.filename = path.basename(__filename);
        this.appInfo = jsonfile.readFileSync('./public/manifest.json');
        this.isVerified = false;
        this.originalUrl = false;
        this.private_key = '';
        this.API_KEY = process.env.KEY || '';
    }
}

const app = express();
let server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const AppName = "Cavernous Hoax Scanner";
let web = new WEB(PORT);
let memory;
let API_LINK = '';
let single_img_bin = [];
let multiple_img_bin = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/assets',express.static(path.join(__dirname,'assets'), { maxAge: '30d' }));
app.use('/config',express.static(path.join(__dirname,'config')));
app.use('/images',express.static(path.join(__dirname,'images'), { maxAge: '30d' }));
app.use('/public',express.static(path.join(__dirname,'public'), { maxAge: '30d' }));

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(
    session({
        secret: security.sessionKey(),
        resave: false,
        saveUninitialized: true,
    })
);

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => ipKeyGenerator({ ip: req.headers['x-forwarded-for'] || req.ip }),
    skipSuccessfulRequests: true,
    message: 'Too many requests hit the server, please try again later or check our fair use policy',
});

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});

app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "default-src": ["'self'"],
        "script-src": [
            "'self'",
            "'unsafe-hashes'",
            "'unsafe-eval'",
            "https://cdnjs.cloudflare.com",
            "https://vercel.live",
            "https://vercel.com",
            (req, res) => `'nonce-${res.locals.nonce}'`
        ],
        "script-src-attr": ["'unsafe-inline'"],
        "style-src": [
            "'self'",
            "https://fonts.googleapis.com",
            "https://maxcdn.bootstrapcdn.com",
            "https://stackpath.bootstrapcdn.com",
            "'unsafe-inline'" 
        ],
        "font-src": [
            "'self'",
            "https://fonts.googleapis.com",
            "https://maxcdn.bootstrapcdn.com",
            "https://stackpath.bootstrapcdn.com",
            "https://fonts.gstatic.com",
            "data:"
        ],
        "img-src": ["'self'", "data:", "https://avatars.githubusercontent.com", "https://vercel.com"],
        "connect-src": [
            "'self'",
            "http://127.0.0.1:8000",
            "http://127.0.0.1:5000",
            "http://127.0.0.1:8080",
            "https://chsweb.vercel.app",
            "https://chsapi.vercel.app",
            "https://chscdn.vercel.app",
            "wss://ws-us3.pusher.com",
            "https://ws-us3.pusher.com"
        ],
        frameSrc: [
            "'self'",
            "https://vercel.live"
        ],
    },
}));

app.use([
    xss(),
    limiter,
    express.json(),
    express.urlencoded({ extended: true }),
    (req, res, next) => {
        const BLOCK_DURATION_MS = 60 * 1000;
        const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-vercel-forwarded-for'] || req.connection.remoteAddress || req.ip;
        const cookieBlock = hex.isClientBlockedByCookie(req);
        
        if(varchar.blockedIPs.includes(clientIP) || cookieBlock === 'blocked'){
            console.warn(`Blocked IP attempt to attack: ${clientIP}`);
            return req.destroy() || res.connection.destroy();
        }
        if(varchar.tempBlockedIPs.has(clientIP) || cookieBlock === 'temp'){
            const blockedAt = varchar.tempBlockedIPs.get(clientIP);
            const now = Date.now();
            if(now - blockedAt < BLOCK_DURATION_MS || cookieBlock === 'temp'){
                return res.status(403).send('Your IP is temporarily blocked due to excessive requests. Try again later.');
            }else{
                varchar.tempBlockedIPs.delete(clientIP);
                varchar.ipHits[clientIP] = 0;
                hex.setBlockCookie(res, 'normal');
            }
        }
        if(Object.keys(varchar.ipHits).length >= 10000 && !varchar.ipHits[clientIP]){
            console.warn(`Max users limit reached. Dropping new user with IP: ${clientIP}`);
            return res.status(429).send('Server is too busy now, Because to many user is present in the lobby. Please try again some time later or report us');
        }
        varchar.ipHits[clientIP] = (varchar.ipHits[clientIP] || 0) + 1;
        if(varchar.ipHits[clientIP] > 100 && varchar.ipHits[clientIP] < 200){
            varchar.tempBlockedIPs.set(clientIP, Date.now());
            delete varchar.ipHits[clientIP];
            hex.setBlockCookie(res, 'temp');
            return res.status(403).send('Your IP has been temporarily blocked due to exceed the request limit. Please check our fair use policy.');
        }
        if(varchar.ipHits[clientIP] >= 200){
            varchar.blockedIPs.push(clientIP);
            varchar.tempBlockedIPs.delete(clientIP);
            delete varchar.ipHits[clientIP];
            hex.setBlockCookie(res, 'blocked');
            return res.status(403).send('Access denied, client ip is blocked due to past history of mal-practices!');
        }
        next();
    }
]);

app.use(async (req, res, next) => {
    try{
        const url = req.originalUrl;
        const query = url.split('?')[1];
        const baseURL = req.protocol + '://' + req.get('host');
        const params = new URL(url, baseURL).searchParams;
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
        if(security.secure_access(req.originalUrl)) return next();
        const my_browser = security.browser(req.headers);
        if(!security.validBrowser([my_browser[0], my_browser[1].split('.')[0]*1], varchar.browser_data) && hex.isHosted(req)){
            res.status(422).render('notfound',{error: 422, message: "Your browser is outdated and may not support certain features. Please upgrade to a modern browser."});
        }
        if(!hex.isHosted(req)){
            API_LINK = 'http://127.0.0.1:8000'
        }else{
            API_LINK = 'https://chsapi.vercel.app';
        }
        // hex.keyExchange(hex.isHosted(req)==true?'https://chscdn.vercel.app':'http://127.0.0.1:8080').then((key) => {
        //     web.private_key = key;
        // }).catch((error) => {
        //     console.error("Error to exchange key via CDN: ", error);
        // });
        if(security.nonAuthPage(req.path) || !hex.isHosted(req)){
            return next();
        }
        next(); // for remove security check point
        setTimeout(()=>{
            if(memory!=undefined){
                if(params.has('autherize')){
                    if(security.decodedURI(params.get('autherize'), public_key) < 30*60*1000){
                        return next();
                    }
                }
                try{
                    const last_verified = (new Date().getTime()) - memory.find(function (element){return element.id == 0})==undefined?0:memory.find(function (element){return element.id == 0}).time;
                    if(last_verified >= 30*60*1000){
                        web.originalUrl = req.originalUrl;
                        return res.redirect('/auth?=0');
                    }
                }catch(e){
                    return next();
                }
            }else{
                web.originalUrl = req.originalUrl;
                return res.redirect('/auth');
            }
            next();
        },1500);
    }catch(e){
        res.status(401).render('notfound',{error: 401, message: "Unauthorize entry not allow, check the source or report it", statement: e});
    }
});


const promises = [
    ejs.renderFile('./views/header.ejs'),
    ejs.renderFile('./views/footer.ejs'),
    ejs.renderFile('./views/service.ejs'),
    ejs.renderFile('./views/feed.ejs'),
    ejs.renderFile('./views/faq.ejs')
];

app.get('/main', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('main',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.get('/', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('index',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.get('/varchar', async (req, res) => {
    const navi = req.headers;
    res.status(200).json({varchar, navi, hex: {
        vaildFiles: hex.vaildFiles.toString(),
        dragAndSort: hex.dragAndSort.toString(),
        trafficAnalyser: hex.trafficAnalyser.toString(),
        popularityTest: hex.popularityTest.toString(),
        singlePartsAPI: hex.singlePartsAPI.toString(),
        MultiPartsAPI: hex.MultiPartsAPI.toString(),
        alphaCall: hex.alphaCall.toString(),
        alphaLink: API_LINK
    }, security: {
        getCaptcha: security.getCaptcha.toString(),
        generateImageCaptcha: security.generateImageCaptcha.toString(),
        generateCaptcha: security.generateCaptcha.toString()
    }});
});

app.get('/compiler', async (req, res) => {
    try{
        const codefork = await jsonfile.readFile('./config/codefork.json');
        res.status(200).json({
            compiler: {
                updateLineNumbers: compiler.updateLineNumbers.toString(),
                ideDeploy: compiler.ideDeploy.toString(),
                appointCode: compiler.appointCode.toString(),
                jsCompiler: compiler.jsCompiler.toString(),
                pyInterpreter: compiler.pyInterpreter.toString(),
                codefork: codefork
            }
        });
    }catch(error){
        res.status(500).json({ error: 'Failed to load configuration', details: error.message });
    }
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

app.get('/auth', (req, res) => {
    if(!web.isVerified){
        res.status(200).render('auth');
    }else{
        res.redirect('*');
    }
});

app.post('/auth/verify', (req, res) => {
    const { captchaSolved } = req.body;
    if(Boolean(security.decodedURI(captchaSolved))){
        web.isVerified = true;
        const redirectUrl = req.session.originalUrl || web.originalUrl || '/index';
        req.session.originalUrl = null;
        res.status(200).json(redirectUrl+'?autherize='+security.encodedData(new Date().getTime())+'&greet=true');
    }else{
        web.isVerified = false;
        res.status(200).json('');
    }
});

app.post('/memory', (req, res) => {
    const { dbdata } = req.body;
    memory = dbdata;
    res.status(200).json({'ack': 'Remember user, Permit to route'});
});

app.get('/report', (req, res) => {
    res.status(200).render('reportCard');
});

app.get('/heatmap', (req, res) => {
    res.status(200).render('heatmap');
});

app.get('/imgToPdf', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('pdfConverter',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.post('/imgToPdf/process', async (req, res) => {
    try{
        const load = req.body.load;
        const layout = req.body.layout;
        const paper_size = req.body.paper_size;
        if(load=='true'){
            let imageList = hex.margeListToArray(multiple_img_bin);
            multiple_img_bin = [];
            try{
                let pdfBase64 = await hex.createPDFBase64(imageList, layout, paper_size, PDFDocument);
                res.status(200).json(pdfBase64);
            }catch(e){
                console.log("New Error occure from pdf: "+e);
                return web.handle_error(res, 1);
            }
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
        res.status(200).json({"error": 400, "message": "UploadException: Upload failed due to wrong argument value pass from frontend side"});
    }
});

app.post('/load/multiple', (req, res) => {
    if(req.body.no <= req.body.total_no && req.body.no >= 0){
        if(req.body.index <= req.body.limit && req.body.index >= 0){
            if(!multiple_img_bin[req.body.no*1]){
                multiple_img_bin[req.body.no*1] = [];
            }
            multiple_img_bin[req.body.no*1][req.body.index*1] = req.body.img;
            res.status(200).json({"ack": [req.body.no, req.body.index], "time": (new Date).getTime()});
        }else{
            res.status(200).json({"error": 400, "message": "UploadException: Upload failed due to wrong argument value pass from frontend side"});
        }
    }
});

app.get('/converter', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('converter',{header, services, feed, faq, footer, nonce: res.locals.nonce });
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
        // let encrypted_imageData = await web.encryptMedia(imageData);
        // limit = Math.max(limit, Math.floor(hex.stringSizeInKB(encrypted_imageData)/900)+2);
        // let encrypted_key = await security.keyEncryption(web.private_key, web.API_KEY, varchar.duplex);
        
        await hex.singlePartsAPI(`${API_LINK}/load/single`, imageData, limit, web.API_KEY).then((connection) => {
            if(web.noise_detect(connection)) return web.handle_error(res, connection);
            hex.chsAPI(`${API_LINK}/api/imageConverter`, {
                form: extension,
                img: '',
                load: 'true',
                key: web.API_KEY
            }).then((result) => {
                single_img_bin = [];
                res.status(200).json(result);
            });
        }).catch((error) => {
            console.log("Error sending parts:", error);
        });
    }catch(e){
        res.status(403).render('notfound',{error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.get('/compressor', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('compressor',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.post('/compressor/process', upload.single('file'), async (req, res) => {
    try{
        const quality = req.body.quality!=undefined?req.body.quality:70;
        let imageData;
        let limit;
        if(req.body.load!='true'){
            imageData = req.body.imageData;
            limit = 2;
        }else{
            imageData = hex.mergeListToString(single_img_bin);
            limit = single_img_bin.length;
        }
        // let encrypted_imageData = await web.encryptMedia(imageData);
        // limit = Math.max(limit, Math.floor(hex.stringSizeInKB(encrypted_imageData)/900)+2);
        // let encrypted_key = await security.keyEncryption(web.private_key, web.API_KEY, varchar.duplex);

        await hex.singlePartsAPI(`${API_LINK}/load/single`, imageData, limit, web.API_KEY).then((connection) => {
            if(web.noise_detect(connection)) return web.handle_error(res, connection);
            hex.chsAPI(`${API_LINK}/api/imageCompressor`, {
                quality: quality*1,
                height: null,
                width: null,
                img: '',
                load: 'true',
                key: web.API_KEY
            }).then((result) => {
                single_img_bin = [];
                res.status(200).json(result);
            });
        }).catch((error) => {
            console.log("Error sending parts:", error);
        });
    }catch(e){
        res.status(403).render('notfound',{error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.get('/index', (req, res) => {
    res.redirect('/');
});

app.post('/index/process', upload.single('file'), async (req, res) => {
    try{
        const extension = req.body.extension;
        let mediaData;
        let limit, heatmap='false';
        if(req.body.load!='true'){
            mediaData = req.body.imageData;
            limit = 2;
        }else{
            mediaData = hex.mergeListToString(single_img_bin);
            limit = single_img_bin.length;
        }
        if(req.body?.heatmap){
            if(req.body.heatmap!='true'){
                heatmap = 'false';
            }else{
                heatmap = req.body.heatmap;
            }
        }
        // let encrypted_mediaData = await web.encryptMedia(mediaData);
        // limit = Math.max(limit, Math.floor(hex.stringSizeInKB(encrypted_mediaData)/900)+2);
        // let encrypted_key = await security.keyEncryption(web.private_key, web.API_KEY, varchar.duplex);

        await hex.singlePartsAPI(`${API_LINK}/load/single`, mediaData, limit, web.API_KEY).then((connection) => {
            if(web.noise_detect(connection)) return web.handle_error(res, connection);
            hex.chsAPI(`${API_LINK}/api/dfdScanner`, {
                ext: extension,
                media: '',
                load: 'true',
                key: web.API_KEY,
                heatmap: heatmap
            }).then((result) => {
                single_img_bin = [];
                res.status(200).json(result);
            });
        }).catch((error) => {
            console.log("Error sending parts:", error);
        });
    }catch(e){
        console.log(e);
        res.status(403).render('notfound',{error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.post('/index/sample', async (req, res) => {
    try{
        let index = req.body.index;
        let analysis = await jsonfile.readFile('./assets/bin/analysis.json');
        res.status(200).json(analysis[index]);
    }catch(e){
        console.log(e);
        res.status(403).render('notfound',{error: 403, message: "Failed to process most recent task, Try again later"});
    }
});

app.get('/imgGenerator', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('imgGenerator',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.get('/apiPlug', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('apiPlug',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.get('/api', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('apiLanding',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.get('/about', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('about',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.get('/docs', (req, res) => {
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        res.status(200).render('docs',{header, services, feed, faq, footer, nonce: res.locals.nonce });
    });
});

app.get('/blogs', (req, res) => {
    res.status(200).redirect('https://cavernoushoaxscanner.blogspot.com/');
});

app.post('/cdn_raw', async (req, res) => {
    const codefork = await jsonfile.readFile('./config/codefork.json');
    Promise.all(promises).then(([header, footer, services, feed, faq]) => {
        reactCode = codefork[18].code;
        htmlCode = codefork[19].code;
        jsCode = codefork[20].code;
        jsonReponse = codefork[21].code;
        ejs.renderFile(__dirname+'/views/cdnLanding.ejs', { header, services, feed, faq, footer, reactCode, htmlCode, jsCode, jsonReponse }, (err, html) => {
            if(err){
                console.error("Error to send raw cdn page "+err);
                res.status(500).send('Error to rendering cdn page template');
            }else{
                res.set("Content-Disposition", "attachment;filename=\"cdnLanding.html\"");
                res.set("Content-Type", "text/html");
                res.send(html);
            }
        });
    });
});

app.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if(email && password){
        let db = new DataBase();
        let profile = await db.find_profile(email);
        if(profile && profile.pass == password){
            res.status(200).json(profile);
        }else{
            res.status(404).json({'error': 'The system was unable to locate a user profile matching the provided credentials. If the issue persists, consider reaching out to support for further assistance.'});
        }
    }else{
        res.status(400).json({'error': 'The request could not be processed because the user credentials submitted are either missing or incomplete. Please ensure that all required authentication details are properly filled before attempting to proceed.'});
    }
});

app.get("/proxy", async (req, res) => {
    try{
        res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
        res.setHeader("Access-Control-Allow-Methods", "GET, POST");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        const imageUrl = req.query.url;
        if(!imageUrl){
            return res.status(400).send("Error: No URL provided");
        }
        const response = await fetch(imageUrl);
        if(!response.ok){
            throw new Error("Failed to fetch the image");
        }
        const contentType = response.headers.get("content-type");
        const buffer = await response.arrayBuffer();
        res.set("Content-Type", contentType);
        res.send(Buffer.from(buffer));
    }catch(error){
        res.status(500).send("Error fetching image");
    }
});

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
WEB.prototype.encryptMedia = async function(media){
    try{
        let encrypted_body = await security.substitutionEncoder(media, web.API_KEY);
        let encrypted_media = 'encrypted::'+encrypted_body;
        // console.log("server side:  "+encrypted_media.slice(0, 40));
        return encrypted_media;
    }catch(e){
        console.log("Error to encrypt the provided media!\n",e);
        return media;
    }
}

WEB.prototype.decryptMedia = async function(media){
    try{
        let data = media.split('encrypted::')[1];
        let plain_body = await security.substitutionDecoder(data, web.API_KEY);
        let plain_media = plain_body;
        // console.log("server side:  "+plain_media.slice(0, 40));
        return plain_media;
    }catch(e){
        console.log("Error to encrypt the provided media!\n",e);
        return media;
    }
}

app.get('*', (req, res) => {
    res.status(404).render('notfound',{error: 404, message: "Sorry an error has occured, Requested page not found, check the source or report it!"});
});

server.listen(PORT, (err) => {
    if(err) console.log("Oops an error occure:  "+err);
    console.log(`Compiled successfully!\n\nYou can now view \x1b[33m./${path.basename(__filename)}\x1b[0m in the browser.`);
    console.info(`\thttp://localhost:${PORT}`);
    console.log("\n\x1b[32mNode web compiled!\x1b[0m \n");
});


