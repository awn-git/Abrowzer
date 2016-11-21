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
    var _info = {};
    var _sures;
    var _suretaiaboned;

    //init
    _init();

    //method
    function _init() {
        _info = _getPageInfo();
        _assignEventHandler();
        _sures = _trimThreads();
        return;
    }

    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender, sendResponse) {

            if (parm.suretaiabone === "yes") {
                _suretaiaboned = _doSuretaiAbone(parm.ngsuretai, parm.ngsuretairegexp);
            } else {
                _suretaiaboned = _sures;
            }
            _addLinks();
            _replaceTopThreads();

        });
        return;
    }

    function _getPageInfo() {
        var _url = location.href;
        var _bbsname = location.pathname.split("/")[1];
        var _bbsnameJ = document.title.split("＠")[0];

        return {
            url: _url,
            bbsname: _bbsname,
            bbsnameJ: _bbsnameJ
        }
    }

    function _trimThreads() {
        var d = document.querySelectorAll("a");
        var output = [];
        var temp;
        for (var ix = 0, len = d.length; ix < len; ix++) {
            temp = d[ix].innerText;
            output.push({
                order: temp.match(/^[0-9].*: /)[0],
                suretai: temp.match(/^.*: (.*) \([0-9].*\)$/) === null ? "" : temp.match(/^.*: (.*) \([0-9].*\)$/)[1],
                resamount: temp.match(/ \([0-9].*\)$/)[0],
                url: d[ix].getAttribute("href")
            });
        }
        return output;
    }

    function _doSuretaiAbone(list, isRegExp) {
        //改行で分割 -> 配列
        nglist = list.split("\n");

        //空白除去
        nglist = nglist.filter(function(elm) {
            return elm !== "";
        });

        //正規表現化
        if (isRegExp === "yes") {
            var ngregs = nglist.map(function(elm) {
                return new RegExp(elm);
            });

        } else {
            var ngregs = nglist.map(function(elm) {
                var str = elm.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
                return new RegExp(str);
            });
        }

        //正規表現を適用する
        var output = _sures.filter(function(elm) {
            return !ngregs.some(function(inelm) {
                return inelm.test(elm.suretai);
            });
        });

        return output;
    }

    function _replaceTopThreads() {
        var str;
        var output = _suretaiaboned.map(function(elm) {
            str = "<a href='" + elm.url + "'target='body'><t>" + elm.order + elm.suretai + "</t>" + elm.resamount + "</a>";
            return str;
        });
        document.querySelector("small#trad").innerHTML = output.join("");

        return;
    }

    function _addLinks() {
        var _newdiv = document.createElement("div");

        _newdiv.classList.add("header");
        var header = "";
        header += "<a href='http://menu.open2ch.net/bbsmenu.html'>★BBSMENUに戻る</a><br>";
        header += "<a href=/" + _info.bbsname + "/>■板に戻る</a><a href='http://open2ch.net/test/history.cgi'>履歴に戻る</a><a href=/" + _info.bbsname + "/kako/>★過去ログ</a><a href=/" + _info.bbsname + "/gomi.html >★ごみ箱(仮)</a>";
        header += "<h3>" + _info.bbsnameJ + "</h3><hr>";

        _newdiv.innerHTML += header;

        var _div = document.getElementsByTagName("div")[0];
        var _small = document.getElementById("trad");
        _div.insertBefore(_newdiv, _small);

        return;
    }

    return {
        info: _info
    };
})();