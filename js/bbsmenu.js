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
    d.title = "おーぷん２ちゃんねる掲示板リスト";
    
    var br = d.querySelectorAll("br");
    for(var ix = 0, len = br.length; ix < len; ix++){
        br[ix].remove();
    }

    var b = d.querySelectorAll("b");
    for(var ix = 0, len = b.length; ix < len; ix++){
        b[ix].outerHTML = "<b>【" + b[ix].innerText + "】</b>";
    }

    var body = d.querySelector("body");
    body.removeAttribute("text");
    body.removeAttribute("bgcolor");
    body.removeAttribute("link");
    body.removeAttribute("alink");
    body.removeAttribute("vlink");
    body.childNodes[0].textContent = "";
    body.childNodes[1].outerHTML = "<h1>おーぷん２ちゃんねる</h1>";
    body.childNodes[2].textContent = "";
    body.childNodes[3].textContent = "";
    body.childNodes[5].textContent = "";

    return;
})();