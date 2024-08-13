let nav = 0;
let service = 0;
let theme = 1;
let system;
let loader;
let config;
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
    }catch(e){
        alert("System not deployed!\n\n",e);
    }
}
function Loader(load){
    this.loaded = load;
}
function MEMORY(){
    this.dbName = 'CHSDB';
    this.dbVersion = 1;
}
document.addEventListener("DOMContentLoaded",() => {
    loader = new Loader(true);
    loader.creat();
    loader.remove(2000);
    system = new System();
    document.getElementById('side-menu').innerHTML = '<div class="hambarger-menu"><ul class="nav justify-content-end">'+document.getElementById('nav-menu').innerHTML+'</ul></div>';
    window.addEventListener("scroll",system.scrollAppear);
    memory = new MEMORY();
    system.setUp();
});
function navbar_toggle(){
    if(nav==0){
        document.getElementById('side-menu').style.display = "block";
        document.body.style.overflowY = "hidden";
        nav++;
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
    }catch(e){
        console.log("Error to set up initials!\n",e);
    }
}
System.prototype.VisiblePage = function(){
    try{
        for(let i=0; i<pageSet.length; i++){
            document.querySelector("#"+pageSet[i]).style.display = "block";
        }
        system.setActiveMenu(currentPage[currentPage.length-1]);
        setTimeout(()=>{
            document.body.innerHTML += `<img src="../images/jelly.gif" alt="load" class="jelly"/>`;
        },50000);
    }catch(e){
        console.warn("New Problem: ",e);
    }
}
System.prototype.scrollAppear = function(){
    try{
        var y = window.scrollY;
        for(let i=0; i<appearSet.length; i++){
            let box = document.querySelector(appearSet[i][0]);
            if(y >= appearSet[i][1]){
                box.classList.add("show");
                box.classList.remove("hide");
            }else{
                box.classList.add("hide");
                box.classList.remove("show");
            }
        }
    }catch(e){
        console.warn("New Problem: ",e);
    }
}
function route(link){
    window.location = link;
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
    const navMenu = document.querySelector('.hambarger-menu');
    const navItems = navMenu.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.querySelector('.nav-link').classList.remove('active');
    });
    const activeItem = navMenu.querySelector(`.nav-link[href="/${menuName.toLowerCase().replace(' ', '')}"]`);
    if(activeItem){
        activeItem.classList.add('active');
    }else{
        return false;
    }
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