let nav = 0;
let theme = 0;
let system;
let loader;
const pageSet = [];
function System(){
    try{
        this.listen = window.location;
        this.navigation = window.navigation;
        this.id = window.navigation.currentEntry.id;
        this.key = window.navigation.currentEntry.key;
        this.notes = false;
    }catch(e){
        alert("System not deployed!\n\n",e);
    }
}
function Loader(load){
    this.loaded = load;
}
document.addEventListener("DOMContentLoaded",() =>{
    loader = new Loader(true);
    loader.creat();
    loader.remove(2000);
    system = new System();
    system.setTheme();
    document.getElementById('side-menu').innerHTML = '<div class="hambarger-menu"><ul class="nav justify-content-end">'+document.getElementById('nav-menu').innerHTML+'</ul></div>';
});
function navbar_toggle(){
    if(nav==0){
        document.getElementById('side-menu').style.display = "block";
        nav++;
    }else{
        document.getElementById('side-menu').style.display = "none";
        nav--;
    }
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
System.prototype.VisiblePage = function(){
    try{
        for(let i=0; i<pageSet.length; i++){
            document.querySelector("#"+pageSet[i]).style.display = "block";
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
const themeSet = [
    [
        ["--bg-color", "#f6f6f6"],
	    ["--mit-color", "#ececec"],
	    ["--simple-color", "#ffffff"],
        ["--blend-color", "#e8eae8e1"],
        ["--dark-color", "#e3e0e0be"],
        ["--venda", "#f2f2f2"],
	    ["--lavender", "#320064"],
	    ["--eclipse", "#230046"],
        ["--charm", "#6e13aff2"],
        ["--eco-lighting", "#00ff09"],
        ["--atom-blue", "#0c8ff0"],
        ["--loader-back", "#fffffff6"],
        ["--loader-font", "#320064"]
    ],
    [
        ["--bg-color", "#0d1117"],
	    ["--mit-color", "#161b22"],
	    ["--simple-color", "#000000"],
        ["--blend-color", "#1b263b"],
        ["--dark-color", "#2d2d3493"],
        ["--venda", "#141414"],
	    ["--lavender", "#430085"],
	    ["--eclipse", "#320a5b"],
        ["--charm", "#6e13aff2"],
        ["--eco-lighting", "#00ff09"],
        ["--atom-blue", "#0c8ff0"],
        ["--loader-back", "#000000"],
        ["--loader-font", "#00ff09"]
    ]
]
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
}
System.prototype.setTheme = function(){
    for(let i=0; i<themeSet[1].length; i++){
        document.documentElement.style.setProperty(themeSet[1][i][0], themeSet[1][i][1]);
    }
}