function setup() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if(request.action === 'analyse_page') {
                console.log('action analyse page');
                analysePage(request.selector, (data) =>{
                    sendResponse( {message: 'done', data: data});
                });
                return true;
            } else if(request.action === 'highlight_page') {
                for(var i = 0; i < request.data.documents.length; i++) {
                    item = request.data.documents[i];
                    foundElements = document.getElementsByClassName(request.selector);
                    el = foundElements[i];
                    switch (item.sentiment) {
                        case 'negative':
                            el.style.backgroundColor  = 'red';
                            //el.style.display = 'none';
                            break;
                        case 'positive':
                            el.style.backgroundColor  = 'green';
                            break;
                        case 'neutral':
                            el.style.backgroundColor  = 'yellow';
                            break;
                        default:

                    }
                }
                hightlightPage(request.selector, () => {
                    sendResponse( {message: 'done'});
                });
                return true;
            } else if(request.action === 'unhighlight_page') {
                unhightlightPage(request.selector, () => {
                    sendResponse( {message: 'done'});
                });
                return true;
            } else {}
    });
    
}

function getCleanText(text) {
    return text.replace("'", "\\'");
}

function analysePage(selector, callback){
    allTitles = [];
    allElements = document.body.getElementsByClassName(selector);

    if(allElements.length > 10) {
        for (let i = 0; i < 10; i++) {
            el = allElements[i];
            allTitles.push({
                id: el.outerHTML,
                text: el.innerText
            });
        }
    } else {
        for (let el of allElements){
            allTitles.push({
                id: el.outerHTML,
                text: el.innerText
            });
        }
    }


    chrome.runtime.sendMessage({contentScriptQuery: "analyseMultiple", allTitles: allTitles}, response => {
        if (response.message === 'success') {
            callback(response.data);
        }
    });
}

function hightlightPage(selector, callback) {
    callback();
}

function unhightlightPage(selector, callback) {
    allElements = document.body.getElementsByClassName(selector);
    for (let item of allElements) {
        item.style.backgroundColor = '';
    }
    callback();
}


$(document).ready(setup);