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