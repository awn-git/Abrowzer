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

    //note: preタグ内の最後に存在する「改行のみの行」を取り除く
    arr.pop();

    var origin = location.origin;
    var pathname = location.pathname;
    var surekey = pathname.match(/[0-9]{10}/)[0];
    var bbsname = pathname.match(/^\/(.*?)\//)[1];
    var suretai = arr[0].match(/^(.*?)<>(.*?)<>(.*?) ID:(.*?)<> (.*?) <>(.*?)$/)[6];

    d.title = suretai;

    var readcgi = origin + "/test/read.cgi/" + bbsname + "/" + surekey + "/";
    var imagecgi = origin + "/test/image.cgi/" + bbsname + "/" + surekey + "/";
    var matomeru = "https://2mtmex.com/?url=" + readcgi;
    var itatop = origin + "/" + bbsname + "/";
    var subject = itatop + "subject.txt";
    var subback = itatop + "subback.html";
    var bbsmenu = "http://open2ch.net/bbsmenu.html";
    var rireki = "http://open2ch.net/test/history.cgi";

    var datobj = {
        info: {
            suretai: suretai,
            url: readcgi,
            bbsname: bbsname,
            bbsnameJ: null,
        },
        res: []
    };

    var parse;
    var parse_regexp = new RegExp(/^(.*?)<>(.*?)<>(.*?) ID:(.*?)<> (.*?) <>/);
    for (var ix = 0, len = arr.length; ix < len; ix++) {
        parse = arr[ix].match(parse_regexp);
        if (parse) {
            datobj.res.push({
                name: parse[1].trim(),
                mail: parse[2],
                timestamp: parse[3],
                id: parse[4],
                text: parse[5]
            });
        } else {
            datobj.res.push({
                name: "あぼーん",
                mail: "あぼーん",
                timestamp: "あぼーん",
                id: "あぼーん",
                text: "あぼーん"
            });
        }
    }

    var threadhtml = [];
    var str = "";
    var extra = "";
    var text_temp = "";

    var b_regexp = new RegExp(/<\/?b>/, "g");
    var anka_regexp = new RegExp(/&gt;&gt;([0-9]{1,4})/, "g");
    var url_regexp = new RegExp(/https?:\/\/[a-zA-Z0-9-_.:@!~*';\/?&=+$,%#]+/, "g");

    threadhtml = datobj.res.map(function(elm, ind) {
        extra = elm.timestamp === "あぼーん" ? " broken" : "";
        str = "<div class='res" + extra + "'>";
        str += "<div class='reshead" + extra + "'>";
        str += "<a name='" + (ind + 1) + "' class='resnum" + extra + "'>" + (ind + 1) + "</a>";
        str += "<span class='name" + extra + "'>" + elm.name.replace(b_regexp, "") + "</span>";
        str += "<span class='mail" + extra + "'>" + elm.mail + "</span>";
        str += "<span class='timestamp" + extra + "'>" + elm.timestamp + "</span>";
        str += "<span class='id" + extra + "'>" + elm.id + "</span>";
        str += "</div>";
        text_temp = elm.text.replace(anka_regexp, "<a href='#$1'>$&</a>")
            .replace(url_regexp, "<a href='$&' target='_blank'>$&</a>");
        str += "<div class='resbody" + extra + "'>" + text_temp + "</div>";
        str += "</div>";

        return str;
    });


    var header = "";
    header += "<a href='" + bbsmenu + "'>BBSMENU</a><br>";
    header += "<a href='" + itatop + "'>板に戻る</a>";
    header += "<a href='" + rireki + "'>履歴</a>";
    header += "<a href='" + subback + "'>スレッド一覧</a>";
    header += "<a href='" + subject + "'>スレッド一覧(大漁)</a>";
    header += "<a href='" + readcgi + "'>read.cgi</a>";
    header += "<a href='#bottom'>↓</a><a name='top'></a><br>";
    header += "<a href='" + matomeru + "'>まとめる</a>";
    header += "<a href='" + imagecgi + "'>画像一覧</a>";
    header += "<hr>";
    header += "<h3 id='suretai'>" + suretai + "</h3>";

    var footer = "";
    footer += "<hr>";
    footer += "<a href='" + bbsmenu + "'>BBSMENU</a><br>";
    footer += "<a href='" + itatop + "'>板に戻る</a>";
    footer += "<a href='" + rireki + "'>履歴</a>";
    footer += "<a href='" + subback + "'>スレッド一覧</a>";
    footer += "<a href='" + subject + "'>スレッド一覧(大漁)</a>";
    footer += "<a href='" + readcgi + "'>read.cgi</a>";
    footer += "<a href='#top'>↑</a><a name='bottom'></a><br>";
    footer += "<a href='" + matomeru + "'>まとめる</a>";
    footer += "<a href='" + imagecgi + "'>画像一覧</a>";

    var phorm = "";
    phorm += "<form method='POST' action='/test/bbs.cgi?guid=ON' id='form2' style='margin-top:5pt'>";
    phorm += "<input type='submit' value='書き込む' name='submit' id='submit_button'></input> ";
    phorm += "名前：" + "<input size='10' id='FROM' NAME='FROM'></input> ";
    phorm += "mail：" + "<input size='10' id='mail' name='mail'></input><br>";
    phorm += "<textarea rows='5' cols='56' id='MESSAGE' name='MESSAGE'></textarea>";
    phorm += "<input type='hidden' name='bbs' value='" + bbsname + "'>";
    phorm += "<input type='hidden' name='key' value='" + surekey + "'>";
    phorm += "<input type='hidden' name='time' value='" + Math.floor(Date.now() / 1000) + "'>";
    phorm += "</form>";

    var bodyinner = "";
    bodyinner += "<div class='header'>" + header + "</div>";
    bodyinner += "<div class='thread'>" + threadhtml.join("") + "</div>";
    bodyinner += "<div class='footer'>" + footer + "</div>";
    bodyinner += "<div class='form'>" + phorm + "</div>";

    d.body.innerHTML = bodyinner;

    //note: datパース後はスレの一番上に移動
    //note: スレの一番下に移動はwindow.scrollTo(0,document.body.scrollheight)で良いのだが、
    //note: 　どうやらdatパース前のscrollheightに移動してしまうようだ。
    window.scrollTo(0, 0);

    return datobj.info;

})();