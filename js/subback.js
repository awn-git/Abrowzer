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
    //private member
    var _info = {};
    var _suretaiobj;
    var _header;


    //initializer
    _init();


    //private method
    function _init() {
        _info = _getPageInfo();
        _suretaiobj = _getSuretaiObj(document);
        _header = _generateHeaderHTML(_info);
        _assignEventHandler();
        return;
    }

    function _getPageInfo() {
        var d = document;
        var url = location.href;
        var bbsname = location.pathname.match("\/(.*?)\/")[1];
        var bbsname_temp = d.title;
        var bbsnameJ = bbsname_temp.substr(0, bbsname_temp.lastIndexOf("＠スレッド一覧"));

        return {
            url: url,
            bbsname: bbsname,
            bbsnameJ: bbsnameJ
        }
    }

    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender, sendResponse) {
            var regexp_arr;
            var subback_content;

            if (parm.contexts.suretaiabone === "yes") {
                regexp_arr = _getRegExps(parm.dashboard.ngsuretai, parm.dashboard.enableRegExp_suretai);
                subback_content = _execSuretaiAbone(_suretaiobj, regexp_arr, _info);
            } else {
                subback_content = _generateContent(_suretaiobj, _info);
            }

            _replaceSubbackPage(document, _header, subback_content);
            return;
        });
        return;
    }

    function _getSuretaiObj(d) {
        var arr = [];
        var suretais = d.querySelectorAll("small#trad > a");
        var arr_temp = _parseSuretai(suretais);
        arr = _addSuretate(arr_temp);
        return arr;
    }

    function _parseSuretai(obj) {
        var arr = [];
        var str;
        for (var ix = 0, len = obj.length; ix < len; ix++) {
            str = obj[ix].innerText.match(/^[0-9]{1,4}: (.*?) \(([0-9]{1,4})\)$/);
            //note: スレタイが空文字列の時にmatchしないので例外処理で対処する
            //note: 例外処理に於いては、スレタイは空文字列のままでpushする
            //see:  https://github.com/awn-git/Abrowzer/issues/22
            try {
                arr.push({
                    suretai: str[1],
                    resamount: str[2] - 0,
                    key: obj[ix].href.match(/[0-9]{10}/) - 0,
                    suretate: null
                });
            } catch (e) {
                console.log(e);
                console.log("ix: ", ix);
                console.log("obj[ix]: ", obj[ix]);
                str = obj[ix].innerText.match(/^[0-9]{1,4}:(.*?)\(([0-9]{1,4})\)$/);
                arr.push({
                    suretai: str[1],
                    resamount: str[2] - 0,
                    key: obj[ix].href.match(/[0-9]{10}/) - 0,
                    suretate: null
                });
            }
        }
        return arr;
    }

    function _addSuretate(obj) {
        for (var ix = 0, len = obj.length; ix < len; ix++) {
            obj[ix].suretate = _getSuretateDate(obj[ix].key - 0);
        }
        return obj;
    }

    function _getSuretateDate(input) {
        var timestamp = input * 1000;
        var p = new Date(timestamp);
        var rtn = p.getFullYear() + "/" + ("0" + (p.getMonth() + 1)).substr(-2, 2) + "/" + ("0" + p.getDate()).substr(-2, 2) + " " + ("0" + p.getHours()).substr(-2, 2) + ":" + ("0" + p.getMinutes()).substr(-2, 2) + ":" + ("0" + p.getSeconds()).substr(-2, 2);
        return rtn;
    }

    function _getRegExps(list, isRegExp) {
        var arr = [];
        var temp1 = list.split("\n");
        var temp2 = temp1.filter(function(elm) {
            return elm !== "";
        });

        if (isRegExp === "yes") {
            arr = temp2.map(function(elm) {
                return new RegExp(elm);
            });
        } else {
            arr = temp2.map(function(elm) {
                var str = elm.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
                return new RegExp(str);
            });
        }
        return arr;
    }

    function _execSuretaiAbone(obj, regexp, info) {
        var target_list = [];
        var new_sures = [];
        var str;
        var extra;
        var host = "http://" + location.host;

        for (var ix = 0, len = obj.length; ix < len; ix++) {
            if (regexp.some(function(elm) {
                    return elm.test(obj[ix].suretai);
                })) {
                target_list.push(ix);
            }
        }

        for (var ix = 0, len = obj.length; ix < len; ix++) {
            extra = target_list.indexOf(ix) > -1 ? "class='ab_ngsuretai'" : "";
            str = "<a href='" + host + "/test/read.cgi/" + info.bbsname + "/" + obj[ix].key + "/l50'" + extra + ">";
            str += "<span class='ab_order'>" + (ix + 1) + "</span>";
            str += "<span class='ab_suretate'>" + obj[ix].suretate + "</span>";
            str += obj[ix].suretai;
            str += "<span class='ab_resamount'>" + obj[ix].resamount + "</span>";
            str += "</a>";

            new_sures.push(str);
        }

        return new_sures.join("");
    }

    function _generateContent(arr, info) {
        var arrmap = [];
        var str;
        var host = "http://" + location.host;
        arrmap = arr.map(function(elm, ind) {
            str = "<a href='" + host + "/test/read.cgi/" + info.bbsname + "/" + elm.key + "/l50'>";
            str += "<span class='ab_order'>" + (ind + 1) + "</span>";
            str += "<span class='ab_suretate'>" + elm.suretate + "</span>";
            str += elm.suretai;
            str += "<span class='ab_resamount'>" + elm.resamount + "</span></a>";

            return str;
        });

        return arrmap.join("");
    }

    function _generateHeaderHTML(info) {
        var header = "";
        header += "<a href='http://menu.open2ch.net/bbsmenu.html'>★BBSMENU</a><br>";
        header += "<a href=/" + info.bbsname + "/>■板に戻る</a><a href='http://open2ch.net/test/history.cgi'>履歴</a><a href=/" + info.bbsname + "/subject.txt>★スレッド一覧(大漁)</a><a href=/" + info.bbsname + "/kako/>★過去ログ</a><a href=/" + info.bbsname + "/gomi.html >★ごみ箱(仮)</a>";
        header += "<h3>" + info.bbsnameJ + "</h3><hr>";
        return header;
    }

    function _replaceSubbackPage(d, header, content) {
        var bodyinner = "";
        bodyinner += "<div class=header>" + header + "</div>";
        bodyinner += "<div class=thread>" + content + "</div>";

        d.body.innerHTML = bodyinner;
        return;
    }



    //public api
    return _info;
})();