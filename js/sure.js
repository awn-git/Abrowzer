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
    //init関数
    function _init() {
        _info = _getPageInfo();
        _assignEventHandler();
        return;
    }


    //スレのurlや板名を取得する
    function _getPageInfo() {
        var _url = document.querySelector("link[rel='canonical'").href;
        var _bbsname = _url.split("/")[5];
        var _dthreadboxlinks = document.getElementsByClassName("thread-box-links");
        var _suretai = document.title;

        return {
            bbsname: _bbsname,
            bbsnameJ: _dthreadboxlinks[0].childNodes[1].innerText,
            url: _url,
            suretai: _suretai
        }
    }


    //Messageに応じて処理を実行する
    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender, sendResponse) {
            if (parm.abonetype !== "no") {
                _doNGs(parm);
            }
            if (parm.imgurabone === "yes") {
                _doImgurInvisible();
            }
            if (parm.oekakiabone === "yes") {
                _doOekakiInvisible();
            }
            if (parm.imgurabone === "normal") {
                _doImgurNormalAbone();
            }
            if (parm.oekakiabone === "normal") {
                _doOekakiNormalAbone();
            }
            return;
        });
        return;
    }


    //imgur画像のみを非表示にする
    function _doImgurInvisible() {
        var imgur = document.getElementsByClassName("group");
        var len = imgur.length;
        for (var ix = 0; ix < len; ix++) {
            imgur[ix].setAttribute("style", "display:none");
        }
        return;
    }


    //お絵描き画像のみを非表示にする
    function _doOekakiInvisible() {
        var _oekaki = document.querySelectorAll("a[pid]");
        var len = _oekaki.length;
        for (var ix = 0; ix < len; ix++) {
            _oekaki[ix].childNodes[0].setAttribute("style", "display:none");
        }
        return;
    }


    //imgur画像の含まれるレスを通常あぼーんする
    function _doImgurNormalAbone() {
        var _path = _info.url;
        _path = _path.substr(_path.indexOf("/test/"));
        var imgur = document.querySelectorAll(".group");
        var dd;
        var dt;
        var resnum;

        for (var ix = 0, len = imgur.length; ix < len; ix++) {
            if (dd = imgur[ix].parentElement) {
                dt = dd.previousElementSibling;
                resnum = dt.children[0].getAttribute("val") - 0;

                dt.classList.add("Abrowzered");
                dt.innerHTML = resnum + " ：" + "<font color='#1c740d'><b>あぼ〜ん</b></font>";
                dd.innerHTML = "<span class='ank'><a rel='nofollow' target='_blank' href=" + _path + resnum + " class='anked'>[元のレス]</a></span>";
            }
        }
        return;
    }


    //お絵描き画像の含まれるレスを通常あぼーんする
    function _doOekakiNormalAbone() {
        var _path = _info.url;
        _path = _path.substr(_path.indexOf("/test/"));
        var oekaki = document.querySelectorAll("a[pid]");
        var dd;
        var dt;
        var resnum;

        for (var ix = 0, len = oekaki.length; ix < len; ix++) {
            if (dd = oekaki[ix].parentElement) {
                dt = dd.previousSibling;
                resnum = oekaki[ix].getAttribute("resnum");

                dt.classList.add("Abrowzered");
                dt.innerHTML = resnum + " ：" + "<font color='#1c740d'><b>あぼ〜ん</b></font>";
                dd.innerHTML = "<span class='ank'><a rel='nofollow' target='_blank' href=" + _path + resnum + " class='anked'>[元のレス]</a></span>";
            }
        }
        return;
    }

    
    //NGキーワードに基づくNG処理を実行する
    function _doNGs(nglist) {
        /* 処理概要
            -スレ内のtext,name,mail,idを取得し
            -NGキーワードを正規表現に直し
            -それを適用し
            -DOMに注入する
        */

        var Op2SureObj = _extractDx();
        var output = _generateRegs();
        var _path = _info.url;

        _execAbone();

        /* 関数 */
        function _extractDx() {
            /* private member */
            var _dl = []; //_dl = _dt + _dd
            var _dt = []; //_dtはレス番号、名前欄、日付欄、メール欄、IDが格納されている
            var _dd = []; //_ddは本文が格納されている
            var _res = []; //プリミティブな感じで上記の内容を格納

            //一時変数
            var _dthread;
            var _dttemp;
            var _mailtemp;
            var _dllength;

            //resに格納する情報
            var _num;
            var _name;
            var _mail;
            var _id;
            var _text;


            //dl要素を取得する
            _dthread = document.querySelector(".thread");
            _dl = _dthread.getElementsByTagName("dl");

            //_data.resに格納する範囲を更新する
            _dllen = _dl.length;

            //dlをdtとddに分解する
            var _dttemplen;
            var _dttemp;
            var _ddtemp;
            for (var ix = 0; ix < _dllen; ix++) {
                _dttemp = _dl[ix].getElementsByTagName("dt");
                _ddtemp = _dl[ix].getElementsByTagName("dd");
                _dttemplen = _dttemp.length;

                for (var ixx = 0; ixx < _dttemplen; ixx++) {
                    if (_dttemp[ixx].className.indexOf("Abrowzered") === -1) {
                        _dt.push(_dttemp[ixx]);
                        _dd.push(_ddtemp[ixx]);
                    }
                }
            }


            //_dt,_ddの各要素毎にレス情報を取得する
            var _dtlen = _dt.length;
            for (var ix = 0; ix < _dtlen; ix++) {
                /* _dt に関する処理 */
                //テキスト(レス内容)取得処理
                //aresに隠されている"例の文字列"を消す
                _text = (function(str) {
                    var mlen = /\n  [0-9].*件/.exec(str);
                    mlen = mlen !== null ? -1 - mlen[0].length : -1;
                    return str.slice(0, mlen);
                })(_dd[ix].innerText);

                /* _dd に関する処理 */
                //メール欄取得処理
                _mailtemp = _dt[ix].querySelector("font > a") || _dt[ix].querySelectorAll("a")[1];
                _mail = _mailtemp === null || _mailtemp === undefined ? undefined : _mailtemp.getAttribute("href").split(":")[1];


                //レス番号、名前欄、日付欄、ID取得処理
                _dttemp = _dt[ix].innerText.split("：");
                _num = _dttemp[0].match(/[0-9]*/)[0] - 0;
                _name = _dttemp[1].substr(_dttemp[1].length - 1) === " " ? _dttemp[1].substr(0, _dttemp[1].length - 1) : _dttemp[1];
                _id = _dttemp[2].split(" ID:")[1].split(" ")[0];


                //オブジェクトに格納する
                _res.push({
                    num: _num,
                    name: _name,
                    mail: _mail,
                    id: _id,
                    text: _text
                });
            }

            return {
                dt: _dt,
                dd: _dd,
                res: _res
            };
        }


        function _generateRegs() {
            //レス数
            var len = Op2SureObj.res.length;
            var output = [];

            //NGキーワードを改行で区切って文字列から配列にする
            var ngwords = nglist.ngwords !== "" ? nglist.ngwords.split("\n") : undefined;
            var ngnames = nglist.ngnames !== "" ? nglist.ngnames.split("\n") : undefined;
            var ngmails = nglist.ngmails !== "" ? nglist.ngmails.split("\n") : undefined;
            var ngids = nglist.ngids !== "" ? nglist.ngids.split("\n") : undefined;

            //NGキーワードを正規表現化してtext|name|mail|idのそれぞれの要素に適用する
            if(nglist.ngkeywordregexp === "yes"){
                output = output.concat(_detectNG(ngwords, "text",_generateReg));
                output = output.concat(_detectNG(ngnames, "name",_generateReg));
                output = output.concat(_detectNG(ngmails, "mail",_generateReg));
                output = output.concat(_detectNG(ngids, "id",_generateReg));                
            }else{
                output = output.concat(_detectNG(ngwords, "text",_escapeRegExp));
                output = output.concat(_detectNG(ngnames, "name",_escapeRegExp));
                output = output.concat(_detectNG(ngmails, "mail",_escapeRegExp));
                output = output.concat(_detectNG(ngids, "id",_escapeRegExp));                
            }

            //重複除去処理
            output = output.filter(function(elm, ind, arr) {
                return arr.indexOf(elm) === ind;
            });


            //NGキーワードを正規表現にする関数
            function _generateReg(list) {
                return list.map(function(elm) {
                    return new RegExp(elm);
                });
            }

            //NGキーワードに含まれる正規表現をエスケープする関数
            function _escapeRegExp(list) {
                 return list.map(function(elm){
                    var str = elm.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
                    return new RegExp(str);
                });
            }

            //空文字列除去関数
            function _removeEmptyString(list) {
                return list.filter(function(elm) {
                    return elm !== "";
                });
            }

            //NGキーワードを正規表現化orエスケープしてtext|name|mail|idのそれぞれの要素に適用する関数
            function _detectNG(ngkeywords, type, func) {
                if (ngkeywords) {
                    var ngcheck;
                    var ngregs = _removeEmptyString(ngkeywords);
                    ngregs = func(ngregs);
                    ngcheck = Op2SureObj.res.map(function(elm, ind) {
                        return ngregs.some(function(inelm) {
                            return inelm.test(elm[type]);
                        }) && ind;
                    });
                    ngcheck = ngcheck.filter(function(elm) {
                        return elm !== false;
                    });
                    return ngcheck;
                } else {
                    return [];
                }
            }

            return output;
        }


        function _execAbone() {
            //あぼーんタイプを判定してあぼーんを実行する
            switch (nglist.abonetype) {
                case "normal":
                    var resnumber;
                    _path = _path.substr(_path.indexOf("/test/")); // urlの"/test/"以降の文字列を抽出
                    _aboneLooper(_doNormalAbone);
                    break;

                case "res":
                    _aboneLooper(_doResAbone);
                    break;

                case "toumei":
                    _aboneLooper(_doToumeiAbone);
                    break;

                default:
            }


            function _aboneLooper(func) {
                for (var ix = output.length - 1; ix > -1; ix = ix - 1) {
                    func(output[ix]);
                }
                return;
            }

            //通常あぼーん
            function _doNormalAbone(num) {
                resnumber = Op2SureObj.res[num].num;
                Op2SureObj.dt[num].classList.add("Abrowzered");
                Op2SureObj.dt[num].innerHTML = resnumber + " ：" + "<font color='#1c740d'><b>あぼ〜ん</b></font>";
                Op2SureObj.dd[num].innerHTML = "<span class='ank'><a rel='nofollow' target='_blank' href=" + _path + resnumber + " class='anked'>[元のレス]</a></span>";
                return;
            }

            //レスあぼーん
            function _doResAbone(num) {
                var ab_none = "display:none";
                Op2SureObj.dt[num].classList.add("Abrowzered");
                Op2SureObj.dd[num].setAttribute("style", ab_none);
                return;
            }

            //透明あぼーん
            function _doToumeiAbone(num) {
                var ab_hidden = "display:none";
                Op2SureObj.dt[num].classList.add("Abrowzered");
                Op2SureObj.dt[num].setAttribute("style", ab_hidden);
                Op2SureObj.dd[num].setAttribute("style", ab_hidden);
                return;
            }

            return;
        }

        return;
    }


    return _info;
})();