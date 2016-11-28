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


    //initializer
    _init();


    //private method
    function _init() {
        _info = _getPageInfo();
        _suretaiobj = _getSuretaiObj(document);
        _assignEventHandler();
        return;
    }

    function _getPageInfo() {
        var d = document;
        var url = "http://" + location.host + location.pathname;
        var bbsname = location.pathname.match("\/(.*?)\/")[1];
        var bbsname_temp = d.getElementsByTagName("h1")[0].innerText;
        var bbsnameJ = bbsname_temp.substr(0, bbsname_temp.lastIndexOf("＠おーぷん２ちゃんねる"));

        return {
            url: url,
            bbsname: bbsname,
            bbsnameJ: bbsnameJ
        }
    }

    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender, sendResponse) {
            var regexp_arr;
            var itatop_content;

            if (parm.contexts.suretaiabone === "yes") {
                regexp_arr = _getRegExps(parm.dashboard.ngsuretai, parm.dashboard.enableRegExp_suretai);
                itatop_content = _execSuretaiAbone(_suretaiobj, regexp_arr);
            } else {
                itatop_content = _generateContent(_suretaiobj, _info);
            }

            _replaceItatopPage(document, itatop_content);

        });
        return;
    }

    function _getSuretaiObj(d) {
        var arr = [];
        var suretais = d.querySelectorAll("td#topThreads > font > a");
        arr_temp = _parseSuretai(suretais);
        arr = _addSuretate(arr_temp);
        return arr;
    }

    function _parseSuretai(obj) {
        var arr = [];

        for (var ix = 0, len = obj.length; ix < len; ix++) {
            if (ix < 18 && ix % 2 === 0) {
                arr.push({
                    suretai: obj[ix + 1].childNodes[0].textContent,
                    resamount: obj[ix + 1].childNodes[1].textContent.replace(/[() ]/g, "") - 0,
                    url: obj[ix].href,
                    suretate: null
                });
            } else if (ix >= 18) {
                arr.push({
                    suretai: obj[ix].childNodes[1].textContent,
                    resamount: obj[ix].childNodes[2].textContent.replace(/[() ]/g, "") - 0,
                    url: obj[ix].href,
                    suretate: null
                });
            }
        }
        return arr;
    }

    function _addSuretate(obj) {
        for (var ix = 0, len = obj.length; ix < len; ix++) {
            obj[ix].suretate = _getSuretateDate(obj[ix].url.match(/[0-9]{10}/) - 0);
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
            return elm !== ""; });

        if (isRegExp === "yes") {
            arr = temp2.map(function(elm) {
                return new RegExp(elm); });
        } else {
            arr = temp2.map(function(elm) {
                var str = elm.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
                return new RegExp(str);
            });
        }
        return arr;
    }

    function _execSuretaiAbone(obj, regexp) {
        var target_list = [];
        var new_topThreads = [];
        var str;
        var extra;

        for (var ix = 0, len = obj.length; ix < len; ix++) {
            if (regexp.some(function(elm) {
                    return elm.test(obj[ix].suretai); })) {
                target_list.push(ix);
            }
        }

        for (var ix = 0, len = obj.length; ix < len; ix++) {
            extra = target_list.indexOf(ix) > -1 ? "class='ab_ngsuretai'" : "";
            str = "<a href='" + obj[ix].url + "' " + extra + ">";
            str += "<span class='ab_order'>" + (ix + 1) + "</span>";
            str += "<span class='ab_suretate'>" + obj[ix].suretate + "</span>";
            str += "<t>" + obj[ix].suretai + "</t>";
            str += "<span class='ab_resamount'>" + obj[ix].resamount + "</span>";
            str += "</a>";

            new_topThreads.push(str);
        }

        return new_topThreads.join("");
    }

    function _generateContent(arr, info) {
        var arrmap = [];
        var str;
        var host = location.host;
        arrmap = arr.map(function(elm, ind) {
            str = "<a href='" + elm.url + "'>";
            str += "<span class='ab_order'>" + (ind + 1) + "</span>";
            str += "<span class='ab_suretate'>" + elm.suretate + "</span>";
            str += elm.suretai;
            str += "<span class='ab_resamount'>" + elm.resamount + "</span></a>";

            return str;
        });

        return arrmap.join("");
    }

    function _replaceItatopPage(d, content) {
        var topThreads = d.querySelector("td#topThreads > font");
        topThreads.innerHTML = content;
    }


    //public api
    return _info;
})();