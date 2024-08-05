// interface IRequest {
//     headers: {
//         [key: string]: string;
//     };
//     body: {
//         [key: string]: string;
//     };
// }

// class Security {
//     private secretKey: string;

//     constructor(secretKey: string) {
//         this.secretKey = secretKey;
//     }

//     public encrypt(data: string): string {
//         return this.xorEncrypt(data, this.secretKey);
//     }

//     public decrypt(encryptedData: string): string {
//         return this.xorDecrypt(encryptedData, this.secretKey);
//     }

//     private xorEncrypt(data: string, key: string): string {
//         let encryptedData = '';
//         for (let i = 0; i < data.length; i++) {
//             encryptedData += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
//         }
//         return encryptedData;
//     }

//     private xorDecrypt(encryptedData: string, key: string): string {
//         return this.xorEncrypt(encryptedData, key);
//     }
// }

// export { Security };

module.exports = {
    encrypt: function encodedURI(url, key){
        let hash = [["0","*z"],["1","*y"],["2","*x"],["3","*w"],["4","*v"],["5","*u"],["6","*t"],["7","*s"],["8","*r"],["9","*q"],["&",0],["+",1],["=",2],["-",3],["a",4],["e",5],["i",6],["n",7],["u",8],["g",9],["r","!h"],["l","!i"],["t","!j"]];
        let str = url.toString().toLowerCase();
        for(let i=0; i<hash.length; i++){
            str = str.replaceAll(hash[i][0], hash[i][1]);
        }
        return str.toString();
    },
    decrypt: function decodedURI(url, key){
        let antihash = [["&",0],["+",1],["=",2],["-",3],["a",4],["e",5],["i",6],["n",7],["u",8],["g",9],["r","!h"],["l","!i"],["t","!j"],["0","*z"],["1","*y"],["2","*x"],["3","*w"],["4","*v"],["5","*u"],["6","*t"],["7","*s"],["8","*r"],["9","*q"]];
        let str = url.toString().toLowerCase();
        for(let i=0; i<antihash.length; i++){
            str = str.replaceAll(antihash[i][1], antihash[i][0]);
        }
        return str.toString();
    },
    browser: function browser(navigator){ 
        var browserAgent = navigator['user-agent']; 
        var browserName, browserVersion, browserMajorVersion; 
        var Offset, OffsetVersion, ix; 
        if((OffsetVersion = browserAgent.indexOf("Chrome")) != -1){ 
            browserName = "Chrome"; 
            browserVersion = browserAgent.substring(OffsetVersion + 7);
        }else if((OffsetVersion = browserAgent.indexOf("MSIE")) != -1){ 
            browserName = "Microsoft Internet Explorer"; 
            browserVersion = browserAgent.substring(OffsetVersion + 5); 
        }else if((OffsetVersion = browserAgent.indexOf("Firefox")) != -1){ 
            browserName = "Firefox"; 
        }else if((OffsetVersion = browserAgent.indexOf("Safari")) != -1){ 
            browserName = "Safari"; 
            browserVersion = browserAgent.substring(OffsetVersion + 7); 
            if((OffsetVersion = browserAgent.indexOf("Version")) != -1) 
                browserVersion = browserAgent.substring(OffsetVersion + 8); 
        }else if((Offset = browserAgent.lastIndexOf(' ') + 1) < (OffsetVersion = browserAgent.lastIndexOf('/'))){ 
            browserName = browserAgent.substring(Offset, OffsetVersion); 
            browserVersion = browserAgent.substring(OffsetVersion + 1); 
            if(browserName.toLowerCase() == browserName.toUpperCase()){ 
                browserName = navigator.appName; 
            } 
        } 
        if((ix = browserVersion.indexOf(";")) != -1) 
            browserVersion = browserVersion.substring(0, ix); 
        if((ix = browserVersion.indexOf(" ")) != -1) 
            browserVersion = browserVersion.substring(0, ix); 
            browserMajorVersion = parseInt('' + browserVersion, 10); 
        if(isNaN(browserMajorVersion)){ 
            browserVersion = '' + parseFloat(navigator.appVersion); 
            browserMajorVersion = parseInt(navigator.appVersion, 10); 
        }
        return [browserName,browserVersion];
    },
    validBrowser: function validBrowser(browser_info,list){
        for(let i=0; i<list.length; i++){
            if(list[i].name == browser_info[0] && browser_info[1] >= list[i].version){
                return true;
            }
        }
        return false;
    }
};