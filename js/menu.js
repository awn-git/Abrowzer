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
        var _href = location.href;
        var _bbsname = "menu";
        var _bbsnameJ = "open2chの入口";

        return {
            href: _href,
            bbsname: _bbsname,
            bbsnameJ: _bbsnameJ
        };
    }

    function _assignEventHandler() {
        chrome.runtime.onMessage.addListener(function(parm, sender) {
        });
        return;
    }

    //return
    return _info;
})();