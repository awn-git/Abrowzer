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
    var info = getPageInfo();
    var d = document;
    var pre = d.getElementsByTagName("pre")[0];
    var arr = pre.innerText.split("\n");

    //note: preタグ内の最後に存在する「改行のみの行」を取り除く
    arr.pop();

    var lh = location.href.match(/(^.*open2ch.net)\/(.*)\//);

    var header = "";
    header += "<a href='http://menu.open2ch.net/bbsmenu.html'>★BBSMENU</a><br>";
    header += "<a href='" + lh[1] + "/" + lh[2] + "/'>■板に戻る</a>";
    header += "<a href='http://open2ch.net/test/history.cgi'>履歴</a>";
    header += "<a href='" + lh[1] + "/" + lh[2] + "/subback.html'>★スレッド一覧</a>";
    header += "<a href='" + lh[1] + "/" + lh[2] + "/kako/'>★過去ログ</a>";
    header += "<a href='" + lh[1] + "/" + lh[2] + "/gomi.html'>★ごみ箱(仮)</a>";
    header += "<h3>" + info.bbsname + "</h3>";
    header += "<hr>";

    var host = location.href.match(/(^.*open2ch.net)\//)[1];
    var arrmap = arr.map(function(elm, ind) {
        return elm = elm.replace(/([0-9]{10})\.dat(.*) (\([0-9]{1,4}\))/,
                "<a href=" + host + "/test/read.cgi/" + info.bbsname + "/$1/l50 >" + (ind + 1) + " : <span class='suretai'>$2</span> $3</a>")
            .replace("<>", "");
    });

    var bodyinner = "";
    bodyinner += "<div class=header>" + header + "</div>";
    bodyinner += "<div class=thread>" + arrmap.join("") + "</div>";
    bodyinner += "<div class=footer>" + "</div>";

    d.body.innerHTML = bodyinner;

    function getPageInfo() {
        var urls = location.href.match(/(^.*open2ch.net)\/(.*)\//);
        return {
            bbsname: urls[2],
            bbsnameJ: null,
            url: urls[1] + "/" + urls[2]
        };
    }
    return info;
})();