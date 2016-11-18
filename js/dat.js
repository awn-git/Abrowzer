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
//@title dat.js
//@description 一行で説明を書く
//
//作った人: Awn(@Awn_tw)
//
//改定履歴
//-20xxxxxx(ver 1.0.0) : 新規作成
//
////////////////////////////////////////////////////////////////////////////////

(function() {
    var d = document;
    var pre = d.getElementsByTagName("pre")[0];
    var arr = pre.innerText.split("\n");
    arr.pop();

    var suretai = arr[0].match(/ <>(.*)$/)[1];
    d.title = suretai;
    arr[0] = arr[0].replace(/ <>(.*)$/, "");
    arr[0] = arr[0].replace(/<> (.*)$/, "<div class='resbody'>$&</div>");

    var lh = location.href.match(/(^.*open2ch.net\/)(.*)\/dat\/([0-9]{10})/);
    var host = lh[1];
    var bbsname = lh[2];
    var surekey = lh[3];
    var itatop = host + bbsname;
    var subback = itatop + "/" + "subback.html";

    var header = "";
    header += "<a href='" + itatop + "'>■板に戻る</a> | ";
    header += "<a href='http://open2ch.net/test/history.cgi'>履歴に戻る</a> | ";
    header += "<a href='" + subback + "'>★スレ一覧</a> | ";
    header += "<a href='#bottom'>↓</a><a name='top'></a>";
    header += "<h3 style='color:red;'>" + suretai + "</h3>";
    header += "<hr>";

    var str;
    var resnum;
    var arrm = arr.map(function(elm, ind) {
        elm = elm.replace(/<> (.*)<>$/, "<br><div class='resbody'>$&</div>")
            .replace(/<\/b>/g, "")
            .replace(/<b>/g, "")
            .replace(/^(.*?)<+?>+?/, "<b style='color:green'>$&</b> ")
            .replace(/<>/g, " ")
            .replace(/https?:\/\/[a-zA-Z0-9-_.:@!~*';\/?&=+$,%#]+/g,
                "<a href='$&' target='_blank'>$&</a>")
            .replace(/&gt;&gt;[0-9]{1,3}/g, "<a href='#$&'>$&</a>");

        resnum = "<a name='>>" + (ind + 1) + "'>" + (ind + 1) + "</a>" + " :";
        elm = resnum + " " + elm;

        str = "<div>" + elm + "</div>";
        return str;
    });

    var footer = "";
    footer += "<hr>";
    footer += "<div style='text-align:center'><a href='#bottom ' id='newres'>新着レスの表示</a> | <a href='#bottom' id='kokomade'>ここまで読んだ？</a></div>";
    footer += "<hr>";
    footer += "<a href='" + itatop + "'>■板に戻る</a> | ";
    footer += "<a href='http://open2ch.net/test/history.cgi'>履歴に戻る</a> | ";
    footer += "<a href='" + subback + "'>★スレ一覧</a> | ";
    footer += "<a href='#top'>↑</a><a name='bottom'></a>";

    var phorm = "";
    phorm += "<form method='POST' action='/test/bbs.cgi?guid=ON' id='form2' style='margin-top:5pt'>";
    phorm += "<input type='submit' value='書き込む' name='submit' id='submit_button'></input> ";
    phorm += "名前：" + "<input size='10' id='FROM' NAME='FROM'></input> ";
    phorm += "mail: " + "<input size='10' id='mail' name='mail'></input><br>";
    phorm += "<textarea rows='5' cols='56' id='MESSAGE' name='MESSAGE'></textarea>";
    phorm += "<input type='hidden' name='bbs' value='" + bbsname + "'>";
    phorm += "<input type='hidden' name='key' value='"  + surekey  + "'>";
    phorm += "<input type='hidden' name='time' value='" + Math.floor( Date.now()/1000 ) + "'>";
    phorm += "</form>";

    d.body.innerHTML = header + arrm.join("") + footer + phorm;

    kokomade();
    newres();

    function kokomade() {
        var elm = d.getElementById("kokomade");
        elm.addEventListener("click", function() {
            alert("そうですか。お疲れ様です。");
            return;
        });
    }

    function newres() {
        var elm = d.getElementById("newres");
        elm.addEventListener("click", function() {
            location.reload();
            return;
        });
    }

    return;
})();