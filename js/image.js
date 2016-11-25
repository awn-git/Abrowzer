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
    var suretai = document.title;
    var url = location.href;

    var thumbs = d.getElementById("thumbs").querySelectorAll(".im.maru");
    var images = [];
    for(var ix = 0, len = thumbs.length; ix < len; ix++){
        images.push(thumbs[ix].children[0].href);
    }

    var info = {
        url : url,
        suretai : suretai,
        images : images
    }

    chrome.runtime.onMessage.addListener(function(parm,sender,sendResponse){
        if(parm.getimages){
            sendResponse(info);            
        }
    });

    return info.url;
})();