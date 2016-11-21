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
    var _topThreads;
    var _suretaiaboned;


    //init
    _init();


    //method
    function _init() {
        _info = _getPageInfo();
        _topThreads = document.getElementById("topThreads").childNodes[1];
        _sures = _trimThreads();
        _assignEventHandler();
        return;
    }


    function _getPageInfo() {
        var _url = location.href;
        var _bbsname = location.pathname.split("/")[1];
        var _bbsnameJ = document.getElementsByTagName("h1")[0].innerText.split("＠")[0];

        return {
            url: _url,
            bbsname: _bbsname,
            bbsnameJ: _bbsnameJ
        }
    }


    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender, sendResponse) {

            if (parm.suretaiabone === "yes") {
                _suretaiaboned = _doSuretaiAbone(parm.ngsuretai,parm.ngsuretairegexp);
            } else {
                _suretaiaboned = _sures;
            }
            if (parm.suretaiabone === "yes" || parm.suretaikaigyou === "yes") {
                _replaceTopThreads(parm.suretaikaigyou);
            }
        });
        return;
    }


    function _replaceTopThreads(kaigyou) {
        var _tail = kaigyou === "yes" ? "<br>" : "　";
        var str;
        var output = _suretaiaboned.map(function(elm) {
            str = "<a href='" + elm.url + "'target='body'><t>" + elm.order + elm.suretai + "</t>" + elm.resamount + "</a>";
            str += _tail;
            return str;
        });
        _topThreads.innerHTML = output.join("");
        return;
    }


    function _trimThreads() {
        var d = _topThreads.children;
        var output = [];

        for (var ix = 0, len = d.length; ix < len; ix++) {
            if (ix < 18 && ix % 2 === 0) {
                output.push({
                    order : d[ix].childNodes[0].textContent,
                    suretai: d[ix + 1].childNodes[0].innerText,
                    resamount: d[ix + 1].childNodes[1].textContent,
                    url: d[ix].getAttribute("href")
                });
            } else if (ix >= 18) {
                output.push({
                    order : d[ix].childNodes[0].textContent,
                    suretai: d[ix].childNodes[1].innerText,
                    resamount:d[ix].childNodes[2].textContent,
                    url: d[ix].getAttribute("href")
                });
            }
        }
        return output;
    }


    function _getSuretateDate(input) {
        //surekeyをスレ立て日時に変換する
        var timestamp = input * 1000;
        var p = new Date(timestamp);
        var rtn = p.getFullYear() + "/" + ("0" + (p.getMonth() + 1)).substr(-2, 2) + "/" + ("0" + p.getDate()).substr(-2, 2) + " " + ("0" + p.getHours()).substr(-2, 2) + ":" + ("0" + p.getMinutes()).substr(-2, 2) + ":" + ("0" + p.getSeconds()).substr(-2, 2);
        return rtn;
    }


    function _doSuretaiAbone(list,isRegExp) {
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

    return _info;
})();