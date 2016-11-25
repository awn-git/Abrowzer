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
    var d = document;


    //init
    init();


    //method
    function init() {
        listenMessage();
        return;
    }

    function listenMessage() {
        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            if (message.download) {
                execDownload(message.download);
            }
        });
        return;
    }

    function removeResultPage() {
        chrome.tabs.query({ title: "Abrowzer::Result" }, function(query) {
            chrome.tabs.onActivated.addListener(function(activeInfo) {
                if (activeInfo.tabId !== query[0].id) {
                    chrome.tabs.remove(query[0].id);
                }
            });
        });
        return;
    }

    function execDownload(obj) {
        d.getElementById("h1").innerText = "「" + obj.suretai + "」スレ の画像URL";
        var result = d.getElementById("result");

        if (obj.images.length === 0) {
            alert("このスレには画像は貼られていないようだ。。");
            result.innerHTML = "<p>このスレには画像は貼られていないようだ。。</p>";
            removeResultPage();
            return;
        }

        var imagelist = obj.images.map(function(elm) {
            return "<li>" + elm + "</li>";
        });
        result.innerHTML = "<ol>" + imagelist.join("") + "</ol>"

        var fileurl;
        var filename;
        var filepath;
        if (confirm("大量のダウンロードにはリスクが伴います。\nそれでもあなたはダウンロードを実行しますか？")) {
            var timestamp = (new Date().getFullYear()) + "" + ("0" + (new Date().getMonth() + 1) ).substr(-2) + "" + ("0" + new Date().getDate()).substr(-2) + "_" + ("0" + new Date().getHours()).substr(-2) + "" + ("0" + new Date().getMinutes()).substr(-2) + "" + ("0" + new Date().getSeconds()).substr(-2) + "_" + ("000" + new Date().getMilliseconds()).substr(-3);

            var message = "ダウンロード先のフォルダ名を入力してください。\n";
            message += "- 未入力で[OK]を押した場合は、\n";
            message += "- フォルダ名が「" + timestamp + "」になります。\n";
            message += "- [キャンセル]を押した場合は、\n";
            message += "- ダウンロードを中止します。";

            var path = prompt(message);
            if(path === null){
                alert("ダウンロードを中止しました。");
                removeResultPage();
                return;
            }

            path = path.trim();
            path = path === "" ? timestamp : path; 

            for (var ix = 0, len = obj.images.length; ix < len; ix++) {
                fileurl = obj.images[ix];
                filename = fileurl.substr(fileurl.lastIndexOf("/") + 1);
                filepath = path + "/" + filename;

                chrome.downloads.download({
                    url: fileurl,
                    filename: filepath,
                    conflictAction: "uniquify",
                    saveAs: false
                });
            }
            chrome.downloads.showDefaultFolder();
        } else {
            alert("ダウンロードを中止しました。");
        }
        removeResultPage();
        return;
    }

    //API
    return;

})();