document.addEventListener('DOMContentLoaded', () => {
    const element = document.querySelector("#checkPage");

    document.getElementById("customSelector").value = "";

    autoFillSelector();


    element.addEventListener("click", () => {
        selector = document.getElementById("customSelector").value;
        console.log('analyse', selector);
        analysePage(selector);
    });

   /*const elementHighlightPage = document.querySelector("#highlightPage");

    elementHighlightPage.addEventListener("click", () => {
        selector = document.getElementById("customSelector").value;
        hightlightPage(selector);
    });*/


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


    /*const parsePage = document.querySelector("#testParse");

    parsePage.addEventListener("click", () => {
        selector = document.getElementById("customSelector").value;
        analysePage(selector);
    });*/
}, false);


function autoFillSelector(){
    let newsMap = new Map([
        ["https://www.derstandard.at/", "teaser-title"],
        ["https://edition.cnn.com/","cd__headline-text"],
        ["https://www.nachrichten.at/","teaser__link"],
        ["https://orf.at/", "ticker-story-headline"],
        ["https://dietagespresse.com/", "entry-title"],
        ["https://www.bbc.com/","media__link"],
        ["https://www.oe24.at/","title"],
        ["https://www.krone.at/","a__title"],
        ["https://www.foxnews.com/", "title"],
        ["https://www.nytimes.com/","indicate-hover"],
        ["https://www.reuters.com/", "heading_5_half"],
        ["https://techcrunch.com/", "post-block__title__link"]
    ]);
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var activeTab = tabs[0];
        document.getElementById("customSelector").value = newsMap.get(activeTab.url);
    })
}

function hightlightPage(data,selector) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"action": "highlight_page", "data": data, "selector": selector}, response => {
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

function analysePage(selector) {
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

                this.hightlightPage(response.data.results, selector);
            }
        });
    });
}
