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

////////////////////////////////////////////////////////////////////////////////
//
//@title sample.js
//@description サンプル的なjavascriptです。
//
//作った人: Awn(@Awn_tw)
//
//改定履歴
//-20xxxxxx(ver 1.0.0) : 新規作成
//
////////////////////////////////////////////////////////////////////////////////


//板トップで動くスクリプト

(function() {

    //member
    var _info = {};

    //init
    _init();

    //method
    function _init() {
        _info = _getPageInfo();
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
            if (parm.suretaikaigyou === "yes") {
                _doSuretaiKaigyou();
            }
            if (parm.suretaiabone === "yes") {
                _doSuretaiAbone(parm.ngsuretai);
            }
        });
        return;
    }


    function _doSuretaiKaigyou() {
        //変数
        var surekey;
        var date;

        //#topThreadsを取得
        var _d = document.getElementById("topThreads").childNodes[1].children;
        var _dlen = _d.length;

        _d[0].outerHTML = "　" + _d[0].outerHTML;

        for (var ix = 0; ix < _dlen; ix++) {
            if (ix < 18 && ix % 2 === 0) {
                //surekey は _d[num] s.t. num % 2 === 0に入っている
                surekey = _d[ix].getAttribute("href").split("/")[4] - 0;
                date = _getSuretateDate(surekey);
                _d[ix].innerText = "【" + date + "】" + _d[ix].innerText;

                //改行したいのは _d[num] s.t. num % 2 === 1
                _d[ix + 1].innerHTML += "<br>"; //スレタイ

            } else if (ix >= 18) {
                surekey = _d[ix].getAttribute("href").split("/")[4] - 0;
                date = _getSuretateDate(surekey);
                _d[ix].innerText = "【" + date + "】" + _d[ix].innerText
                _d[ix].innerHTML += "<br>"; //スレタイ
            }
        }
        return;
    }

    function _getSuretateDate(input) {
        var timestamp = input * 1000;
        var p = new Date(timestamp);
        var rtn = p.getFullYear() + "/" + ("0" + (p.getMonth() + 1)).substr(-2, 2) + "/" + ("0" + p.getDate()).substr(-2, 2) + " " + ("0" + p.getHours()).substr(-2, 2) + ":" + ("0" + p.getMinutes()).substr(-2, 2) + ":" + ("0" + p.getSeconds()).substr(-2, 2);
        return rtn;
    }

    function _doSuretaiAbone(nglist){
    	console.log(nglist);
    	return;
    }

    return _info;
})();