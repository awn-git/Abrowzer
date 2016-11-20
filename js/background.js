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

    var _conmenu = {};
    _conmenu.abrowzer = {
        title: "Abrowzer",
        type: "normal",
        id: "abrowzer",
        contexts: ["page", "selection"]
    };

    _conmenu.open2ch = {
        title: "おーぷん２ちゃんねるを開く",
        type: "normal",
        id: "open2ch",
        parentId: "abrowzer"
    };

    _conmenu.dashboard = {
        title: "ダッシュボードを開く",
        type: "normal",
        id: "dashboard",
        parentId: "abrowzer"
    };

    _conmenu.jump = {
        title: "お気に入り板へ移動する",
        type: "normal",
        id: "jump",
        parentId: "abrowzer"
    };

    _conmenu.extracturl = {
        title: "URLを抽出する",
        type: "normal",
        id: "extracturl",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
    };

    _conmenu.favsure = {
        title: "このスレをお気に入りに登録する",
        type: "normal",
        id: "favsure",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
    };

    _conmenu.favita = {
        title: "この板をお気に入りに登録する",
        type: "normal",
        id: "favita",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/*/"]
    };

    _conmenu.favita2 = {
        title: "この板をお気に入りに登録する",
        type: "normal",
        id: "favita2",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
    };

    _conmenu.download = {
        title: "画像を全てダウンロードする",
        type: "normal",
        id: "download",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/test/image.cgi/*"]
    };

    _conmenu.selecttext = {
        title: "選択した文字を",
        type: "normal",
        id: "selecttext",
        parentId: "abrowzer",
        contexts: ["selection"],
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
    };

    _conmenu.ngword = {
        title: "NGワードに設定する",
        type: "normal",
        id: "ngword",
        parentId: "selecttext",
        contexts: ["selection"],
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
    };

    _conmenu.ngname = {
        title: "NGネームに設定する",
        type: "normal",
        id: "ngname",
        parentId: "selecttext",
        contexts: ["selection"],
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
    };

    _conmenu.ngid = {
        title: "NGIDに設定する",
        type: "normal",
        id: "ngid",
        parentId: "selecttext",
        contexts: ["selection"],
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
    };

    _conmenu.find = {
        title: "検索する",
        type: "normal",
        id: "find",
        parentId: "selecttext",
        contexts: ["selection"],
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*"]
    };

    var _defaultconmenu = Object.keys(_conmenu);

    var Util = {};

    /* initializer */
    _init();

    /* private method */
    function _init() {
        _loadLocalStorage("preserve");
        _assignEventHandler();
        _createContextMenu(_conmenu);
        return;
    }

    function _assignEventHandler() {
        _evaluateMessage();
        _doNGingInSure();
        _openDashboard();
        _assignContextMenuLister();
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

    function _updateContextMenu(favarr) {
        var temp = {};
        var conkeys = Object.keys(_conmenu);
        var favkeys = [];


        for (var ix = 0, len = favarr.length; ix < len; ix++) {
            favkeys.push(favarr[ix].bbsname);
            if (!conkeys.some(function(elm) {
                    return elm === favarr[ix].bbsname;
                })) {
                temp[favarr[ix].bbsname] = {
                    title: favarr[ix].bbsnameJ,
                    type: "normal",
                    id: favarr[ix].bbsname,
                    parentId: "jump"
                };
                _conmenu[favarr[ix].bbsname] = temp[favarr[ix].bbsname];
            }
        }

        if (Object.keys(temp).length) {
            _createContextMenu(temp);
        }


        //お気に入りから板が削除された場合 -> コンテクストメニューからも削除する
        var temp_fav = Util.Array.diff(Object.keys(_conmenu), _defaultconmenu);
        console.log("temp_fav: ", temp_fav); //コンテキストメニューに追加した板
        console.log("favkeys", favkeys); //現在のお気に入り板
        console.log("diffs: ", Util.Array.diff(temp_fav, favkeys)); //その差分

        var diffs = Util.Array.diff(temp_fav, favkeys);

        if (diffs.length > 0) {
            for (var ix = 0, len = diffs.length; ix < len; ix++) {
                chrome.contextMenus.remove(diffs[ix]);
                delete _conmenu[diffs[ix]];
            }
        }

        return;
    }



    function _evaluateMessage() {
        chrome.runtime.onMessage.addListener(function(parm, sender) {
            _updateContextMenu(_bgobj.preserve.favorite.ita);

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

                    case "dat":
                        _injectDat(parm, sender);
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

            if (parm.favorite) {
                _deleteFavorite(parm.favorite);
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

    function _deleteFavorite(obj) {
        _bgobj.preserve.favorite = obj;
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
            console.log("injected");
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/subback.css" });
            console.log("css is injected");
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

    function _injectDat(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/dat.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/dat.css" });
        });
        return;
    }

    function _injectImagelist(parm, sender) {
        return;
    }

    function _storeHistory(pagetype, temp) {
        if (temp) {
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

    function _addFavSure(_title, _url) {
        console.log("_addFavSure");
        var dupcheck = [];
        var isDup = true;
        var urltemp = _url.match(/^.*read\.cgi\/(.*)\/[0-9]{10}\//);

        var temp = {
            bbsname: urltemp[1],
            bbsnameJ: _bgobj.preserve.history.sure.filter(function(elm) {
                return elm.bbsname === urltemp[1];
            })[0].bbsnameJ,
            suretai: _title,
            url: (urltemp[0] + "l50")
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

    function _addFavIta(_title, _url, _pagetype) {
        console.log("_addFavIta");
        var dupcheck = [];
        var isDup = true;
        var temp = {
            bbsname: "",
            bbsnameJ: "",
            url: ""
        };

        if (_pagetype === "favita") { //板TOPからの呼び出し
            var urltemp = _url.match(/.*open2ch\.net\/(.*)\//);
            temp.url = urltemp[0];
            temp.bbsname = urltemp[1];
            temp.bbsnameJ = _bgobj.preserve.history.ita.filter(function(elm) {
                return elm.bbsname === urltemp[1];
            })[0].bbsnameJ;
        } else { //スレの中から呼び出し
            var urltemp = _url.match(/(^.*open2ch\.net\/).*read.cgi\/(.*)\/[0-9]{10}\//);
            temp.url = urltemp[1] + urltemp[2] + "/";
            temp.bbsname = urltemp[2];
            temp.bbsnameJ = _bgobj.preserve.history.sure.filter(function(elm) {
                return elm.bbsname === urltemp[2];
            })[0].bbsnameJ;
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

    function _jumpToBbs(bbsname) {
        var bbsurl = _bgobj.preserve.favorite.ita.find(function(elm) {
            return elm.bbsname === bbsname;
        }).url;
        chrome.tabs.update({ url: bbsurl });
        return;
    }

    function _jumpToDashboard() {
        chrome.tabs.query({ title: "Abrowzer::ダッシュボード" }, function(response) {
            if (response.length === 0) {
                chrome.tabs.create({ url: chrome.runtime.getURL("html/dashboard.html") }, function() {});
            } else if (response.length === 1) {
                chrome.tabs.update(response[0].id, { active: true });
            }
            return;
        });
        return;
    }

    function _openOpen2ch(){
        chrome.tabs.create({url : "http://open2ch.net/"},function(){});
        return;
    }

    function _createContextMenu(obj) {
        for (var key in obj) {
            chrome.contextMenus.create(obj[key]);
        }
        return;
    }


    function _assignContextMenuLister() {
        chrome.contextMenus.onClicked.addListener(function(info, tab) {
            console.log("/******************************/")
            console.log("info--------------");
            console.dir(info);
            console.log("tab--------------");
            console.dir(tab);
            console.log("/******************************/")

            if (info.menuItemId === "favsure") {
                _addFavSure(tab.title, tab.url);
            }

            if (info.menuItemId === "favita" || info.menuItemId === "favita2") {
                _addFavIta(tab.title, tab.url, info.menuItemId);
            }

            if (info.parentMenuItemId === "jump") {
                _jumpToBbs(info.menuItemId);
            };

            if (info.menuItemId === "dashboard") {
                _jumpToDashboard();
            };

            if (info.menuItemId === "open2ch") {
                _openOpen2ch();
            };

        });
        return;
    }

    /* test of onbeforewebrequest */
    /*
    onBeforeRequest - Fired when a request is about to occur.
    chrome.webRequest.onBeforeRequest.addListener(function callback)
    */
    (function() {
        //beforeRq();

        function beforeRq() {
            chrome.webRequest.onBeforeRequest.addListener(function(parm) {
                console.log("onBeforeRequest");
                console.dir(parm);
                var urltemp = parm.url.match(/(^.*\/)test\/read\.cgi\/(.*)\/([0-9]{10})/);;
                var url = urltemp[1] + urltemp[2] + "/dat/" + urltemp[3] + ".dat";
                return {
                    //redirectUrl : url
                };
            }, { urls: ["http://*.open2ch.net/test/read.cgi/*"] }, ["blocking"]);
        }
        return;
    })();
    /* test of onbeforewebrequest */

    /* 集合演算ユーティリティ */
    Util.Array = (function() {
        /* 以下、重複する要素を持たない配列を入力の前提としない */
        //恒等写像
        function _identity(arr) {
            return arr.map(function(elm) {
                return elm;
            });
        }

        //重複除去
        function _uniq(arr) {
            return arr.filter(function(elm, ind, ary) {
                return ary.indexOf(elm) === ind;
            });
        }

        //配列が集合っぽいか否か
        function _isSet(arr) {
            return _uniq(arr).length === arr.length;
        }

        /* 以下、重複する要素を持たない配列を入力の前提とする */
        //集合が等しいか否か
        function _equal(arr1, arr2) {
            var rtn1 = (arr1.map(function(elm) {
                return arr2.includes(elm);
            })).every(function(elm) {
                return elm;
            });
            var rtn2 = (arr2.map(function(elm) {
                return arr1.includes(elm);
            })).every(function(elm) {
                return elm;
            });
            return rtn1 && rtn2;
        }

        //和集合
        function _union(arr1, arr2) {
            var con = arr1.concat(arr2);
            var rtn = _uniq(con);
            return rtn;
        }

        //差集合
        function _diff(arr1, arr2) {
            var rtn = arr1.filter(function(elm) {
                return !arr2.includes(elm);
            });
            return rtn;
        }

        //共通部分
        function _intersection(arr1, arr2) {
            var rtn = arr1.filter(function(elm) {
                return arr2.includes(elm);
            });
            return rtn;
        }

        return {
            uniq: _uniq,
            isSet: _isSet,
            identity: _identity,
            equal: _equal,
            union: _union,
            diff: _diff,
            intersection: _intersection
        };
    })();

    function _getBG() {
        return _bgobj;
    }

    function _getConfigs() {
        return Object.keys(_defaultconfigs);
    }

    function _getDefaultConfigs() {
        return _defaultconfigs;
    }

    /* public api*/
    return {
        getConfigs: _getConfigs,
        getDefaultConfigs: _getDefaultConfigs,
        getBG: _getBG
    }
})();