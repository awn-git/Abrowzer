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
    var _debug = true;
    var _bgobj = {
        temporary: {},
        preserve: {
            history: {
                sure: [],
                ita: []
            },
            favorite: {
                sure: [],
                ita: []
            },
            dashboard: {}
        }
    };

    var _defaultconfigs = {
        abonetype: "no",
        imgurabone: "no",
        oekakiabone: "no",
        ngwords: "",
        ngnames: "",
        ngmails: "",
        ngids: "",
        suretaiabone: "no",
        suretaikaigyou: "no",
        ngsuretai: "",
        modoru: "no",
        ngkeywordregexp: "no",
        ngsuretairegexp: "no"
    };

    var _configs = [];
    (function() {
        for (var key in _defaultconfigs) {
            _configs.push(key);
        }
    })();


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
            if (key in obj) {
                _bgobj = obj;
            } else {
                _bgobj.preserve.dashboard = _defaultconfigs;
                _saveLocalStorage(_bgobj);
            }
            return;
        });
        return;
    }

    function _saveLocalStorage(obj) {
        chrome.storage.local.set(obj, function() {
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

            if (parm.history) {
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

            if (_debug) {
                chrome.tabs.query({ title: "Abrowzer::Storage Monitor" }, function(response) {
                    if (response.length === 0) {
                        chrome.tabs.create({ url: chrome.runtime.getURL("html/storagemonitor.html") }, function() {});
                    }
                    return;
                });
            }

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
            _storeHistory("sure", _bgobj.temporary);
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
            _storeHistory("ita", _bgobj.temporary);
            chrome.tabs.sendMessage(sender.tab.id, _bgobj.preserve.dashboard, function() {});
            return;
        });
        return;
    }

    function _injectImagelist(parm, sender) {
        return;
    }

    function _storeHistory(pagetype, temp) {
        //pagetype = ita || sure
        var dupcheck = [];
        var isDup = true;
        //pagetypeに格納されているurlを取得する
        dupcheck = _bgobj.preserve.history[pagetype].map(function(elm) {
            return elm.url;
        });
        isDup = dupcheck.some(function(elm) {
            return elm === temp.url;
        });
        if (!isDup) {
            _bgobj.preserve.history[pagetype].unshift(temp);
            _saveLocalStorage(_bgobj);
        }
        return;
    }

    function _injectMenu(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/menu.js" }, function(response) {
            chrome.tabs.sendMessage(sender.tab.id, _bgobj.preserve.dashboard, function() {});
            return;
        });
        return;
    }

    /* context menu */
    (function() {
        /*********************
         コンテクストメニューテスト
        **********************/
        //member
        var mycomenu = {};

        mycomenu.abrowzer = {
            title: "Abrowzer",
            type: "normal",
            id: "abrowzer",
            contexts: ["page", "selection"],
            documentUrlPatterns: ["http://*.open2ch.net/*"]
        };

        mycomenu.jump = {
            title: "お気に入り板へ移動する",
            type: "normal",
            id: "jump",
            parentId: "abrowzer",
            documentUrlPatterns: ["http://*.open2ch.net/*"]
        }

        mycomenu.extracturl = {
            title: "URLを抽出する",
            type: "normal",
            id: "extracturl",
            parentId: "abrowzer",
            documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
        };

        mycomenu.favsure = {
            title: "このスレをお気に入りに登録する",
            type: "normal",
            id: "favsure",
            parentId: "abrowzer",
            documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
        };

        mycomenu.favita = {
            title: "この板をお気に入りに登録する",
            type: "normal",
            id: "favita",
            parentId: "abrowzer",
            documentUrlPatterns: ["http://*.open2ch.net/*/"]
        };

        mycomenu.favita2 = {
            title: "この板をお気に入りに登録する",
            type: "normal",
            id: "favita2",
            parentId: "abrowzer",
            documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
        };

        mycomenu.download = {
            title: "画像を全てダウンロードする",
            type: "normal",
            id: "download",
            parentId: "abrowzer",
            documentUrlPatterns: ["http://*.open2ch.net/test/image.cgi/*"]
        };

        mycomenu.selecttext = {
            title: "選択した文字を",
            type: "normal",
            id: "selecttext",
            parentId: "abrowzer",
            contexts: ["selection"],
            documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
        };

        mycomenu.ngword = {
            title: "NGワードに設定する",
            type: "normal",
            id: "ngword",
            parentId: "selecttext",
            contexts: ["selection"],
            documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
        };

        mycomenu.ngname = {
            title: "NGネームに設定する",
            type: "normal",
            id: "ngname",
            parentId: "selecttext",
            contexts: ["selection"],
            documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
        };

        mycomenu.ngid = {
            title: "NGIDに設定する",
            type: "normal",
            id: "ngid",
            parentId: "selecttext",
            contexts: ["selection"],
            documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
        };

        mycomenu.find = {
            title: "検索する",
            type: "normal",
            id: "find",
            parentId: "selecttext",
            contexts: ["selection"],
            documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
        };


        //method
        for (var key in mycomenu) {
            chrome.contextMenus.create(mycomenu[key]);
        }


        //listener
        chrome.contextMenus.onClicked.addListener(function(info, tab) {
            console.log("/******************************/")
            console.log("info--------------");
            console.dir(info);
            console.log("tab--------------");
            console.dir(tab);
            console.log("/******************************/")

            if (info.menuItemId === "favsure") {
                _addFavSure(tab.title,tab.url);
            }

            if (info.menuItemId === "favita" || info.menuItemId === "favita2") {
                _addFavIta(tab.title,tab.url,info.menuItemId);
            }

        });

        function _addFavSure(_title,_url) {
            console.log("_addFavSure");
            var dupcheck = [];
            var isDup = true;
            var urltemp = _url.match(/^.*read\.cgi\/(.*)\/[0-9]{10}\//);

            var temp = {
                bbsname: urltemp[1],
                bbsnameJ: _bgobj.preserve.history.sure.filter(function(elm){return elm.bbsname === urltemp[1];})[0].bbsnameJ,
                suretai: _title,
                url: ( urltemp[0] + "l50" )
            };

            dupcheck = _bgobj.preserve.favorite.sure.map(function(elm) {
                return elm.url;
            });
            isDup = dupcheck.some(function(elm) {
                return elm === temp.url;
            });
            if (!isDup) {
                _bgobj.preserve.favorite.sure.unshift(temp);
                _saveLocalStorage(_bgobj);
            }
            return;
        }

        function _addFavIta(_title,_url,_pagetype) {
            console.log("_addFavIta");
            var dupcheck = [];
            var isDup = true;
            var temp = {
                bbsname:"",
                bbsnameJ:"",
                url:""
            };

            if( _pagetype === "favita" ){//板TOPからの呼び出し
                var urltemp = _url.match(/.*open2ch\.net\/(.*)\//);
                temp.url = urltemp[0];
                temp.bbsname = urltemp[1];
                temp.bbsnameJ = _bgobj.preserve.history.ita.filter(function(elm){return elm.bbsname === urltemp[1];})[0].bbsnameJ;
            }else{//スレの中から呼び出し
                var urltemp = _url.match(/(^.*open2ch\.net\/).*read.cgi\/(.*)\/[0-9]{10}\//);
                temp.url = urltemp[1] + urltemp[2] + "/";
                temp.bbsname = urltemp[2];
                temp.bbsnameJ = _bgobj.preserve.history.sure.filter(function(elm){return elm.bbsname === urltemp[2];})[0].bbsnameJ;
            }

            dupcheck = _bgobj.preserve.favorite.ita.map(function(elm) {
                return elm.url;
            });
            isDup = dupcheck.some(function(elm) {
                return elm === temp.url;
            });
            if (!isDup) {
                _bgobj.preserve.favorite.ita.unshift(temp);
                _saveLocalStorage(_bgobj);
            }
            return;
        }

        return;
    })();
    /* end of context menu*/

    function _getBG() {
        return _bgobj;
    }

    function _getConfigs() {
        return _configs;
    }

    function _getDefaultConfigs() {
        return _defaultconfigs;
    }

    /* public api*/
    return {
        getDefaultConfigs: _getDefaultConfigs,
        getConfigs: _getConfigs,
        getBG: _getBG
    }
})();