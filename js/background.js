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

window.bg = (function() {
    var _bgobj = {
        temporary: {},
        preserve: {
            history: {
                sure: [],
                ita: []
            },
            dashboard: {}
        }
    };

    /* initializer */
    _init();


    /* private method */
    function _init() {
        _loadLocalStorage("preserve");
        _assignEventHandler();
        return;
    }

    function _assignEventHandler() {
        _evaluateMessage();
        _doNGingInSure();
        _openDashboard();
        return;
    }

    function _loadLocalStorage(key) {
        chrome.storage.local.get(key, function(obj) {
            if (key in obj) { //objにkeyが存在するなら、objを_bgobjに格納
                //                    _bgobj[key] = obj;
                _bgobj = obj;
            } else { //ないのであれば現在の_bgobjをストレージに保存
                //ここが呼ばれるのはストレージが空のとき。
                _bgobj.preserve.dashboard = {
                    abonetype : "no",
                    imgurabone : "no",
                    oekakiabone : "no",
                    ngwords : "",
                    ngnames : "",
                    ngmails : "",
                    ngids : "",
                    suretaiabone : "no",
                    suretaikaigyou : "no",
                    ngsuretai : "",
                    modoru : "no",
                    autoaku : "no",
                    autoakuwords : ""
                    };
                _saveLocalStorage(_bgobj);
            }
            return;
        });
        return;
    }

    function _saveLocalStorage(obj) {
        chrome.storage.local.set(obj, function(parm) {
            return;
        });
        return;
    }

    function _evaluateMessage() {
        chrome.runtime.onMessage.addListener(function(parm, sender) {

            //from content_scripts
            if (parm.pagetype) {
                switch (parm.pagetype) {
                    case "スレ":
                        _injectSure(parm, sender);
                        break;
                    case "スレ一覧":
                        _injectSubback(parm, sender);
                        break;
                    case "板トップ":
                        _injectItatop(parm, sender);
                        break;
                    case "画像一覧":
                        _injectImagelist(parm, sender);
                        break;
                    case "入口":
                        _injectMenu(parm, sender);
                        break;
                    default:
                }
            }

            //from dashboard
            if (parm.dashboard) {
                _updateDashboard(parm.dashboard);
            }

            if (parm.history){
                _deleteHistory(parm.history);
            }
            return;
        });
        return;
    }

    function _openDashboard() {
        chrome.browserAction.onClicked.addListener(function() {
            chrome.tabs.query({ title: "Abrowzer::ダッシュボード" }, function(response) {
                if (response.length === 0) {
                    chrome.tabs.create({ url: chrome.runtime.getURL("html/dashboard.html") }, function() {});
                }
                return;
            });
            return;
        });
        return;
    }

    function _updateDashboard(obj) {
        for (var key in obj) {
            _bgobj.preserve.dashboard[key] = obj[key];
        };
        _saveLocalStorage(_bgobj);
        return;
    }

    function _deleteHistory(obj) {
        _bgobj.preserve.history = obj;
        _saveLocalStorage(_bgobj);
        return;
    }

    function _injectSure(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/sure.js" }, function(response) {
            _bgobj.temporary = response[0];
            _storeHistory("sure",_bgobj.temporary);
            chrome.tabs.sendMessage(sender.tab.id, _bgobj.preserve.dashboard, function() {});
            return;
        });
        return;
    }

    function _doNGingInSure() {
        chrome.webRequest.onCompleted.addListener(function(response) {
            chrome.tabs.sendMessage(response.tabId, _bgobj.preserve.dashboard, function() {});
            return;
        }, { urls: ["http://*.open2ch.net/ajax/get_res*"] });
        return;
    }

    function _injectSubback(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/subback.js" }, function(response) {
            chrome.tabs.sendMessage(sender.tab.id, _bgobj.preserve.dashboard, function() {});
            return;
        });
        return;
    }

    function _injectItatop(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/itatop.js" }, function(response) {
            _bgobj.temporary = response[0];
            _storeHistory("ita",_bgobj.temporary);
            chrome.tabs.sendMessage(sender.tab.id, _bgobj.preserve.dashboard, function() {});
            return;
        });
        return;
    }

    function _injectImagelist(parm, sender) {
        return;
    }

    function _storeHistory(pagetype,temp){
        //pagetype = ita || sure
        var dupcheck = [];
        var isDup = true;
        //pagetypeに格納されているurlを取得する
        dupcheck = _bgobj.preserve.history[pagetype].map(function(elm){return elm.url;});
        isDup = dupcheck.some(function(elm){return elm === temp.url;});
        if(!isDup){
            _bgobj.preserve.history[pagetype].unshift( temp );
        }
        _saveLocalStorage(_bgobj);
        return;
    }

    function _injectMenu(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/menu.js" }, function(response) {
            chrome.tabs.sendMessage(sender.tab.id, _bgobj.preserve.dashboard, function() {});
            return;
        });
        return;
    }

    function _getBG() {
        return _bgobj;
    }

    /* public api*/
    return {
        bgobj: _bgobj,
        getBG: _getBG
    }
})();