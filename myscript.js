function cleanTxt(text){
  var english = /^[A-Za-z]*$/; //if need Fault Tolerance, just add \s.,!-?"':~   var chinese = /[\u3400-\u9FBF]/;

  if(text.match(english) && text.length > 2 && text.length <= 45){
    //save into local database ie your vacbulary book.
    save(text);
  }
}

function save(word){
  word = word.toLowerCase();
  var data = {
    english:word,
    url:window.location.href,
    status:'unknow',
    count:0,
    fanyi:'',
    time:Date.now()
  }

  chrome.runtime.sendMessage({command: "setItem",data:data}, function(response) {
    console.log(response);
  });


}

var onTextSelect = function(eleContainer) {
    var eleTitle = document.getElementsByTagName("title")[0];
    eleContainer = eleContainer || document;
    var funGetSelectTxt = function() {
        var txt = "";
        if(document.selection) {
            txt = document.selection.createRange().text;    // IE
        } else {
            txt = document.getSelection();
        }
        return txt.toString();
    };
    eleContainer.onmouseup = function(e) {
        e = e || window.event;
        var txt = funGetSelectTxt(), sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var left = (e.clientX - 40 < 0) ? e.clientX + 20 : e.clientX - 40, top = (e.clientY - 40 < 0) ? e.clientY + sh + 20 : e.clientY + sh - 40;
        if (txt) {
            cleanTxt(txt);
        }
    };
};

onTextSelect();
