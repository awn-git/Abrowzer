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
            dashboard: {},
            mode: null
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
        ngsuretai: "",
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

    _conmenu.mode = {
        title: "閲覧モード",
        type: "normal",
        id: "mode",
        parentId: "abrowzer"
    };

    _conmenu.normalmode = {
        title: "通常",
        type: "radio",
        id: "normalmode",
        parentId: "mode"
    };

    _conmenu.simplemode = {
        title: "シンプル",
        type: "radio",
        id: "simplemode",
        parentId: "mode"
    };

    _conmenu.bbsmenu = {
        title: "BBSMENUを開く",
        type: "normal",
        id: "bbsmenu",
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
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/*"]
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
        documentUrlPatterns: ["http://*.open2ch.net/*"]
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
        _assignBeforeRq();
        return;
    }

    function _loadLocalStorage(key) {
        chrome.storage.local.get(key, function(obj) {
            if (key in obj) {
                _bgobj = obj;
            } else {
                _bgobj.preserve.dashboard = _defaultconfigs;
                _bgobj.preserve.mode = "normalmode";
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

    function _updateContextMenu(favarr, pagetype) {
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

        //モードの切り替え
        if( _bgobj.preserve.mode === "simplemode" ){
            chrome.contextMenus.update("simplemode",{checked: true});
        }

        //note: お気に入り板の登録ができるのは、板トップ|スレッド一覧|スレのみ(∵板の日本語名が取得できないため)
        if( pagetype === "板トップ" || pagetype === "スレ一覧" || pagetype === "スレ" ){
            chrome.contextMenus.update("favita", {enabled : true});
        }else{
            chrome.contextMenus.update("favita", {enabled : false});
        }

        return;
    }


    function _evaluateMessage() {
        chrome.runtime.onMessage.addListener(function(parm, sender) {
            _updateContextMenu(_bgobj.preserve.favorite.ita, parm.pagetype);

            //from inspectwebpage
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
                    case "subject":
                        _injectSubject(parm, sender);
                        break;
                    case "bbsmenu":
                        _injectBbsmenu(parm, sender);
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
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/subback.css" });
            chrome.tabs.sendMessage(sender.tab.id, _bgobj.preserve.dashboard, function() {});
            return;
        });
        return;
    }

    function _injectItatop(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/itatop.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/itatop.css" });
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
            _bgobj.temporary = response[0];
            _bgobj.temporary.bbsnameJ = _bgobj.preserve.history.ita.filter(function(elm) {
                return elm.bbsname === _bgobj.temporary.bbsname;
            })[0].bbsnameJ;
            _storeHistory("sure", _bgobj.temporary);
        });
        return;
    }

    function _injectSubject(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/subject.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/subject.css" });
            console.dir(response[0]);
            return;
        });
        return;
    }

    function _injectBbsmenu(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/bbsmenu.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/bbsmenu.css" });
            console.dir(response[0]);
            return;
        });
        return;
    }

    function _injectImagelist(parm, sender) {
        return;
    }

    function _storeHistory(pagetype, temp) {
        if (temp) {
            var dupcheck = [];
            var isDup = true;
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
        var urltemp = _url.match(/(^.*read\.cgi)\/(.*)\/([0-9]{10})\//);

        var temp = {
            bbsname: urltemp[1],
            bbsnameJ: _bgobj.preserve.history.sure.filter(function(elm) {
                return elm.bbsname === urltemp[2];
            })[0].bbsnameJ,
            suretai: _title,
            url: (urltemp[1] + "/" + urltemp[2] + "/" + urltemp[3] + "/")
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

    function _addFavIta(_title, _url) {
        console.log("_addFavIta");
        var dupcheck = [];
        var isDup = true;
        var temp = {
            bbsname: "",
            bbsnameJ: "",
            url: ""
        };
        var _pagetype = "";
        var urltemp = "";

        if (_url.match(/(^.*open2ch\.net\/).*read.cgi\/(.*)\/[0-9]{10}\//)) {
            urltemp = _url.match(/(^.*open2ch\.net\/).*read.cgi\/(.*)\/[0-9]{10}\//);
            _pagetype = "sure";
        } else {
            urltemp = _url.match(/.*open2ch\.net\/(.*)\//);
            _pagetype = "ita";
        }

        try {
            if (_pagetype === "ita") {
                temp.url = urltemp[0];
                temp.bbsname = urltemp[1];
                temp.bbsnameJ = _bgobj.preserve.history.ita.filter(function(elm) {
                    return elm.bbsname === urltemp[1];
                })[0].bbsnameJ;
            } else if (_pagetype === "sure") {
                temp.url = urltemp[1] + urltemp[2] + "/";
                temp.bbsname = urltemp[2];
                temp.bbsnameJ = _bgobj.preserve.history.sure.filter(function(elm) {
                    return elm.bbsname === urltemp[2];
                })[0].bbsnameJ;
            } else {
                return;
            }
        } catch (e) {
            alert("うーん、板情報が取得できませんでした。。。");
            return;
        }

        console.dir(temp);

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

    function _openBbsmenu() {
        chrome.tabs.create({ url: "http://menu.open2ch.net/bbsmenu.html" }, function() {});
        return;
    }

    function _switchCurrentMode(selected) {
        _bgobj.preserve.mode = selected;
        _saveLocalStorage(_bgobj);
        return;
    }

    function _findKeyword(url, keyword) {
        //note: 選択されたテキストは複数行あっても１行とみなされる
        var bbsname = url.match(/^.*open2ch.net\/test\/read.cgi\/(.*)\/[0-9]{10}\//)[1];

        //note: "ID:"を含むテキストはIDを検索したいものとみなす
        if( keyword.indexOf("ID:") > -1 ){
            keyword = keyword.replace(/(.*)(ID:.*)/,"$2")
                .replace("(主)","")
                .replace("×", "")
                .replace(/ /g, "");
        }
        keyword = keyword.trim();
        var findurl = "http://find.open2ch.net/?bbs=" + bbsname + "&t=f&q=" + keyword;
        chrome.tabs.create({ url: findurl }, function() {});
        return;
    }

    function _setNgKeyword(type, keyword) {
        //note: 選択されたテキストは複数行あっても１行とみなされる

        if (type === "ngid") {
            keyword = keyword.replace(/.*ID:/, "")
                .replace("(主)", "")
                .replace("×", "")
                .replace(/ /g, "");
        }
        keyword = keyword.trim();

        //note: 正規表現を使用していない場合、そのまま追加
        //note: 正規表現を使用している場合、エスケープする
        if (_bgobj.preserve.dashboard.ngkeywordregexp === "yes") {
            keyword = keyword.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        }

        if (type === "ngword") {
            if (_bgobj.preserve.dashboard.ngwords !== "") {
                _bgobj.preserve.dashboard.ngwords += "\n" + keyword;
            } else {
                _bgobj.preserve.dashboard.ngwords = keyword;
            }
        }

        if (type === "ngname") {
            if (_bgobj.preserve.dashboard.ngnames !== "") {
                _bgobj.preserve.dashboard.ngnames += "\n" + keyword;
            } else {
                _bgobj.preserve.dashboard.ngnames = keyword;
            }
        }

        if (type === "ngid") {
            if (_bgobj.preserve.dashboard.ngids !== "") {
                _bgobj.preserve.dashboard.ngids += "\n" + keyword;
            } else {
                _bgobj.preserve.dashboard.ngids = keyword;
            }
        }

        _saveLocalStorage(_bgobj);

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

            if (info.menuItemId === "favita") {
                _addFavIta(tab.title, tab.url);
            }

            if (info.parentMenuItemId === "jump") {
                _jumpToBbs(info.menuItemId);
            };

            if (info.menuItemId === "dashboard") {
                _jumpToDashboard();
            };

            if (info.menuItemId === "bbsmenu") {
                _openBbsmenu();
            };

            if (info.menuItemId === "find") {
                _findKeyword(tab.url, info.selectionText);
            }

            if (info.menuItemId === "ngword" || info.menuItemId === "ngname" || info.menuItemId === "ngid") {
                _setNgKeyword(info.menuItemId, info.selectionText);
            }

            if (info.parentMenuItemId === "mode") {
                _switchCurrentMode(info.menuItemId);
            }

        });
        return;
    }

    function _assignBeforeRq() {
        chrome.webRequest.onBeforeRequest.addListener(function(parm) {
            console.log("onBeforeRequest");
            console.dir(parm);
            var urltemp = parm.url.match(/(^.*\/)test\/read\.cgi\/(.*)\/([0-9]{10})/);;
            var url = urltemp[1] + urltemp[2] + "/dat/" + urltemp[3] + ".dat";

            if (_bgobj.preserve.mode === "simplemode") {
                return { redirectUrl: url };
            }
        }, { urls: ["http://*.open2ch.net/test/read.cgi/*"] }, ["blocking"]);
        return;
    }


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