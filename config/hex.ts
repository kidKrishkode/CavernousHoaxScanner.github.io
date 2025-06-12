module.exports = {
    pyerrorscanner: function pyerrorscanner(data){
        if((data*1) - (data*1) == 0){
            return true;
        }else{
            return false;
        }
    },
    pyerrorinfo: function pyerrorinfo(error_log, code){
        let message = '';
        for(let i=0; i<error_log.length; i++){
            if(error_log[i].code == code){
                message = error_log[i].desc;
            }
        }
        return {code, message};
    },
    vaildFiles: (fi, max, min)=>{
        if(fi.files.length > 0){
            for(let i = 0; i <= fi.files.length - 1; i++){
                const fsize = fi.files.item(i).size;
                const file = Math.round((fsize / 1024));
                if(file >= max){
                    return "File too Big, please select a file less than 4mb";
                }else if(file < min){
                    return "File too small, please select a file greater than 2mb";
                }else{
                    return file;
                }
            }
        }
    },
    dragAndSort: (sortableList)=>{
        let draggedItem = null;
        let draggedIndex = -1;
        const updateDataSet = () => {
            const listItems = sortableList.querySelectorAll(".pdf-img");
            for(let i=0; i<listItems.length; i++){
                pdf.imgSet[i] = listItems[i].src;
            }
        };
        sortableList.addEventListener('touchstart', (e) => {
            draggedItem = e.target;
            draggedIndex = [...sortableList.children].indexOf(draggedItem);
        });
        sortableList.addEventListener('touchend', (e) => {
            draggedItem = null;
            updateDataSet();
        });
        sortableList.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(sortableList, e.touches[0].clientY);
            if(afterElement == null){
                sortableList.appendChild(draggedItem);
            }else{
                sortableList.insertBefore(draggedItem, afterElement);
            }
        });
        sortableList.addEventListener("dragstart", (e) => {
            draggedItem = e.target;
            draggedIndex = [...sortableList.children].indexOf(draggedItem);
        });
        sortableList.addEventListener("dragend", (e) => {
            draggedItem = null;
            updateDataSet();
        });
        sortableList.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(sortableList, e.clientY);
            if(afterElement == null){
                sortableList.appendChild(draggedItem);
            }else{
                sortableList.insertBefore(draggedItem, afterElement);
            }
        });
        const getDragAfterElement = (container, y) => {
            const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if(offset < 0 && offset > closest.offset){
                    return { offset: offset, element: child };
                }else{
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        };
    },
    trafficAnalyser: () => {
        const labels = ['Aug24','Sep24','Oct24','Nov24','Dec24','Jan25','Feb25','Mar25','Apr25','May25','Jun25', 'Jul25'];
        const xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160];
        const yValues = [7, 9, 16, 18, 24, 17, 20, 28, 26, 39, 67, 94];
        const currentMonth = new Date().getMonth()+1;
        let endMonth;
        if(currentMonth > 8){
            endMonth = currentMonth - 8;
        }else{
            endMonth = currentMonth + 5;
        }
        labels.splice(endMonth);
        xValues.splice(endMonth);
        yValues.splice(endMonth);
        return {labels, xValues, yValues};
    },
    popularityTest: (ul, chart) => {
        const xValues = ["Deepfake Detector", "Image Compressor", "Image Converter", "Sentiments Analyser", "Image to Pdf"];
        const yValues = [23, 31, 26, 12, 8];
        const col1 = [
            "#6e13af",
            "#9D00B3",
            "#430085",
            "#320a5b",
            "#2B0037"
        ];
        let ratio= yValues;
        let temp, name, loc, x='', styling="background-image: conic-gradient(", left=0, right;
        for(let j=0; j<xValues.length; j++){
            name = xValues[j];
            temp = yValues[j];
            loc = j;
            if(j<1){
                right = Math.round((yValues[j] / 100)*360)-1;
            }else{
                right = left + Math.round((yValues[j] / 100)*360)-1;
            }
            styling += `${col1[loc]} ${left}deg ${right}deg`;
            if(j<xValues.length-1){
                styling+=',';
            }
            left = right;
            if((xValues[loc] != '' ) && ((left + right) != 0)){
                ul.innerHTML += `<li><div class="pie-box"style="background: ${col1[loc]}"></div>${name} [≈ ${Math.round(yValues[j])}%]</li>`;
            }
            xValues[loc] = '';
        }
        styling += ");";
        chart.style.cssText = styling;
        for(let j=0; j<ratio.length-1; j++){
            if(ratio[j] != undefined){
                x+=`${ratio[j]} : `;
            }else{
                x+='0 : ';
            }
        }
    },
    isHosted: (req) => {
        const host = req.hostname;
        if(host === 'localhost' || host === '127.0.0.1'){
            return false;
        }else{
            return true;
        }
    },
    reward: (res) => {
        res.redirect('/nonAPIHost');
    },
    alphaCall: async (uri) => {
        const url = uri;
        let num1 = Math.floor(Math.random()*10);
        let num2 = Math.floor(Math.random()*10);
        let sum = num1+num2;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try{
            const response = await fetch(`${url}?a=${num1}&b=${num2}`, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if(!response.ok){
                const errorDetails = await response.json();
                return errorDetails;
            }
            const result = await response.json();
            if (result.sum == sum) return true;
            return result;
        }catch(error){
            if(error.name === 'AbortError'){
                return 408;
            }
            return error;
        }
    },
    singlePartsAPI: async (url, mainString, limit) => {
        const parts = [];
        let encoded=false;
        if(mainString==undefined){
            mainString='';
        }
        if(mainString.startsWith('encrypted::')){
            mainString = mainString.split('encrypted::')[1];
            encoded=true;
        }
        const partLength = Math.ceil(mainString.length / limit);
        for(let i = 0; i < limit; i++){
            parts.push(mainString.slice(i * partLength, (i + 1) * partLength));
            // console.log(parts[parts.length-1]);
        }
        async function sendPart(part, index, limit){
            if(encoded){
                console.log(part.substring(0, 30));
                part = 'encrypted::'+part;
            }
            let attempts = 0;
            while(attempts < 3){
                attempts++;
                try{
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            img: part,
                            limit: limit,
                            index: index,
                            key: "3045dd712ffe6e702e3245525ac7fa38"
                        })
                    });
                    const data = await response.json();
                    console.log(data);
                    if(data.ack === index){
                        return "true";
                    }
                }catch(error){
                    // console.log(error);
                    if(error.cause.errno==-4078 || error.cause.code=='ECONNREFUSED') return false;
                    console.log(`Error on attempt ${attempts} for part ${index}:`, error);
                }
            }
            return false;
        }
        for(let i = 0; i < parts.length; i++){
            const isSuccess = await sendPart(parts[i], i + 1, limit);
            if(!isSuccess){
                return 24;
            }
        }
        return "true";
    },
    chsAPI: async (uri, token) => {
        const url = uri;
        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(token)
            });
            if(!response.ok){
                const errorDetails = await response.json();
                console.error('API Error:', errorDetails);
                return false;
            }
            const result = await response.json();
            return result;
        }catch(error){
            console.error('Error calling API:', error);
            return false;
        }
    },
    MultiPartsAPI: async (url, mainString_list, limit) => {
        if(mainString_list==undefined){
            mainString_list=[];
        }
        for(let j=0; j<mainString_list.length; j++){
            const parts = [];
            const single_limit = Math.floor(limit/mainString_list.length)==0?2:Math.floor(limit/mainString_list.length);
            const partLength = Math.ceil(mainString_list[j].length / single_limit);
            for(let i = 0; i < single_limit; i++){
                parts.push(mainString_list[j].slice(i * partLength, (i + 1) * partLength));
            }
            async function sendPart(part, index, limit){
                let attempts = 0;
                while(attempts < 3){
                    attempts++;
                    try{
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                img: part,
                                limit: limit,
                                index: index,
                                total_no: mainString_list.length,
                                no: j
                            })
                        });
                        const data = await response.json();
                        console.log(data);
                        if(data.ack[0] === j && data.ack[1] === index){
                            return "true";
                        }
                    }catch(error){
                        if(error.cause.errno==-4078 || error.cause.code=='ECONNREFUSED') return false;
                        console.log(`Error on attempt ${attempts} for part ${index}:`, error);
                    }
                }
                return false;
            }
            for(let i = 0; i < parts.length; i++){
                const isSuccess = await sendPart(parts[i], i, limit);
                if(!isSuccess){
                    return 24;
                }
            }
        }
        return "true";
    },
    keyExchange: async (url) => {
        function isPrime(n){
            if (n < 2) return false;
            if (n === 2 || n === 3) return true;
            if (n % 2 === 0) return false;

            for (let i = 3; i <= Math.sqrt(n); i += 2) {
                if (n % i === 0) return false;
            }
            return true;
        }
        function getRandomPrimes(count, min, max){
            const primes = [];
            for(let i = min; i <= max; i++){
                if (isPrime(i)) primes.push(i);
            }
            const selectedPrimes = [];
            while(selectedPrimes.length < count){
                const randomPrime = primes[Math.floor(Math.random() * primes.length)];
                if (!selectedPrimes.includes(randomPrime)) selectedPrimes.push(randomPrime);
            }

            return selectedPrimes;
        }
        const smallPrimes = getRandomPrimes(1, 3, 10);
        let num = smallPrimes.reduce((prod, prime) => prod * prime, 1);

        while(!isPrime(num)){
            num += 1;
        }
        async function key_exchange(id){
            try{
                const response = await fetch(`${url}/key_exchange?a=${num}`, {
                    method: 'GET'
                });
                if(!response.ok){
                    const errorDetails = await response.json();
                    return errorDetails;
                }
                const result = await response.json();
                return result;
            }catch(error){
                if(error.cause.errno==-4078 || error.cause.code=='ECONNREFUSED'){
                    if(id>0){
                        return key_exchange(id-1);
                    }
                }
                return {'secret': 'iinmhjjjhnnkn', 'public': 5};
            }
        }
        let result = await key_exchange(1);
        if(typeof(result)!='object'){
            return '1441';
        }else{
            return result;
        }
    },
    createPDFBase64: async (imageList, layout="combine", paper_size="A4", PDFDocument) => {
        function base64ToBuffer(base64){
            return Buffer.from(base64.split(",")[1], "base64");
        }
        const size_rules = {
            "A3": [297 , 420],
            "A4": [210 , 297],
            "A5": [148 , 210],
            "Letter": [215.9 , 279.4],
            "Legal": [216 , 356],
            "B5": [176 , 250],
            "B4": [250 , 353],
        }
    
        return new Promise((resolve, reject) => {
            try{
                paper_size = size_rules[paper_size]==undefined?size_rules['A4']:size_rules[paper_size];
                const doc = new PDFDocument({ 
                    autoFirstPage: false, 
                    size: paper_size
                });
                const buffers = [];
    
                doc.on("data", (chunk) => buffers.push(chunk));
                doc.on("end", () => resolve("data:application/pdf;base64," + Buffer.concat(buffers).toString("base64")));
    
                imageList.forEach((imgBase64) => {
                    if(!imgBase64.startsWith("data:image")){
                        throw new Error("Invalid base64 image format");
                    }
    
                    const imgBuffer = base64ToBuffer(imgBase64);
                    const img = doc.openImage(imgBuffer);
                    
                    const pageWidth = Number(paper_size[0]);
                    const pageHeight = Number(paper_size[1]);
                    
                    const imgAspect = img.width / img.height;
                    const pageAspect = pageWidth / pageHeight;
    
                    let newWidth, newHeight;
                    if(imgAspect > pageAspect){
                        newWidth = pageWidth;
                        newHeight = pageWidth / imgAspect;
                    }else{
                        newHeight = pageHeight;
                        newWidth = pageHeight * imgAspect;
                    }
    
                    const xOffset = (pageWidth - newWidth) / 2;
                    const yOffset = (pageHeight - newHeight) / 2;
                    
                    doc.addPage({ layout: layout=="combine"?(newWidth <= newHeight ? "portrait" : "landscape"):layout, size: paper_size });
                    doc.image(imgBuffer, xOffset, yOffset, { width: newWidth, height: newHeight });
                });
    
                doc.end();
            }catch(error){
                reject("Error generating PDF: " + error.message);
            }
        });
    },
    mergeListToString: (singleImgBin) => {
        if (!Array.isArray(singleImgBin)) {
            throw new Error("Input must be an array");
        }
        return singleImgBin.join('');
    },
    margeListToArray: (multipleImgBin) => {
        if (!Array.isArray(multipleImgBin)) {
            throw new Error("Input must be an array");
        }
        for(let i=0; i<multipleImgBin.length; i++){
            multipleImgBin[i] = multipleImgBin[i].join('');
        }
        return multipleImgBin;
    },
    stringSizeInKB: (str) => {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
        const sizeInBytes = uint8Array.byteLength;
        const sizeInKB = sizeInBytes/1024;
        return Math.floor(sizeInKB);
    },
    foo:() => {
        return 0;
    }
};