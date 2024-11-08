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
        const yValues = [7, 9, 16, 18, 18, 18, 20, 26, 33, 28, 37, 54];
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
    foo:() => {
        return 0;
    }
};