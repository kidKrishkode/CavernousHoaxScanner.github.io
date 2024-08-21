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
    foo:() => {
        return 0;
    }
};