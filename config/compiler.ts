module.exports = {
    codeElement: '',
    lineNumbers: '',
    updateLineNumbers: () => {
        setTimeout(()=>{
            const code = this.codeElement.innerText;
            const lines = code.split("\n");
            const lineCount = lines.length;
            this.lineNumbers.innerHTML = Array.from({ length: lineCount-1 }, (_, i) => i + 1).join("<br>");
        },1500);
    },
    ideDeploy: (code, line, updateLineNumbers) => {
        this.codeElement = document.querySelector(code);
        this.lineNumbers = document.querySelector(line);
        if(updateLineNumbers!=0){
            this.codeElement.addEventListener("input", updateLineNumbers);
            try{
                this.updateLineNumbers();
            }catch(e){
                updateLineNumbers();
            }   
        }
    },
    appointCode: (name, lang, compiler) => {
        for(let i=0; i<compiler.codefork.length; i++){
            if(compiler.codefork[i].lang == lang && compiler.codefork[i].name == name){
                return compiler.codefork[i].code+'\n';
            }
        }
        return 0;
    },
    htmlCompiler: (fieldName) => {
        let frog = document.querySelector(fieldName).innerHTML;
        //console.log(frog);
        frog = frog.replaceAll("&lt; /", "<span class='blu'>&lt;/</span>");
        frog = frog.replaceAll("&lt; ", "<span class='blu'><</span>");
        frog = frog.replaceAll(" &gt;", "<span class='blu'>></span>");
        frog = frog.replaceAll(" /&gt;", "<span class='blu'>/></span>");
        //html tag name color change
        frog = frog.replaceAll('h1@', "<span class='red'>h1</span>");
        frog = frog.replaceAll('h2@', "<span class='red'>h2</span>");
        frog = frog.replaceAll('h3@', "<span class='red'>h3</span>");
        frog = frog.replaceAll('h4@', "<span class='red'>h4</span>");
        frog = frog.replaceAll('h5@', "<span class='red'>h5</span>");
        frog = frog.replaceAll('h6@', "<span class='red'>h6</span>");
        frog = frog.replaceAll('span@', "<span class='red'>span</span>");
        frog = frog.replaceAll('div@', "<span class='red'>div</span>");
        frog = frog.replaceAll('p@', "<span class='red'>p</span>");
        frog = frog.replaceAll('table@', "<span class='red'>table</span>");
        frog = frog.replaceAll('tr@', "<span class='red'>tr</span>");
        frog = frog.replaceAll('td@', "<span class='red'>td</span>");
        frog = frog.replaceAll('th@', "<span class='red'>th</span>");
        frog = frog.replaceAll('hr@', "<span class='red'>hr</span>");
        frog = frog.replaceAll('header@', "<span class='red'>header</span>");
        frog = frog.replaceAll('footer@', "<span class='red'>footer</span>");
        frog = frog.replaceAll('section@', "<span class='red'>section</span>");
        frog = frog.replaceAll('ul@', "<span class='red'>ul</span>");
        frog = frog.replaceAll('li@', "<span class='red'>li</span>");
        frog = frog.replaceAll('main@', "<span class='red'>main</span>");
        frog = frog.replaceAll('body@', "<span class='red'>body</span>");
        frog = frog.replaceAll('html@', "<span class='red'>html</span>");
        frog = frog.replaceAll('head@', "<span class='red'>head</span>");
        frog = frog.replaceAll('style@', "<span class='red'>style</span>");
        frog = frog.replaceAll('noscript@', "<span class='red'>noscript</span>");
        frog = frog.replaceAll('script@', "<span class='red'>script</span>");
        frog = frog.replaceAll('link@', "<span class='red'>link</span>");
        frog = frog.replaceAll('meta@', "<span class='red'>meta</span>");
        frog = frog.replaceAll('title@', "<span class='red'>title</span>");
        frog = frog.replaceAll('img@', "<span class='red'>img</span>");
        frog = frog.replaceAll('audio@', "<span class='red'>audio</span>");
        frog = frog.replaceAll('iframe@', "<span class='red'>iframe</span>");
        frog = frog.replaceAll('button@', "<span class='red'>button</span>");
        //html attributes color change
        frog = frog.replaceAll('classe', "<span class='org'>class</span>");
        frog = frog.replaceAll('|id', "<span class='org'>id</span>");
        frog = frog.replaceAll('|src', "<span class='org'>src</span>");
        frog = frog.replaceAll('|placeholder', "<span class='org'>placeholder</span>");
        frog = frog.replaceAll("|onclick", "<span class='org'>onclick</span>");
        frog = frog.replaceAll("w<span class='org'>id</span>th", "<span class='org'>width</span>");
        frog = frog.replaceAll('|height', "<span class='org'>height</span>");
        frog = frog.replaceAll("<span class='red'>style</span>=", "<span class='org'>style</span>=");
        frog = frog.replaceAll('|alt', "<span class='org'>alt</span>");
        frog = frog.replaceAll('|title=', "<span class='org'>title</span>=");
        frog = frog.replaceAll('|charset', "<span class='org'>charset</span>");
        frog = frog.replaceAll('|http-equiv', "<span class='org'>http-equiv</span>");
        frog = frog.replaceAll('|name=', "<span class='org'>name</span>=");
        frog = frog.replaceAll('|version=', "<span class='org'>version</span>=");
        frog = frog.replaceAll('|content=', "<span class='org'>content</span>=");
        frog = frog.replaceAll('|rel=', "<span class='org'>rel</span>=");
        frog = frog.replaceAll('|href=', "<span class='org'>href</span>=");
        frog = frog.replaceAll('|lang=', "<span class='org'>lang</span>=");
        //attributes parameter color change
        frog = frog.replaceAll(`="`, `=<span class='sky'>"`);
        frog = frog.replaceAll(`"n`, `"</span>`);
        frog = frog.replaceAll(`=s'`, `=<span class='sky'>"`);
        frog = frog.replaceAll(`'n`, `"</span>`);
        frog = frog.replaceAll(`<span class='org'>onclick</span>=<span class='sky'>"`, `<span class='org'>onclick</span>=<span class='sky'>"<span class='grn'>`);
        frog = frog.replaceAll(`();"</span>`, `();</span>"</span>`);
        //commands color change
        frog = frog.replaceAll(`<span class='blu'><</span>!--`, `<span class='gry'>&lt;!--`);
        frog = frog.replaceAll(`--<span class='blu'>></span>`, `--></span>`);
        // frog = errorChecking(frog);
        document.querySelector(fieldName).innerHTML = frog;
    },
    jsCompiler: (fieldName) => {
        let frog = document.querySelector(fieldName).innerHTML;
        //console.log(frog);
        frog = frog.replaceAll("s|", `<span class='sky'>`);
        frog = frog.replaceAll("f|", `<span class='org'>`);
        frog = frog.replaceAll("|n", `</span>`);
        frog = frog.replaceAll(`function`, `<span class='blu'>function</span><span class='org'>`);
        frog = frog.replaceAll(`/(`, `</span>(<span class='gry'>`);
        frog = frog.replaceAll(`){`, `</span>){`);
        frog = frog.replaceAll(`var@`, `<span class='prp'>var</span>`);
        frog = frog.replaceAll(`let@`, `<span class='blu'>let</span>`);
        frog = frog.replaceAll(`const@`, `<span class='blu'>const</span>`);
        frog = frog.replaceAll(`setTimeout@`, `<span class='blu'>setTimeout</span>`);
        frog = frog.replaceAll(`setInterval@`, `<span class='blu'>setInterval</span>`);
        frog = frog.replaceAll(`void@`, `<span class='blu'>void</span>`);
        frog = frog.replaceAll(`NULL@`, `<span class='blu'>NULL</span>`);
        frog = frog.replaceAll(`null@`, `<span class='blu'>null</span>`);
        frog = frog.replaceAll(`for@`, `<span class='blu'>for</span>`);
        frog = frog.replaceAll(`while@`, `<span class='blu'>while</span>`);
        frog = frog.replaceAll(`do@`, `<span class='blu'>do</span>`);
        frog = frog.replaceAll(`return@`, `<span class='blu'>return</span>`);
        frog = frog.replaceAll(`async@`, `<span class='blu'>async</span>`);
        frog = frog.replaceAll(`if@`, `<span class='blu'>if</span>`);
        frog = frog.replaceAll(`else@`, `<span class='blu'>else</span>`);
        frog = frog.replaceAll(`else if@`, `<span class='blu'>else if</span>`);
        frog = frog.replaceAll(`import@`, `<span class='prp'>import</span>`);
        frog = frog.replaceAll(`from@`, `<span class='prp'>from</span>`);
        frog = frog.replaceAll(`export@`, `<span class='prp'>export</span>`);
        frog = frog.replaceAll(`default@`, `<span class='prp'>default</span>`);
        frog = frog.replaceAll(`try@`, `<span class='prp'>try</span>`);
        frog = frog.replaceAll(`catch@`, `<span class='prp'>catch</span>`);
        frog = frog.replaceAll(`s"`, `<span class='gld'>"`);
        frog = frog.replaceAll(`"n`, `"</span>`);
        frog = frog.replaceAll(`s'`, `<span class='gld'>'`);
        frog = frog.replaceAll(`'n`, `'</span>`);
        frog = frog.replaceAll(`//n`, `</span>`);
        frog = frog.replaceAll(`//`, `<span class='grn'>//`);
        frog = frog.replaceAll(`/*`, `<span class='grn'>/*`);
        frog = frog.replaceAll(`*/`, `*/</span>`);
        frog = frog.replaceAll(`await@`, `<span class='prp'>await</span>`);
        frog = frog.replaceAll(`window@`, `<span class='prp'>window</span>`);
        frog = frog.replaceAll(`new@`, `<span class='prp'>new</span>`);
        frog = frog.replaceAll(`Date@`, `<span class='prp'>Date</span>`);
        frog = frog.replaceAll(`Array@`, `<span class='prp'>Array</span>`);
        frog = frog.replaceAll(`fetch@`, `<span class='prp'>fetch</span>`);
        frog = frog.replaceAll(`Math@`, `<span class='sky'>Math</span>`);
        frog = frog.replaceAll(`true@`, `<span class='sky'>true</span>`);
        frog = frog.replaceAll(`false@`, `<span class='sky'>false</span>`);
        frog = frog.replaceAll(`pow@`, `.<span class='sky'>pow</span>`);
        frog = frog.replaceAll(`alert@`, `<span class='sky'>alert</span>`);
        frog = frog.replaceAll(`console@`, `<span class='gry'>console</span>`);
        frog = frog.replaceAll(`json@`, `<span class='grn'>json</span>`);
        frog = frog.replaceAll(`JSON@`, `<span class='grn'>JSON</span>`);
        frog = frog.replaceAll(`then@`, `<span class='org'>then</span>`);
        frog = frog.replaceAll(`==`, `<span class='sky'>==</span>`);
        frog = frog.replaceAll(`!=`, `<span class='sky'>!=</span>`);
        frog = frog.replaceAll(`&gt;`, `<span class='sky'>&gt;</span>`);
        frog = frog.replaceAll(`&lt;`, `<span class='sky'>&lt;</span>`);
        frog = frog.replaceAll(`=<span class='sky'>&gt;</span>`, `<span class='blu'>=></span>`);
        frog = frog.replaceAll(`+`, `<span class='sky'>+</span>`);
        frog = frog.replaceAll(`-`, `<span class='sky'>-</span>`);
        frog = frog.replaceAll(`classe`, `<span class='sky'>class</span>`);
        frog = frog.replaceAll(`document@`, `<span class='red'>document</span>`);
        frog = frog.replaceAll(`&amp;&amp;`, `<span class='red'>&&</span>`);
        frog = frog.replaceAll(`||`, `<span class='red'>||</span>`);
        frog = frog.replaceAll("$ {", '${');
        frog = frog.replaceAll("${", `<span class='red'>$</span>{<span class="sky">`);
        frog = frog.replaceAll("}$", `</span>}`);
        frog = frog.replaceAll(`s#|`, `<span class='gld'>&#96;`);
        frog = frog.replaceAll(`|#n`, `&#96;</span>`);
        frog = frog.replaceAll(`/|/`, `//`);
        frog = frog.replaceAll(`f|`, `<span class='org'>`);
        frog = frog.replaceAll(`|f`, `</span>`);
        frog = frog.replaceAll(`|.getElementById`, `.<span class='sky'>getElementById/span>`);
        frog = frog.replaceAll(`|.querySelector`, `.<span class='sky'>querySelector/span>`);
        frog = frog.replaceAll(`|.querySelectorAll`, `.<span class='sky'>querySelectorAll/span>`);    
        frog = frog.replaceAll(`|.floor`, `.<span class='sky'>floor</span>`);
        frog = frog.replaceAll(`|.round`, `.<span class='sky'>round</span>`);
        frog = frog.replaceAll(`|.random`, `.<span class='prp'>random</span>`);
        frog = frog.replaceAll(`|.style`, `.<span class='sky'>style</span>`);
        frog = frog.replaceAll(`|.innerHTML`, `.<span class='sky'>innerHTML</span>`);
        frog = frog.replaceAll(`|.innerText`, `.<span class='sky'>innerText</span>`);
        frog = frog.replaceAll(`|.textContent`, `.<span class='sky'>textContent</span>`);
        frog = frog.replaceAll(`|.src`, `.<span class='sky'>src</span>`);
        frog = frog.replaceAll(`|.herf`, `.<span class='sky'>herf</span>`);
        frog = frog.replaceAll(`|.log`, `.<span class='gry'>log</span>`);
        frog = frog.replaceAll(`|.body`, `.<span class='gry'>body</span>`);
        frog = frog.replaceAll(`|.location`, `.<span class='gry'>location</span>`);
        frog = frog.replaceAll(`|.requestAnimationFrame`, `.<span class='gry'>requestAnimationFrame</span>`);
        frog = frog.replaceAll(`|.requestIdleCallback`, `.<span class='gry'>requestIdleCallback</span>`);
        frog = frog.replaceAll(`|.removeEventListener`, `.<span class='gry'>removeEventListener</span>`);
        frog = frog.replaceAll(`|.addEventListener`, `.<span class='gry'>addEventListener</span>`);
        frog = frog.replaceAll(`|.cancelAnimationFrame`, `.<span class='gry'>cancelAnimationFrame</span>`);
        frog = frog.replaceAll(`|.cancelIdleCallback`, `.<span class='gry'>cancelIdleCallback</span>`);
        frog = frog.replaceAll(`|.error`, `.<span class='red'>error</span>`);
        frog = frog.replaceAll(`|.json`, `.<span class='org'>json</span>`);
        frog = frog.replaceAll(`|.stringify`, `.<span class='org'>stringify</span>`);
        //jsx type casting
        frog = frog.replaceAll(`|<span class='sky'>&lt;</span>`, `<span class='blu'>&lt;</span>`);
        frog = frog.replaceAll(` <span class='sky'>&gt;</span>|`, `<span class='blu'>&gt;</span>`);
        frog = frog.replaceAll(` /<span class='sky'>&gt;</span>|`, `<span class='blu'>/&gt;</span>`);
        frog = frog.replaceAll(`<span class='sky'>&lt;</span> !<span class='sky'>-</span><span class='sky'>-</span>`, `<span class='gry'>&lt;!--`);
        frog = frog.replaceAll(`<span class='sky'>-</span><span class='sky'>-</span> <span class='sky'>&gt;</span>`, `--></span>`);
        // frog = errorChecking(frog);
        document.querySelector(fieldName).innerHTML = frog;
    },
    pyInterpreter: (fieldName) => {
        let frog = document.querySelector(fieldName).innerHTML;
        //console.log(frog);
        frog = frog.replaceAll("s|", `<span class='sky'>`);
        frog = frog.replaceAll("f|", `<span class='org'>`);
        frog = frog.replaceAll("g|", `<span class='grn'>`);
        frog = frog.replaceAll(" |n", `|n`);
        frog = frog.replaceAll("|n", `</span>`);
        frog = frog.replaceAll(`def`, `<span class='blu'>def</span><span class='org'>`);
        frog = frog.replaceAll(`/(`, `</span>(<span class='gry'>`);
        frog = frog.replaceAll(`):`, `</span>):`);
        frog = frog.replaceAll(`void@`, `<span class='blu'>void</span>`);
        frog = frog.replaceAll(`None@`, `<span class='blu'>None</span>`);
        frog = frog.replaceAll(`null@`, `<span class='blu'>null</span>`);
        frog = frog.replaceAll(`for@`, `<span class='blu'>for</span>`);
        frog = frog.replaceAll(`while@`, `<span class='blu'>while</span>`);
        frog = frog.replaceAll(`return@`, `<span class='blu'>return</span>`);
        frog = frog.replaceAll(`if@`, `<span class='blu'>if</span>`);
        frog = frog.replaceAll(`else@`, `<span class='blu'>else</span>`);
        frog = frog.replaceAll(`else if@`, `<span class='blu'>else if</span>`);
        frog = frog.replaceAll(`import@`, `<span class='prp'>import</span>`);
        frog = frog.replaceAll(`from@`, `<span class='prp'>from</span>`);
        frog = frog.replaceAll(`export@`, `<span class='prp'>export</span>`);
        frog = frog.replaceAll(`default@`, `<span class='prp'>default</span>`);
        frog = frog.replaceAll(`try@`, `<span class='prp'>try</span>`);
        frog = frog.replaceAll(`catch@`, `<span class='prp'>catch</span>`);
        frog = frog.replaceAll(`str@`, `<span class='grn'>str</span>`);
        frog = frog.replaceAll(`list@`, `<span class='grn'>list</span>`);
        frog = frog.replaceAll(`int@`, `<span class='grn'>int</span>`);
        frog = frog.replaceAll(`floor@`, `<span class='grn'>floor</span>`);
        frog = frog.replaceAll(`bool@`, `<span class='grn'>bool</span>`);
        frog = frog.replaceAll(`s"`, `<span class='gld'>"`);
        frog = frog.replaceAll(`"n`, `"</span>`);
        frog = frog.replaceAll(`s'`, `<span class='gld'>'`);
        frog = frog.replaceAll(`'n`, `'</span>`);
        frog = frog.replaceAll(`//n`, `</span>`);
        frog = frog.replaceAll(`//`, `<span class='grn'>//`);
        frog = frog.replaceAll(`/*`, `<span class='grn'>/*`);
        frog = frog.replaceAll(`*/`, `*/</span>`);
        frog = frog.replaceAll(`new@`, `<span class='prp'>new</span>`);
        frog = frog.replaceAll(`Date@`, `<span class='prp'>Date</span>`);
        frog = frog.replaceAll(`Array@`, `<span class='prp'>Array</span>`);
        frog = frog.replaceAll(`fetch@`, `<span class='prp'>fetch</span>`);
        frog = frog.replaceAll(`Math@`, `<span class='sky'>Math</span>`);
        frog = frog.replaceAll(`true@`, `<span class='sky'>true</span>`);
        frog = frog.replaceAll(`false@`, `<span class='sky'>false</span>`);
        frog = frog.replaceAll(`pow@`, `.<span class='sky'>pow</span>`);
        frog = frog.replaceAll(`json@`, `<span class='grn'>json</span>`);
        frog = frog.replaceAll(`JSON@`, `<span class='grn'>JSON</span>`);
        frog = frog.replaceAll(`then@`, `<span class='org'>then</span>`);
        frog = frog.replaceAll(`==`, `<span class='sky'>==</span>`);
        frog = frog.replaceAll(`!=`, `<span class='sky'>!=</span>`);
        frog = frog.replaceAll(`&gt;`, `<span class='sky'>&gt;</span>`);
        frog = frog.replaceAll(`&lt;`, `<span class='sky'>&lt;</span>`);
        frog = frog.replaceAll(`=<span class='sky'>&gt;</span>`, `<span class='blu'>=></span>`);
        frog = frog.replaceAll(`+`, `<span class='sky'>+</span>`);
        frog = frog.replaceAll(`-`, `<span class='sky'>-</span>`);
        frog = frog.replaceAll(`classe`, `<span class='blu'>class</span>`);
        frog = frog.replaceAll(`&amp;&amp;`, `<span class='red'>&&</span>`);
        frog = frog.replaceAll(`||`, `<span class='red'>||</span>`);
        frog = frog.replaceAll("$ {", '${');
        frog = frog.replaceAll("${", `<span class='red'>$</span>{<span class="sky">`);
        frog = frog.replaceAll("}$", `</span>}`);
        frog = frog.replaceAll(`s#|`, `<span class='gld'>&#96;`);
        frog = frog.replaceAll(`|#n`, `&#96;</span>`);
        frog = frog.replaceAll(`/|/`, `//`);
        frog = frog.replaceAll(`f|`, `<span class='org'>`);
        frog = frog.replaceAll(`|f`, `</span>`);
        frog = frog.replaceAll(`|.floor`, `.<span class='sky'>floor</span>`);
        frog = frog.replaceAll(`|.round`, `.<span class='sky'>round</span>`);
        frog = frog.replaceAll(`|.random`, `.<span class='prp'>random</span>`);
        frog = frog.replaceAll(`|.error`, `.<span class='red'>error</span>`);
        frog = frog.replaceAll(`|.json`, `.<span class='org'>json</span>`);
        frog = frog.replaceAll(`|.stringify`, `.<span class='org'>stringify</span>`);
        // frog = errorChecking(frog);
        document.querySelector(fieldName).innerHTML = frog;
    }
};