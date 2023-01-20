document.addEventListener('DOMContentLoaded', () => {
    const element = document.querySelector("#checkPage");

    document.getElementById("customSelector").value = "";
    element.addEventListener("click", () => {
        selector = document.getElementById("customSelector").value;
        analysePage(selector);
    });

    const elementHighlightPage = document.querySelector("#highlightPage");

    elementHighlightPage.addEventListener("click", () => {
        selector = document.getElementById("customSelector").value;
        hightlightPage(selector);
    });


    const elementUnHighlightPage = document.querySelector("#unHighlightPage");

    elementUnHighlightPage.addEventListener("click", () => {
        selector = document.getElementById("customSelector").value;
        unhightlightPage(selector);
    });

    
    document.querySelector("#collapsible").addEventListener("click", (el) => {
        el.target.classList.toggle("active")
        var content = el.target.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
    });


    const parsePage = document.querySelector("#testParse");

    parsePage.addEventListener("click", () => {
        selector = document.getElementById("customSelector").value;
        hightlightPage(selector);
        analysePage(selector);
    });
}, false);

function hightlightPage(selector) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"action": "highlight_page", "selector": selector}, response => {
            if(response.message === 'done') {
                console.log('highlighted done');
            }
        });
    });
}

function unhightlightPage(selector) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"action": "unhighlight_page", "selector": selector}, response => {
            if(response.message === 'done') {
                console.log('unhighlighted done');
            }
        });
    });
}

function analysePage(selector, highlight=false) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"action": "analyse_page", "selector": selector}, response => {
            if(response && response.message === 'done') {
                let good = [];
                let bad = [];
                let neutral = [];
                _.forEach(response.data.results.documents, (item) => {
                    if(item.sentiment === 'positive'){
                        good.push(item);
                    }

                    if(item.sentiment === 'negative'){
                        bad.push(item);
                    }

                    if(item.sentiment === 'neutral'){
                        neutral.push(item);
                    }

                    if(item.sentiment === 'mixed'){

                    }
                });

                rating = '';
                if(good.length > bad.length) {
                    rating = "Positive";
                } else if (bad.length > good.length) {
                    rating = 'Negative';
                } else if (neutral.length > bad.length || neutral.length > good.length) {
                    rating = 'meh'
                } else {
                    
                }


                const element = document.querySelector("#message");
                element.innerHTML = `<p >Good: ${good.length}</p> <p >Neutral: ${neutral.length}</p> <p >Bad: ${bad.length}</p> <p>Overall rating: ${rating} </p>`;
            }
        });
    });
}
