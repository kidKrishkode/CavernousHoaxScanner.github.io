let nav = 0;
let service = 0;
let theme = 1;
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

function System(){
    try{
        this.listen = window.location;
        this.navigation = window.navigation;
        this.notes = false;
        this.error_layout = false;
    }catch(e){
        alert("System not deployed!\n\n",e);
    }
}
function Loader(load){
    this.loaded = load;
}
function MEMORY(){
    this.dbName = 'Krishfolio';
    this.dbVersion = 1;
}
function TAB(){
    this.opened = false;
}
document.addEventListener("DOMContentLoaded",() => {
    loader = new Loader(true);
    loader.creat();
    loader.remove(2000);
    system = new System();
    window.addEventListener("scroll",system.scrollAppear);
    memory = new MEMORY();
    system.setUp();
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
    document.body.removeChild(document.querySelector('.tabPage'));
    TAB.opened = false;
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
    // if(isMobile == true){
    //     console.log('mobile');
    // }else if(isMobileDesktop == true){
    //     console.log('desktop');
    // }else{
    //     console.log('computer');
    // }
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
System.prototype.download_pdf = function(filePath, fileName){
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName || '1.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
System.prototype.inphantCDN = function(){
    window.location = "https://kidKrishkode.github.io/inphantApi.github.io/main.html?page=DocsPage&test=null&search=How%20to%20Use%20Our%20API&env=false";
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
    theme = local_memory[0].value;
    for(let i=0; i<themeSet[theme].length; i++){
        document.documentElement.style.setProperty(themeSet[theme][i][0], themeSet[theme][i][1]);
    }
}
System.prototype.encodedURI = function(url, key){
    let str = url.toString().toLowerCase();
    for(let i=0; i<config.varchar.hash.length; i++){
        str = str.replaceAll(config.varchar.hash[i][0], config.varchar.hash[i][1]);
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
System.prototype.handelPyError = function(error){
    try{
        if(!system.error_layout){
            let temp = config.varchar.error_templet;
            temp = temp.replaceAll('<|error.code|>',error.code);
            temp = temp.replaceAll('<|error.message|>',error.message);
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
    // let link = `${system.encodedURI('/privacy','id='+3)}`;
    let link = "/privacy";
    fetch(link, {
        method: 'GET',
        header: {
            "Content": "application/json"
        },
    }).then(response => response.json()).then(privacy => {
        document.querySelector('.tabPage').innerHTML = (privacy.privacy);
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
        document.querySelector('.tabPage').innerHTML = (privacy.privacy);
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
        document.querySelector('.tabPage').innerHTML = (privacy.privacy);
        setTimeout(()=>{
            document.querySelector('.license').innerText = document.querySelector('.license').textContent;
        })
    }).catch(e => console.log(e));
}
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
