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
    var d = document;
    var pre = d.getElementsByTagName("pre")[0];
    var arr = pre.innerText.split("\n");

    //preタグ内の最後に存在する改行のみの行を取り除く
    arr.pop();

    var suretai = arr[0].match(/ <>(.*)$/)[1];
    d.title = suretai;
    arr[0] = arr[0].replace(/ <>(.*)$/, "");

    var lh = location.href.match(/(^.*open2ch.net\/)(.*)\/dat\/([0-9]{10})/);
    var host = lh[1];
    var bbsname = lh[2];
    var surekey = lh[3];
    var gazou = host + "test/image.cgi/" + bbsname + "/" + surekey + "/";
    var itatop = host + bbsname;
    var subback = itatop + "/" + "subback.html";

    var header = "";
    header += "<a href='http://menu.open2ch.net/bbsmenu.html'>★BBSMENUに戻る</a><br>";
    header += "<a href='" + itatop + "/'>■板に戻る</a> | ";
    header += "<a href='http://open2ch.net/test/history.cgi'>履歴に戻る</a> | ";
    header += "<a href='" + subback + "'>★スレ一覧</a> | ";
    header += "<a href='" + gazou + "'>★画像一覧</a> | ";
    header += "<a href='#bottom'>↓</a><a name='top'></a>";
    header += "<h3 style='color:red;'>" + suretai + "</h3>";
    header += "<hr>";

    var footer = "";
    footer += "<hr>";
    footer += "<div style='text-align:center'><a href='" + location.href + "' id='newres'>新着レスの表示</a> | <a href='#bottom' id='kokomade'>ここまで読んだ？</a></div>";
    footer += "<hr>";
    footer += "<a href='http://menu.open2ch.net/bbsmenu.html'>★BBSMENUに戻る</a><br>";
    footer += "<a href='" + itatop + "/'>■板に戻る</a> | ";
    footer += "<a href='http://open2ch.net/test/history.cgi'>履歴に戻る</a> | ";
    footer += "<a href='" + subback + "'>★スレ一覧</a> | ";
    footer += "<a href='" + gazou + "'>★画像一覧</a> | ";
    footer += "<a href='#top'>↑</a><a name='bottom'></a>";

    var str;
    var resnum;
    var arrmap = arr.map(function(elm, ind) {
        elm = elm.replace(/<\/b>/g, "")
            .replace(/<b>/g, "")
            .replace(/^(.*?)<+?>+?/, "<b style='color:green' class='name'>$&</b> ")
            .replace(/ID:(.*?)<+?>+? /, "<span class='id'>$1</span>")
            .replace(/<\/span>(.*$)/, "<\/span><div class='resbody'>$1</div>")
            .replace(/<>/g, "")
            .replace(/https?:\/\/[a-zA-Z0-9-_.:@!~*';\/?&=+$,%#]+/g,
                "<a href='$&' target='_blank'>$&</a>")
            .replace(/&gt;&gt;([0-9]{1,3})/g, "<a href='#$1'>$&</a>");

        resnum = "<a name='" + (ind + 1) + "'>" + (ind + 1) + "</a>" + " :";
        elm = resnum + " " + elm;

        str = "<div class='res'>" + elm + "</div>";
        return str;
    });

    var phorm = "";
    phorm += "<form method='POST' action='/test/bbs.cgi?guid=ON' id='form2' style='margin-top:5pt'>";
    phorm += "<input type='submit' value='書き込む' name='submit' id='submit_button'></input> ";
    phorm += "名前：" + "<input size='10' id='FROM' NAME='FROM'></input> ";
    phorm += "mail: " + "<input size='10' id='mail' name='mail'></input><br>";
    phorm += "<textarea rows='5' cols='56' id='MESSAGE' name='MESSAGE'></textarea>";
    phorm += "<input type='hidden' name='bbs' value='" + bbsname + "'>";
    phorm += "<input type='hidden' name='key' value='" + surekey + "'>";
    phorm += "<input type='hidden' name='time' value='" + Math.floor(Date.now() / 1000) + "'>";
    phorm += "</form>";

    var bodyinner = "<div class='header'>" + header + "</div>";
    bodyinner += "<div class=thread>" + arrmap.join("") + "</div>";
    bodyinner += "<div class='footer'>" + footer + "</div>";
    bodyinner += "<div class='form'>" + phorm + "</div>";

    d.body.innerHTML = bodyinner;
    window.scrollTo(0, 0);

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