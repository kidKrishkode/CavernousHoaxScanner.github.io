module.exports = {
    themeSet: [
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
            ["--revers-lavender", "#320064"],
            ["--revers-white", "#000"],
            ["--glass-color", "#ececec79"],
            ["--code-color", "#ebf0f4"],
            ["--code-li-color", "#fff"],
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
            ["--revers-lavender", "#fff"],
            ["--revers-white", "#fff"],
            ["--glass-color", "#161b2279"],            
            ["--code-color", "#161b20"],
            ["--code-li-color", "#1E1E1E"],
            ["--loader-back", "#000000"],
            ["--loader-font", "#00ff09"]
        ]
    ],
    duplex: 1441,
    hash: [["0","*z"],["1","*y"],["2","*x"],["3","*w"],["4","*v"],["5","*u"],["6","*t"],["7","*s"],["8","*r"],["9","*q"],["&",0],["+",1],["=",2],["-",3],["a",4],["e",5],["i",6],["n",7],["u",8],["g",9],["r","!h"],["l","!i"],["t","!j"]],
    API_KEY: "3045dd712ffe6e702e3245525ac7fa38",
    browser_data: [
        {
            name: "Chrome",
            version: 125
        },
        {
            name: "Microsoft Internet Explorer",
            version: 114
        },
        {
            name: "Firefox",
            version: 119
        },
        {
            name: "Safari",
            version: 80
        },
    ],
    error_templet: `
        <div class="workspace blbg" style="background: #0000009e;" id="errorPreview">
            <div class="errorView">
                <header class="flx"><img src="../public/favicon.ico" alt="load"/>
                    <span style="cursor: pointer;" onclick="system.closePyError();">&times;</span>
                </header>
                <div class="error-message">
                    <i class="fa fa-times-circle-o"></i>
                    <h2>Error: <|error.code|>!</h2>
                    <small class="form-text text-muted">This error genaredted by system for handle unwanted useage of resource</small>
                    <p><|error.message|></p>
                <div class="btn btn-process" style="margin-top: 40px;" onclick="system.closePyError();"><i class="fa fa-refresh"></i> Re-try</div>
            </div>
        </div>`,
    traffic: {
        flow: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
        visitor: [7, 9, 16, 18, 18, 18, 20, 26, 33, 28, 37, 54]
    },
    captcha_templet: `
        <section class="captcha">
            <h3>Verify your self</h3>
                <small class="text-muted">Fill the following capthca in right order under 3 attempts, if a captcha not loaded with in 5 second then report it and try some time later</small>
                <form class="form-inline">
                    <div class="form-group mb-2">
                        <label for="captch-img" class="sr-only">Capthca</label>
                        <div class="form-control" id="captcha-img"></div>
                    </div>
                    <div class="btn btn-primary mb-2" onclick="system.reCaptcha();"><i class="fa fa-refresh"></i></div>
                </form>
                <form class="form-inline">
                    <div class="form-group mx-sm-3 mb-2">
                        <input type="text" class="form-control" id="captcha-text" placeholder="Enter the captch"/>
                    </div>
                    <div class="btn btn-primary mb-2" onclick="system.verifyCaptcha();">Verify</div>
                </form>
                <div class="captcha-attempts"></div>
                <div class="text-muted captcha-footer">
                    <span onclick="system.openPrivacy();">Privacy</span>
                    <span onclick="system.openTerms();">Terms</span>
                    <span onclick="system.openLicense();">License</span>
                    <span><a href="mailto:info.whitelotus24@gmail.com?&subject=CHS WEB Query&body=My name is: <|Write your name|>,\nMy query is: <|Write your query|>.">Contact</a></span>
                </div>
        </section>
    `
};