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
                assignIncrementalSearch();
            }

            if (message.extracturl) {
                showURLs(message.extracturl);
                assignIncrementalSearch();
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
        d.getElementById("h1").innerText = "画像URL";
        var result = d.getElementById("result");

        if (obj.images.length === 0) {
            alert("このスレには画像は貼られていないようだ。。");
            result.innerHTML = "<p>このスレには画像は貼られていないようだ。。</p>";
            removeResultPage();
            return;
        }

        //note: div_incはデフォルト非表示 -> remove("dontwant")で非表示解除
        var div_inc = d.getElementById("inc");
        div_inc.classList.remove("dontwant");

        var imagelist = obj.images.map(function(elm) {
            return "<li>" + "<a href='" + elm + "' target='_blank'>" + elm + "</a></li>"
        });

        var ul_elm = "<ul>" + imagelist.join("") + "</ul>";
        var info = "<h2>参照元：<a href='" + obj.url + "' target='_blank'>" + obj.suretai + "</a></h2>";

        result.innerHTML = "<div id='info'>" + info + "</div><hr><div id='data'>" + ul_elm + "</div><hr>";

        var fileurl;
        var filename;
        var filepath;
        if (confirm("大量のダウンロードにはリスクが伴います。\n\nいかなるリスクも自己責任を覚悟の上で、\n\nダウンロードを実行しますか？")) {
            var timestamp = (new Date().getFullYear()) + "" + ("0" + (new Date().getMonth() + 1)).substr(-2) + "" + ("0" + new Date().getDate()).substr(-2) + "_" + ("0" + new Date().getHours()).substr(-2) + "" + ("0" + new Date().getMinutes()).substr(-2) + "" + ("0" + new Date().getSeconds()).substr(-2) + "_" + ("000" + new Date().getMilliseconds()).substr(-3);

            var message = "ダウンロード先のフォルダ名を入力してください。\n";
            message += "- 未入力で[OK]を押した場合は、\n";
            message += "- フォルダ名が「" + timestamp + "」になります。\n";
            message += "- [キャンセル]を押した場合は、\n";
            message += "- ダウンロードを中止します。";

            var path = prompt(message);
            if (path === null) {
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
            removeResultPage();
        }

        return;
    }

    function findURLstring(obj) {
        var arr = [];
        var matches;
        var url_regexp = new RegExp(/https?:\/\/[a-zA-Z0-9-_.:@!~*;\/?&=+$,%#]+/, "g");

        for (var ix = 0, len = obj.length; ix < len; ix++) {
            matches = obj[ix].text.match(url_regexp);
            if (matches) {
                if (Array.isArray(matches)) {
                    for (var ixx = 0, lenx = matches.length; ixx < lenx; ixx++) {
                        arr.push(matches[ixx]);
                    }
                } else {
                    arr.push(matches);
                }
            }
        }

        return arr;
    }

    function filterURLstring(url_arr) {
        var arr = [];

        //note: 重複除外
        arr = url_arr.filter(function(elm, ind, arr) {
            return arr.indexOf(elm) === ind;
        });

        //note: ユーザーが投稿していない(と思われる)URLは除外する
        //note: imgur画像のうちサムネイル表示用のURLは除外する
        var excepts = [
            /\/\/i\.imgur\.com\/.{7}s\.*/,
            /image\.open2ch\.net\/image\/blank.gif/,
            /\/\/open\.open2ch\.net\/image\/.*/,
            /img\.youtube\.com\/.*/
        ];

        arr = arr.filter(function(elm) {
            return !excepts.some(function(inelm) {
                return inelm.test(elm);
            });
        });

        return arr;
    }

    function showURLs(obj) {
        var url_found = [];
        var url_collects = [];
        url_found = findURLstring(obj.data);
        url_filtered = filterURLstring(url_found);


        if (url_filtered.length === 0) {
            alert("URLが一つも貼られてないみたい。。");
            removeResultPage();
            return;
        }

        //note: div_incはデフォルト非表示 -> remove("dontwant")で非表示解除
        var div_inc = d.getElementById("inc");
        div_inc.classList.remove("dontwant");

        var lists;
        var lists = url_filtered.map(function(elm) {
            return "<li>" + "<a href='" + elm + "' target='_blank'>" + elm + "</a></li>";
        });

        var info = "<h2>参照元：【" + obj.info.bbsname + "】<a href='" + obj.info.url + "l50' target='_blank'>" + obj.info.suretai + "</a></h2>";
        var ul_elm = "<ul>" + lists.join("") + "</ul>";
        d.getElementById("result").innerHTML = "<div id='info'>" + info + "</div><hr>" + "<div id='data'>" + ul_elm + "</div><hr>";
        d.getElementById("h1").innerText = "URL抽出結果";
        return;
    }

    function assignIncrementalSearch() {
        var list_node = d.querySelectorAll("div#result li");
        var list_data = [];
        for (var ix = 0, len = list_node.length; ix < len; ix++) {
            list_data.push(list_node[ix].innerText);
        }

        var elm = d.getElementById("inc_input");
        var input_data;
        var regexp;

        elm.addEventListener("keyup", function() {
            input_data = elm.value;
            regexp = new RegExp(input_data, "i");

            for (var ix = 0, len = list_node.length; ix < len; ix++) {
                if (regexp.test(list_data[ix])) {
                    list_node[ix].classList.remove("dontwant");
                } else {
                    list_node[ix].classList.add("dontwant");
                }
            }
            return;
        });
        return;
    }


    //API
    return;

})();