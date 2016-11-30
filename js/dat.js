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
    var _sureobj;
    var _header;
    var _footer;
    var _form;

    //initializer
    _init();


    //private method
    function _init() {
        var dat_arr = _resolveDAT(document);

        _info = _getPageInfo(dat_arr);
        _sureobj = _getSureObj(dat_arr);

        _header = _generateHeaderHTML(_info);
        _footer = _generateFooterHTML(_info);
        _form = _generateFormHTML(_info);

        _assignEventHandler();
        return;
    }

    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender, sendResponse) {
            var regexp_arr;
            var ng_target = [-1];
            var dat_content;

            if (parm.contexts) {
                if (parm.contexts.resabone === "yes") {
                    regexp_arr = _getRegExps(parm.dashboard);
                    ng_target = _detectNGRes(_sureobj, regexp_arr);
                }
                dat_content = _generateSureHTML(_sureobj, ng_target);
                _replaceSubjectPage(_header, dat_content, _footer, _form);
            }

            if (parm.extracturl === "extracturl") {
                sendResponse({info: _info, data: _sureobj});
            }

            return;
        });
        return;
    }

    function _resolveDAT(d) {
        var arr = d.getElementsByTagName("pre")[0].innerText.split("\n");
        arr.pop();
        return arr;
    }

    function _getPageInfo(arr) {
        var obj = {};
        var suretai = arr[0].match(/^(.*?)<>(.*?)<>(.*?) ID:(.*?)<> (.*?) <>(.*?)$/)[6];
        var lh = location.href.match(/(^.*open2ch.net)\/(.*)\/dat\/([0-9]{10})\.dat/);
        var readcgi = lh[1] + "/test/read.cgi/" + lh[2] + "/" + lh[3] + "/";
        var bbsname = lh[2];

        document.title = suretai;

        obj = {
            suretai: suretai,
            url: readcgi,
            bbsname: bbsname,
            bbsnameJ: null,
        };
        return obj;
    }

    function _getSureObj(arr) {
        var datobj = [];
        var parse;
        var parse_regexp = new RegExp(/^(.*?)<>(.*?)<>(.*?) ID:(.*?)<> (.*?) <>/);
        var b_regexp = new RegExp(/<\/?b>/, "g");

        for (var ix = 0, len = arr.length; ix < len; ix++) {
            parse = arr[ix].match(parse_regexp);
            if (parse) {
                datobj.push({
                    name: parse[1].trim().replace(b_regexp, ""),
                    mail: parse[2],
                    timestamp: parse[3],
                    id: parse[4],
                    text: parse[5]
                });
            } else {
                datobj.push({
                    name: "あぼーん",
                    mail: "あぼーん",
                    timestamp: "あぼーん",
                    id: "あぼーん",
                    text: "あぼーん"
                });
            }
        }

        return datobj;
    }

    function _generateHeaderHTML(info) {
        var header = "";
        var origin = location.origin;
        var pathname = location.pathname;
        var surekey = pathname.match(/[0-9]{10}/)[0];
        var bbsname = pathname.match(/^\/(.*?)\//)[1];
        var suretai = info.suretai

        var readcgi = origin + "/test/read.cgi/" + bbsname + "/" + surekey + "/";
        var imagecgi = origin + "/test/image.cgi/" + bbsname + "/" + surekey + "/";
        var matomeru = "https://2mtmex.com/?url=" + readcgi;
        var itatop = origin + "/" + bbsname + "/";
        var subject = itatop + "subject.txt";
        var subback = itatop + "subback.html";
        var bbsmenu = "http://open2ch.net/bbsmenu.html";
        var rireki = "http://open2ch.net/test/history.cgi";

        header += "<a href='" + bbsmenu + "'>BBSMENU</a><br>";
        header += "<a href='" + itatop + "'>板に戻る</a>";
        header += "<a href='" + rireki + "'>履歴</a>";
        header += "<a href='" + subback + "'>スレッド一覧</a>";
        header += "<a href='" + subject + "'>スレッド一覧(大漁)</a>";
        header += "<a href='" + readcgi + "l50'>read.cgi</a>";
        header += "<a href='#bottom'>↓</a><a name='top'></a><br>";
        header += "<a href='" + matomeru + "'>まとめる</a>";
        header += "<a href='" + imagecgi + "'>画像一覧</a>";
        header += "<hr>";
        header += "<h3 id='suretai'>" + suretai + "</h3>";

        return header;
    }

    function _generateFooterHTML() {
        var footer = "";

        var origin = location.origin;
        var pathname = location.pathname;
        var surekey = pathname.match(/[0-9]{10}/)[0];
        var bbsname = pathname.match(/^\/(.*?)\//)[1];

        var readcgi = origin + "/test/read.cgi/" + bbsname + "/" + surekey + "/";
        var imagecgi = origin + "/test/image.cgi/" + bbsname + "/" + surekey + "/";
        var matomeru = "https://2mtmex.com/?url=" + readcgi;
        var itatop = origin + "/" + bbsname + "/";
        var subject = itatop + "subject.txt";
        var subback = itatop + "subback.html";
        var bbsmenu = "http://open2ch.net/bbsmenu.html";
        var rireki = "http://open2ch.net/test/history.cgi";

        footer += "<hr>";
        footer += "<a href='" + bbsmenu + "'>BBSMENU</a><br>";
        footer += "<a href='" + itatop + "'>板に戻る</a>";
        footer += "<a href='" + rireki + "'>履歴</a>";
        footer += "<a href='" + subback + "'>スレッド一覧</a>";
        footer += "<a href='" + subject + "'>スレッド一覧(大漁)</a>";
        footer += "<a href='" + readcgi + "l50'>read.cgi</a>";
        footer += "<a href='#top'>↑</a><a name='bottom'></a><br>";
        footer += "<a href='" + matomeru + "'>まとめる</a>";
        footer += "<a href='" + imagecgi + "'>画像一覧</a>";

        return footer;
    }

    function _generateFormHTML(info) {
        var phorm = "";
        var pathname = location.pathname;
        var surekey = pathname.match(/[0-9]{10}/)[0];
        var bbsname = pathname.match(/^\/(.*?)\//)[1];

        phorm += "<form method='POST' action='/test/bbs.cgi?guid=ON' id='form2' style='margin-top:5pt'>";
        phorm += "<input type='submit' value='書き込む' name='submit' id='submit_button'></input> ";
        phorm += "名前：" + "<input size='10' id='FROM' NAME='FROM'></input> ";
        phorm += "mail：" + "<input size='10' id='mail' name='mail'></input><br>";
        phorm += "<textarea rows='5' cols='56' id='MESSAGE' name='MESSAGE'></textarea>";
        phorm += "<input type='hidden' name='bbs' value='" + bbsname + "'>";
        phorm += "<input type='hidden' name='key' value='" + surekey + "'>";
        phorm += "<input type='hidden' name='time' value='" + Math.floor(Date.now() / 1000) + "'>";
        phorm += "</form>";

        return phorm;
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
            return elm !== "";
        });

        if (isRegExp === "yes") {
            arr = temp2.map(function(elm) {
                elm = _replaceSC(elm);
                return new RegExp(elm);
            });
        } else {
            arr = temp2.map(function(elm) {
                var str = elm.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
                str = _replaceSC(str);
                return new RegExp(str);
            });
        }

        return arr;
    }

    function _replaceSC(str) {
        //note: SC stands for Special Character
        //note: NGキーワードに入力した特定の文字を、HTML文字実体参照に変換する
        var reply = str.replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/\\n/g, "<br>")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

        return reply;
    }

    function _detectNGRes(resobj, regexp) {
        var target = resobj;
        var target_fix = [];

        var t_name;
        var t_mail;
        var t_id;
        var t_text;

        var isFound = [];


        for (var ix = 0, len = target.length; ix < len; ix++) {
            t_text = target[ix].text;
            isFound.push(regexp.ngwords.some(function(elm) {
                return elm.test(t_text);
            }));

            t_name = target[ix].name;
            isFound.push(regexp.ngnames.some(function(elm) {
                return elm.test(t_name);
            }));

            t_mail = target[ix].mail;
            isFound.push(regexp.ngmails.some(function(elm) {
                return elm.test(t_mail);
            }));

            t_id = target[ix].id;
            isFound.push(regexp.ngids.some(function(elm) {
                return elm.test(t_id);
            }));

            if (isFound.some(function(elm) {
                    return elm;
                })) {
                target_fix.push(ix);
            }
            isFound = [];
        }

        return target_fix;
    }


    function _generateSureHTML(obj, ng_target) {
        var arr = [];
        var str;
        var extra;

        var anka_regexp = new RegExp(/&gt;&gt;([0-9]{1,4})/, "g");
        var url_regexp = new RegExp(/https?:\/\/[a-zA-Z0-9-_.:@!~*';\/?&=+$,%#]+/, "g");
        var text_temp;


        arr = obj.map(function(elm, ind) {
            extra = elm.timestamp === "あぼーん" ? " broken" : "";
            extra = ng_target.indexOf(ind) > -1 ? " ab_ngres" : "";

            str = "<div class='res" + extra + "'>";
            str += "<div class='reshead" + extra + "'>";
            str += "<a name='" + (ind + 1) + "' class='resnum" + extra + "'>" + (ind + 1) + "</a>";
            str += "<span class='name" + extra + "'>" + elm.name + "</span>";
            str += "<span class='mail" + extra + "'>" + elm.mail + "</span>";
            str += "<span class='timestamp" + extra + "'>" + elm.timestamp + "</span>";
            str += "<span class='id" + extra + "'>" + elm.id + "</span>";
            str += "</div>";
            text_temp = elm.text.replace(anka_regexp, "<a href='#$1'>$&</a>").replace(url_regexp, "<a href='$&' target='_blank'>$&</a>");
            str += "<div class='resbody" + extra + "'>" + text_temp + "</div>";
            str += "</div>";

            return str;
        });

        return arr.join("");
    }

    function _replaceSubjectPage(header, dat_content, footer, form) {
        var bodyinner = "";
        bodyinner += "<div class='header'>" + header + "</div>";
        bodyinner += "<div class='thread'>" + dat_content + "</div>";
        bodyinner += "<div class='footer'>" + footer + "</div>";
        bodyinner += "<div class='form'>" + form + "</div>";

        document.body.innerHTML = bodyinner;

        return;
    }

    return _info;
})();