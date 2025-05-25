let nav = 0;
let service = 0;
let theme = 0;
let system;
let loader;
let config;
let compiler;
let temp;
let local_memory=[];
let db, memory;
const pageSet = [];
const appearSet = [];
const currentPage = [];
let themeSet = [];
let security;

class System{
    constructor(){
        try{
            this.listen = window.location;
            this.navigation = window.navigation;
            this.notes = false;
            this.error_layout = false;
        }catch(e){
            alert("System not deployed!\n\n",e);
        }
    }
}
class Loader{
    constructor(load){
        this.loaded = load;
    }
}
class MEMORY{
    constructor(){
        this.dbName = 'CHSDB';
        this.dbVersion = 1;
    }
}
class TAB{
    constructor(){
        this.opened = false;
    }
}
class Security{
    constructor(){
        this.vitals = 0;
        this.trial = 3;
        this.getCaptcha = '';
    }
}
document.addEventListener("DOMContentLoaded",() => {
    loader = new Loader(true);
    loader.creat();
    loader.remove(2000);
    system = new System();
    window.addEventListener("scroll", system.scrollAppear);
    memory = new MEMORY();
    system.setUp();
    security = new Security();
    // window.addEventListener("load", system.isOnline);
    let searchBar = document.querySelector('.form-control');
    if(searchBar!=null){
        document.querySelector('.form-control').addEventListener('keydown', (e)=>{
            if(e.key == 'Enter' && searchBar.value!=''){
                route('/docs?search='+searchBar.value);
            }
        });
    }
});
function navbar_toggle(){
    if(nav==0){
        document.getElementById('side-menu').style.display = "block";
        document.body.style.overflowY = "hidden";
        nav++;
        const nl1 = document.body.addEventListener('scroll', (e)=>{
            e.preventDefault();
            navbar_toggle();
            document.body.removeEventListener(nl1);
        });
    }else{
        document.getElementById('side-menu').style.display = "none";
        document.body.style.overflowY = "auto";
        nav--;
    }
}
function serviceMenu_toggle(){
    if(service==0){
        document.getElementById('service-menu').style.display = "block";
        document.getElementById('service-icon').innerHTML = "&minus;";
        service++;
    }else{
        document.getElementById('service-menu').style.display = "none";
        document.getElementById('service-icon').innerHTML = "&plus;";
        service--;
    }
    navbar_toggle();
}
Loader.prototype.creat = function(){
    if(loader.loaded!=false){
        const loaderEle = document.createElement('div');
        loaderEle.classList.add("loader");
        loaderEle.innerHTML = `<div class="centerDia"><div class="loading"></div></div>`;
        document.body.appendChild(loaderEle);
        document.body.style.overflowY = "hidden";
    }
}
Loader.prototype.remove = function(time){
    if(time<100){
        return false;
    }
    setTimeout(()=>{
        document.body.removeChild(document.querySelector('.loader'));
        loader.loaded = false;
        document.body.style.overflowY = "scroll";
        system.VisiblePage();
    },time);
}
TAB.prototype.open = function(){
    const tabEle = document.createElement('div');
    tabEle.classList.add("tabPage");
    document.body.appendChild(tabEle);
    TAB.opened = true;
    document.querySelectorAll('.tabPage')[document.querySelectorAll('.tabPage').length-1].classList.add('blbg');
}
TAB.prototype.close = function(){
    document.body.removeChild(document.querySelectorAll('.tabPage')[document.querySelectorAll('.tabPage').length-1]);
    if (document.querySelectorAll('.tabPage').length-1 >= 1) TAB.opened = false;
}
TAB.prototype.closeAll = function(){
    document.body.removeChild(document.querySelector('.tabPage'));
    TAB.opened = false;
}
TAB.prototype.innerContext = function(innerContext){
    try{
        document.querySelector('.tabPage').innerHTML = config.varchar.error_templet;
        document.querySelector('.error-message').innerHTML = innerContext;
    }catch(e){
        console.error(e);
    }
}
TAB.prototype.mute = function(){
    try{
        const spanToRemove = document.querySelector('.errorView .flx span');
        if(spanToRemove){
            spanToRemove.remove();
        }
    }catch(e){
        console.error(e);
    }
}
System.prototype.setUp = function(){
    try{
        fetch('/varchar').then(response => response.json()).then(data => {
            config = data.valueOf();
            themeSet = config.varchar.themeSet;
        }).catch(error =>{
            console.error('Error: ',error);
        });
        if(!!document.getElementById('faq-help')){
            let answers = document.querySelectorAll(".accordion"); 
            answers.forEach((event) => { 
                event.addEventListener("click", () => { 
                    if(event.classList.contains("active")){ 
                        event.classList.remove("active"); 
                    }else{
                        event.classList.add("active"); 
                    } 
                }); 
            });
        }
        setTimeout(()=>{
            this.apiConnection();
        },2000);
        memory.pullDataBase();
        if(local_memory!=[]){
            setTimeout(()=>{
                system.setTheme();
            },1000);
        }
        document.getElementById('side-menu').innerHTML = '<div class="hambarger-menu"><ul class="nav justify-content-end">'+document.getElementById('nav-menu').innerHTML+'</ul></div>';
        system.compilerSetUp();
    }catch(e){
        console.log("Error to set up initials!\n",e);
    }
}
System.prototype.deviceVision = function(){
    const userAgent = navigator.userAgent;
    const isComputer = /Windows|Macintosh|Linux/i.test(userAgent) && !/Mobile/i.test(userAgent);
    const isMobile = /Android|iPhone|iPad|iPod|Kindle|BlackBerry/i.test(userAgent);
    const isMobileDesktop = /Android|iPhone|iPad|iPod/i.test(userAgent) && /Chrome|Safari|Firefox/i.test(userAgent) && !/Mobile/i.test(userAgent);
    return {
        isComputer,
        isMobile,
        isMobileDesktop
    };
}
System.prototype.VisiblePage = function(){
    try{
        for(let i=0; i<pageSet.length; i++){
            document.querySelector("#"+pageSet[i]).style.display = "block";
        }
        system.setActiveMenu(currentPage[currentPage.length-1]);
        setTimeout(()=>{
            document.body.innerHTML += `<img src="../images/jelly.gif" alt="load" class="jelly"/>`;
        },500000);
        setTimeout(()=>{
            document.body.removeChild(document.querySelector('.jelly'));
        },500000+35000);
        system.feedScroll();
        
    }catch(e){
        console.warn("New Problem: ",e);
    }
}
System.prototype.scrollAppear = function(){
    try{
        var y = window.scrollY;
        for(let i=0; i<appearSet.length; i++){
            let box = document.querySelector(appearSet[i][0]);
            if(box.classList.contains('hide') || box.classList.contains('show')){
                if(y >= appearSet[i][1] || system.deviceVision().isMobileDesktop){
                    box.classList.add("show");
                    box.classList.remove("hide");
                }else{
                    box.classList.add("hide");
                    box.classList.remove("show");
                }
            }else if(box.classList.contains('invisible') || box.classList.contains('visible')){
                if(y >= appearSet[i][1] || system.deviceVision().isMobileDesktop){
                    box.classList.add("visible");
                    box.classList.remove("invisible");
                }else{
                    box.classList.add("invisible");
                    box.classList.remove("visible");
                }
            }else{
                console.warn("Unkown class property!");
            }
        }
    }catch(e){
        console.warn("New Problem: ",e);
    }
}
System.prototype.feedScroll = function(){
    try{
        var container = document.getElementById('feed-group');
        var middleIndex = Math.floor(document.querySelectorAll('.single-feed').length / 2);
        var middleEle = document.querySelectorAll('.single-feed')[middleIndex-1];
        var rect = middleEle.getBoundingClientRect();
        var space = (middleIndex*20)-10;
        container.scrollTo(rect.left + space + window.pageXOffset, 0);
    }catch(e){
        console.log("Somthing error to scroll feed!\n",e);
    }
}
function route(link){
    window.location = link;
}
function service_swap(id){
    for(let i=0; i<6; i++){
        document.getElementById(`item-${i+1}`).checked = false;
    }
    document.getElementById(`item-${id}`).checked = true;
}
function invaild(){
    alert("Sorry, this feature not avalible in this version,\nTry another one!...");
}
function search_product(data,list){
    let find=miss=0;
    let input = document.getElementById(`${data}`).value;
    input=input.toLowerCase();
    let x = document.getElementsByClassName(`${list}`);
    for(i = 0; i<x.length; i++){ 
        if(!x[i].innerHTML.toLowerCase().includes(input)){
            x[i].style.display="none";
            miss++;
        }else{
            x[i].style.display="list-item";
            find++;
        }
    }
    if(data=='searchSelectList'){
        data='searchData';
    }
    if(miss>find&&find==0&&miss!=0){
        document.getElementById(data+'DOD').style.display="block";
    }else{
        document.getElementById(data+'DOD').style.display="none";
    }
}
System.prototype.splitImage_data = function(file){
    const imageData = file;
    const halfIndex = Math.floor(imageData.length / 2);
    const firstHalf = imageData.slice(0, halfIndex);
    const secondHalf = imageData.slice(halfIndex);
    return firstHalf, secondHalf;
}
System.prototype.copyCode = function(id){
    const textToCopy = document.querySelector(id);
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = textToCopy.textContent;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
    alert("Code has been copied to the clipboard!");
}
System.prototype.downloadCode = function(id,name){
    const textToDownload = document.getElementById(id).textContent;
    // const fileName = "downloaded_file.txt";
    const fileName = `${name}`;
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}
System.prototype.downloadImage = function(id, name){
    const img = document.getElementById(id);
    const fileName = name || '1.png';
    const link = document.createElement("a");
    link.href = img.src;
    link.download = fileName;
    link.click();
}
System.prototype.download_pdf = function(base64String, fileName){
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); 
}

System.prototype.themeToggle = function(id){
    if(theme == 0){
        for(let i=0; i<themeSet[1].length; i++){
            document.documentElement.style.setProperty(themeSet[1][i][0], themeSet[1][i][1]);
        }
        theme = 1;
    }else{
        for(let i=0; i<themeSet[0].length; i++){
            document.documentElement.style.setProperty(themeSet[0][i][0], themeSet[0][i][1]);
        }
        theme = 0;
    }
    local_memory[0] = {
        id: 0,
        name: "Theme",
        value: theme
    };
    system.pushDataBase();
}
System.prototype.setTheme = function(){
    try{
        theme = local_memory[0].value;
        for(let i=0; i<themeSet[theme].length; i++){
            document.documentElement.style.setProperty(themeSet[theme][i][0], themeSet[theme][i][1]);
        }
    }catch(e){
        console.warn("Theme Warning:\nDue to poor os quality, theme initilization not possible in this device, Please use it manually\n\n");
    }
}
System.prototype.encodedURI = function(url, key){
    let str = url.toString().toLowerCase();
    for(let i=0; i<config.varchar.hash.length; i++){
        str = str.replaceAll(config.varchar.hash[i][0], config.varchar.hash[i][1]);
    }
    return str.toString();
}
System.prototype.encodedData = function(data){
    let str = data.toString();
    for(let i=0; i<config.varchar.encrypt.length; i++){
        str = str.replaceAll(config.varchar.encrypt[i][0], config.varchar.encrypt[i][1]);
    }
    return str.toString();
}
System.prototype.setActiveMenu = function(menuName){
    const navMenu = document.querySelector('#side-menu');
    const navItems = navMenu.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.querySelector('.nav-link').classList.remove('active');
    });
    const activeItem = navMenu.querySelector(`.nav-link[href="/${menuName.replace(' ', '')}"]`);
    if(activeItem){
        activeItem.classList.add('active');
    }else{
        return false;
    }
}
System.prototype.apiConnection = async function(){
    let alphaCall = eval(config.hex.alphaCall);
    try{
        let connection = await alphaCall(config.hex.alphaLink+'/test');
        if(connection==true){
            console.log(200);
        }else if(connection?.error){
            document.getElementById('alpha').style.display = "block";
            document.getElementById('alpha-message').textContent = (connection.status.code+', '+connection.error);
        }else if(String(connection).startsWith("SyntaxError: Unexpected token '<',")){
            document.getElementById('alpha').style.display = "block";
            document.getElementById('alpha-message').textContent = "CHSAPI send any kind of html content file...";
        }else{
            document.getElementById('alpha').style.display = "block";
            document.getElementById('alpha-message').textContent = (connection);
        }
    }catch(e){
        document.getElementById('alpha').style.display = "block";
        document.getElementById('alpha-message').textContent = e;
    }
    setTimeout(()=>{
        this.removeConnection();
    },5000);
}
System.prototype.removeConnection = function(){
    try{
        document.getElementById('alpha').style.display = "none";
    }catch(e){
        console.log('Alpha call not present to remove!');
    }
}
System.prototype.handelPyError = function(error){
    try{
        if(!system.error_layout){
            let temp = config.varchar.error_templet;
            temp = temp.replaceAll('<|error.code|>',error.code!=undefined?error.code==false?504:error.code:422);
            temp = temp.replaceAll('<|error.message|>',error.message!=undefined?error.message:"The server understood the content type of the request content, and the syntax of the request content was correct, but it was unable to process the contained instructions.");
            document.body.innerHTML += temp;
            document.body.style.overflowY = "hidden";
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            system.error_layout = true;
        }else{
            document.body.removeChild(document.getElementById('errorPreview'));
            system.error_layout = false;
            system.handelPyError(error);
        }
    }catch(e){
        console.log(error,e);
    }
}
System.prototype.closePyError = function(){
    try{
        let tab = new TAB();
        tab.closeAll();
    }catch(e){console.log("New error comes when close the py error due to:  "+e);}
    document.body.removeChild(document.getElementById('errorPreview'));
    window.location.reload();
}
System.prototype.compilerSetUp = function(){
    try{
        fetch('/compiler').then(response => response.json()).then(data => {
            compiler = data.compiler.valueOf();
        }).catch(error =>{
            console.error('Error: ',error);
        });
    }catch(e){
        console.log('Error to set up compiler!');
    }
}
System.prototype.openPrivacy = function(){
    let tab = new TAB();
    tab.open();
    let link = "/privacy";
    fetch(link, {
        method: 'GET',
        header: {
            "Content": "application/json"
        },
    }).then(response => response.json()).then(privacy => {
        document.querySelectorAll('.tabPage')[document.querySelectorAll('.tabPage').length-1].innerHTML = (privacy.privacy);
    }).catch(e => console.log(e));
}
System.prototype.closePrivacy = function(){
    let tab = new TAB();
    tab.close();
}
System.prototype.openTerms = function(){
    let tab = new TAB();
    tab.open();
    let link = "/terms";
    fetch(link, {
        method: 'GET',
        header: {
            "Content": "application/json"
        },
    }).then(response => response.json()).then(privacy => {
        document.querySelectorAll('.tabPage')[document.querySelectorAll('.tabPage').length-1].innerHTML = (privacy.privacy);
    }).catch(e => console.log(e));
}
System.prototype.openLicense = function(){
    let tab = new TAB();
    tab.open();
    let link = "/license";
    fetch(link, {
        method: 'GET',
        header: {
            "Content": "application/json"
        },
    }).then(response => response.json()).then(privacy => {
        document.querySelectorAll('.tabPage')[document.querySelectorAll('.tabPage').length-1].innerHTML = (privacy.privacy);
        setTimeout(()=>{
            document.querySelector('.license').innerText = document.querySelector('.license').textContent;
        })
    }).catch(e => console.log(e));
}
System.prototype.isOnline = function(){
    if(!navigator.onLine){
        error = {
            "code": 499,
            "message": "Connection lost, please fix your internet connection or run CHS localy, configure the dependencies for JPEN to start localhost"
        }
        system.handelPyError(error);
    }
}
System.prototype.block_resource = function(ids){
    for(let i=0; i<ids.selector.length; i++){
        document.getElementById(ids.selector[i]).disabled = true;
    }
    document.getElementById(ids.input).disabled = true;
}
System.prototype.codeset = function(...args){
    let [name, lang, id, method] = args;
    try{
        let appointCode, pyInterpreter, jsCompiler;
        setTimeout(()=>{
            appointCode = eval(compiler.appointCode);
            document.getElementById(id).innerText = appointCode(name, lang, compiler, method);
            if(lang == 'Python'){
                pyInterpreter = eval(compiler.pyInterpreter);
                pyInterpreter(`#${id}`);
            }else if(lang == 'Vanilla Js' || lang == 'Node Js' || lang == 'React Js'){
                jsCompiler = eval(compiler.jsCompiler);
                jsCompiler(`#${id}`);
            }else{
                console.log("Which language you try to compile, please define carefully!");
            }
            ideDeploy = eval(compiler.ideDeploy);
            ideDeploy(`#${id}`,`#${id}-line`, 0);
        },1000);
    }catch(e){
        document.getElementById(id).innerText = e+"\n\n";
    }
}
System.prototype.captachaInitial = function(){
    security.getCaptcha = eval(config.security.getCaptcha);
    document.querySelector('#captcha-img').innerHTML = `<img src=${security.getCaptcha(document)} alt='load'/>`;
}
System.prototype.reCaptcha = function(){
    document.querySelector('#captcha-img').innerHTML = `<img src=${security.getCaptcha(document)} alt='load'/>`;
}
System.prototype.verifyCaptcha = function(){
    let capthca = document.querySelector('#captcha-text').value;
    let hased_captcha = this.encodedData(capthca);
    if(hased_captcha == security.vitals){
        local_memory[1] = {"id": 1, "verified_key": capthca, "time": (new Date().getTime())};
        system.pushDataBase();
        system.sendMemory();
        setTimeout(()=>{
            document.querySelector('.captcha-attempts').textContent = "You are good to go!";
            fetch('/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    captchaSolved: system.encodedURI('true')
                })
            }).then(data => data.json()).then(data => {
                route(data);
            }).catch(err => {
                console.log("Oops! system is busy to handle you");
            });
        },1000);
    }else{
        document.querySelector('.captcha-attempts').textContent = `>> Captcha not matched, trial ${security.trial}/3`;
        security.trial--;
        if(security.trial < 0){
            document.querySelector('.captcha-attempts').textContent = "Oops, Trial out!";
            window.location = "https://google.com/";
        }
    }
}
System.prototype.openGoogleURL = function(){
  let tab = new TAB();
  tab.open();
  tab.innerContext(`
    <div style="padding: 20px 5%;">
        <h2 style="color: var(--charm);">Google Image URL</h2>
        <p class="text-muted">Please enter the image url in the following link box, the url must be for an supported image type and public accesable, an example url structure is - <code>https://images2.alphacoders.com/716/71660.jpg</code> , after provide the image url click the GET Image button and wait few second.</p>
        <div class="input-group mb-3">
            <input type="url" class="form-control" id="google-url" placeholder="Enter Image URL here" aria-label="Enter Image URL here" aria-describedby="basic-addon2">
            <div class="input-group-append">
                <button class="btn btn-outline-process" onclick="system.getInterImage();">GET Image</button>
            </div>
        </div>
        <div class="btn btn-process" style="margin-top: 20px;"onclick="system.closeGoogleURL();">Close</div>
    </div>
    `);
}
System.prototype.closeGoogleURL = function(){
    new TAB().close();
}
System.prototype.getInterImage = async function(){
    let link = document.getElementById('google-url').value;
    if(link){
        await getInerImage(link);
    }else{
        alert('Please fillout the url field for Image fetching, Empty field is not acceptable!');
    }
}
System.prototype.sendMemory = function(){
    fetch('/memory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dbdata: local_memory
        })
    }).then(data => data.json()).then(data => {
        console.log(data);
    }).catch(err => {
        console.log("Oops! system is busy to handle you");
    });
}
setTimeout(()=>{
    system.sendMemory();
},1000);
System.prototype.pushDataBase = function(){
    memory.saveArray(local_memory);
}
MEMORY.prototype.openDB = function(){
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(memory.dbName, memory.dbVersion);
        request.onerror = (event) => {
            reject('Error to opening database');
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve('Database opened successfully');
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const store = db.createObjectStore('data', { keyPath: 'id' });
        };
    });
}
MEMORY.prototype.saveArray = async function(array){
    memory.clearDB();
    await memory.openDB();
    const transaction = db.transaction(['data'], 'readwrite');
    const store = transaction.objectStore('data');
    array.forEach(item => {
        store.put(item);
    });
}
MEMORY.prototype.fetchArray = async function(){
    await memory.openDB();
    const transaction = db.transaction(['data'], 'readonly');
    const store = transaction.objectStore('data');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject('Error to fetching data');
        };
    });
}
MEMORY.prototype.clearDB = async function(){
    await memory.openDB();
    const transaction = db.transaction(['data'], 'readwrite');
    const store = transaction.objectStore('data');
    store.clear();
}
MEMORY.prototype.pullDataBase = async function(){
    local_memory = await memory.fetchArray();
}