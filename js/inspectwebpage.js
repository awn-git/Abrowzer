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
    var _href = location.href;
    var _pagetype = _detectPagetype(_href);
    sendMessageToBackground(_pagetype);


    function sendMessageToBackground(parm) {
        chrome.runtime.sendMessage({ pagetype: parm });
        return;
    }

    function _detectPagetype(url) {
        var rtn;
        switch (true) {
            case url.indexOf("ranking.cgi") > -1:
                rtn = "ランキング";
                break;
            case url.indexOf("headline.cgi") > -1:
                rtn = "ヘッドライン";
                break;
            case url.indexOf("antena.cgi") > -1:
                rtn = "まとめアンテナ";
                break;
            case url.indexOf("history.cgi") > -1:
                rtn = "履歴";
                break;
            case url.indexOf("toukei.cgi") > -1:
                rtn = "統計情報";
                break;
            case url.indexOf("banner.cgi") > -1:
                rtn = "バナー展示場";
                break;
            case url.indexOf("/plus/") > -1:
                rtn = "＋記者登録所";
                break;
            case url.indexOf("wiki") > -1:
                rtn = "おーぷんwiki";
                break;
            case url.indexOf("kome.cgi") > -1:
                rtn = "米ヘッドライン";
                break;
            case url.indexOf("p2") > -1:
                rtn = "p2";
                break;
            case url.indexOf("senbura.html") > -1:
                rtn = "専ブラ";
                break;
            case url.indexOf("read.cgi") > -1:
                rtn = "スレ";
                break;
            case url.indexOf("image.cgi") > -1:
                rtn = "画像一覧";
                break;
            case url.indexOf("subback.html") > -1:
                rtn = "スレ一覧";
                break;
            case url.indexOf("subject.txt") > -1:
                rtn = "subject";
                break;
            case url.indexOf("find") > -1:
                rtn = "検索";
                break;
            case url.indexOf("bbsmenu.html") > -1:
                rtn = "bbsmenu";
                break;
            case url.indexOf("menu") > -1:
                rtn = "板一覧";
                break;
            case url.indexOf("dev") > -1:
                rtn = "新機能";
                break;
            case url.indexOf("index.rdf") > -1:
                rtn = "RSS";
                break;
            case url.indexOf("/dat/") > -1:
                rtn = "dat";
                break;
            case url.indexOf("gomi.html") > -1:
                rtn = "ごみ箱";
                break;
            case url.indexOf("kako") > -1:
                rtn = "過去ログ";
                break;
            case url.indexOf("SETTING.TXT") > -1:
            	rtn = "板設定";
            	break;
            case url === "http://mente.open2ch.net/":
            	rtn = "メンテ";
            	break;
            case url === "http://open2ch.net/":
                rtn = "入口";
                break;
            default:
                rtn = "板トップ";
        }
        return rtn;
    }
    return {};
})();