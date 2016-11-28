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
    /* private member*/
    var _info = {};


    //initializer
    _init();


    /* private method*/
    function _init() {
        _info = _getPageInfo();
        _assignEventHandler();
        return;
    }

    function _getPageInfo() {
        var d = document;
        var url = d.querySelector("link[rel='canonical'").href;
        var bbsname = url.match(/^.*open2ch.net\/test\/read.cgi\/(.*)\/[0-9]{10}\//)[1];
        var bbsnameJ = d.getElementsByClassName("thread-box-links")[0].children[0].innerText;
        var suretai = d.title;

        return {
            bbsname: bbsname,
            bbsnameJ: bbsnameJ,
            url: url,
            suretai: suretai
        }
    }

    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender, sendResponse) {

            if (parm.contexts.resabone === "yes") {
                var resobj = _getResObj(document);
                var regexpobj = _getRegExps(parm.dashboard);
                _execResAbone(resobj, regexpobj);
            }

            if (parm.contexts.imgurabone === "yes") {
                _execImgurAbone(document);
            }

            if (parm.contexts.oekaki === "yes") {
                _execOekakiAbone(document);
            }

            return;
        });
        return;
    }

    function _execImgurAbone(d) {
        var imgur = d.getElementsByClassName("group");
        for (var ix = 0, len = imgur.length; ix < len; ix++) {
            imgur[ix].classList.add("ab_imgur");
        }
        return;
    }

    function _execOekakiAbone(d) {
        var oekaki = d.querySelectorAll("a[pid]");
        for (var ix = 0, len = oekaki.length; ix < len; ix++) {
            oekaki[ix].children[0].classList.add("ab_oekaki");
        }
        return;
    }

    function _getResObj(d) {
        var obj = {
            dt: d.querySelectorAll("div.thread  dt"),
            dd: d.querySelectorAll("div.thread  dd"),
            res: []
        };
        obj.res = _parseThread(obj.dt, obj.dd);
        return obj;
    }

    function _parseThread(dt, dd) {
        var arr = [];
        var parse_dt = _parseDT(dt);
        var parse_dd = _parseDD(dd);

        for (var ix = 0, len = parse_dt.length; ix < len; ix++) {
            arr.push({
                name: parse_dt[ix].name,
                mail: parse_dt[ix].mail,
                id: parse_dt[ix].id,
                text: parse_dd[ix]
            });
        }
        return arr;
    }

    function _parseDT(dt) {
        var arr = [];
        var temp1;
        var temp2;
        var dt_regexp1 = new RegExp(/^[0-9]{1,4} ：(.*?) ?：.* ID:(.*$)/);
        var dt_regexp2 = new RegExp(/<a href="mailto:(.*?)">/);
        for (var ix = 0, len = dt.length; ix < len; ix++) {
            temp1 = dt[ix].innerText.match(dt_regexp1);
            temp2 = dt[ix].outerHTML.match(dt_regexp2);
            arr.push({
                name: temp1[1],
                id: temp1[2].replace("(主)", "").replace(" ", "").replace("×", ""),
                mail: temp2 === null ? null : temp2[1]
            });
        }
        return arr;
    }

    function _parseDD(dd) {
        var arr = [];
        var dd_regexp = new RegExp(/  [0-9]*件.*\n$/);
        for (var ix = 0, len = dd.length; ix < len; ix++) {
            arr.push(dd[ix].innerText.replace(dd_regexp, ""));
        }
        return arr;
    }

    function _getRegExps(lists) {
        var isRegExp = lists.enableRegExp_sure;
        var obj = {
            ngids: _generateRegExp(lists.ngids, isRegExp),
            ngmails: _generateRegExp(lists.ngmails, isRegExp),
            ngnames: _generateRegExp(lists.ngnames, isRegExp),
            ngwords: _generateRegExp(lists.ngwords, isRegExp)
        };
        return obj;
    }

    function _generateRegExp(list, isRegExp) {
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

    function _execResAbone(resobj, regexp) {
        var target = resobj.res;
        var target_fix = [];

        var t_name;
        var t_mail;
        var t_id;
        var t_text;

        var isFound = [];


        for (var ix = 0, len = target.length; ix < len; ix++) {
            t_text = target[ix].text;
            isFound.push(regexp.ngwords.some(function(elm) {
                return elm.test(t_text); }));

            t_name = target[ix].name;
            isFound.push(regexp.ngnames.some(function(elm) {
                return elm.test(t_name); }));

            t_mail = target[ix].mail;
            isFound.push(regexp.ngmails.some(function(elm) {
                return elm.test(t_mail); }));

            t_id = target[ix].id;
            isFound.push(regexp.ngids.some(function(elm) {
                return elm.test(t_id); }));

            if (isFound.some(function(elm) {
                    return elm; })) {
                target_fix.push(ix);
            }
            isFound = [];
        }

        var ind;
        for (var ix = 0, len = target_fix.length; ix < len; ix++) {
            ind = target_fix[ix];
            resobj.dd[ind].classList.add("ab_ngres");
            resobj.dt[ind].classList.add("ab_ngres");
        }

        return;
    }

    return _info;
})();