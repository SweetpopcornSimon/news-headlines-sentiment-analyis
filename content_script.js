function setup() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if(request.action === 'analyse_page') {
                analysePage(request.selector, (data) =>{
                    sendResponse( {message: 'done', data: data});
                });
                return true;
            } else if(request.action === 'highlight_page') {
                hightlightPage(request.selector,(data) => {
                    selector = request.selector ? request.selector : "h3";
                    foundElements = document.getElementsByClassName(selector);

                    for(var i = 0; i < data.results.documents.length; i++) {
                        item = data.results.documents[i];
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
                    sendResponse( {message: 'done', data: data});
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

    for (let i = 0; i < 10; i++) {
        el = allElements[i];
        allTitles.push({
            id: el.outerHTML,
            text: el.innerText
        });
    }
    chrome.runtime.sendMessage({contentScriptQuery: "analyseMultiple", allTitles: allTitles}, response => {
        if (response.message === 'success') {
            callback(response.data);
        }
    });
}

function unhightlightPage(selector, callback) {
    allElements = document.body.getElementsByClassName(selector);
    for (let item of allElements) {
        item.style.backgroundColor = '';
    }

    callback();
}

function hightlightPage(selector, callback) {
    allElements = document.body.getElementsByClassName(selector);
    myArray = [];
    console.log('highlight page');

    for (let i = 0; i < 10; i++) {
        item = allElements[i];
        myArray.push({
            id: item.outerHTML,
            text: item.innerText
        });
    }

    chrome.runtime.sendMessage({contentScriptQuery: "analyseMultiple", allTitles: myArray}, response => {
        if (response.message === 'success') {
            callback(response.data);
        }
    });
}


$(document).ready(setup);