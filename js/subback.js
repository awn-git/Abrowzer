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
//@title content_scripts.js
//@description 一行で説明を書く
//
//作った人: Awn(@Awn_tw)
//
//改定履歴
//-20xxxxxx(ver 1.0.0) : 新規作成
//
////////////////////////////////////////////////////////////////////////////////


/* スレ一覧で動くスクリプト */
(function() {
    //member
    var _info = {};

    //init
    _init();

    //method
    function _init() {
        _assignEventHandler();
        return;
    }

    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender, sendResponse) {
            if (parm.suretaikaigyou === "yes") {
                _doSuretaiKaigyou();
            }
            if (parm.suretaiabone === "yes") {
                _doSuretaiAbone();
            }
        });
        return;
    }

    function _doSuretaiKaigyou() {
        var d = document.getElementsByTagName("a");
        var dlen = d.length;
        var temp;
        for (var ix = 0; ix < dlen; ix++) {
            temp = d[ix].outerHTML;
            temp += "<br>";
            d[ix].outerHTML = temp;
        }

        var _pathname = location.pathname;
        var _bbsname = _pathname.split("/")[1];
        var _newdiv = document.createElement("div");

        _newdiv.classList.add("Abrowzered");
        _newdiv.innerHTML = "<a href=/" + _bbsname + "/kako/>★過去ログ</a><br><a href=/" + _bbsname + "/>★板に戻る</a><br><a href=/" + _bbsname + "/gomi.html >★ごみ箱(仮)</a><hr>";

        var _div = document.getElementsByTagName("div")[0];
        var _small = document.getElementById("trad");
        _div.insertBefore(_newdiv, _small);

        return;
    }

    function _dosuretaiAbone() {
        return;
    }

    //return
    return;
})();