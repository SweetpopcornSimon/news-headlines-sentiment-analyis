  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

    if (request.contentScriptQuery === "analyseMultiple") {
      
      var url = "https://goodnewslanguageservice.cognitiveservices.azure.com/language/:analyze-text?api-version=2022-05-01";
      var data = {
        kind: "SentimentAnalysis",
        analysisInput: {
          documents: [
              ...request.allTitles
          ]         
        }
      };
      fetch(url, {method: 'POST', body: JSON.stringify(data), headers: {
        'Content-Type': 'application/json',
        'Ocp-apim-subscription-key': 'ef0faf6c308f42b6aacc0acd6aa08fd5'
      }})
      .then(response => {
        response.json().then(data => {
          sendResponse( {message: 'success', data: data});
        });
      })
      .catch(error => console.error('Error:', error));
      return true;
    }

  });