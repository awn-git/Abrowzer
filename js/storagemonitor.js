////////////////////////////////////////////////////////////////////////////////
//                                                                               
//              ,,                                                               
//      db     *MM                                                               
//     ;MM:     MM                                                               
//    ,V^MM.    MM,dMMb.`7Mb,od8 ,pW"Wq.`7M'    ,A    `MF'M"""MMV .gP"Ya `7Mb,od8
//   ,M  `MM    MM    `Mb MM' "'6W'   `Wb VA   ,VAA   ,V  '  AMV ,M'   Yb  MM' "'
//   AbmmmqMA   MM     M8 MM    8M     M8  VA ,V  VA ,V     AMV  8M""""""  MM    
//  A'     VML  MM.   ,M9 MM    YA.   ,A9   VVV    VVV     AMV  ,YM.    ,  MM    
//.AMA.   .AMMA.P^YbmdP'.JMML.   `Ybmd9'     W      W     AMMmmmM `Mbmmd'.JMML.  
////////////////////////////////////////////////////////////////////////////////


(function() {
    //member
    var info = {};
    var mystorage;


    //initializer
    init();


    //method
    function init() {
        getChromeLocalStorage(showStorage);
        reloader();
        deleteButton();
        return;
    }

    function getChromeLocalStorage(func) {
        chrome.storage.local.get(function(parm) {
            console.dir(parm);
            func(parm);
        });
    }

    function showStorage(parm) {
        var text = JSON.stringify(parm);
        var str = "<h2>last update: " + new Date().toString() + "</h2>";
        str += text.replace(/{/g, "{<br>").replace(/}/g, "}<br>").replace(/,/g, ",<br>");
        document.getElementById("storage").innerHTML = str;
    }

    function reloader() {
        chrome.storage.onChanged.addListener(function(parm) {
            location.reload();
            return;
        });
    }

    function deleteButton() {
        var elm = document.getElementById("deletebutton");
        elm.addEventListener("click", function() {
            if (confirm("ストレージの中身を消しますか？")) {
                chrome.storage.local.get(function(parm) {
                    for (var key in parm) {
                        chrome.storage.local.remove(key);
                    }
                });
            }
            return;
        });
        return;
    }


    //API
    return;

})();