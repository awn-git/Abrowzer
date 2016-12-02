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
            contexts: {
                mode: null,
                resabone: null,
                imgurabone: null,
                oekakiabone: null,
                suretaiabone: null
            }
        }
    };

    var _defaultconfigs = {
        ngwords: "",
        ngnames: "",
        ngmails: "",
        ngids: "",
        ngsuretai: "",
        enableRegExp_sure: "no",
        enableRegExp_suretai: "no"
    };

    var _defaultcontexts = {
        mode: "normalmode",
        resabone: "no",
        imgurabone: "no",
        oekakiabone: "no",
        suretaiabone: "no"
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

    _conmenu.ngsettings = {
        title: "NG適用",
        type: "normal",
        id: "ngsettings",
        parentId: "abrowzer"
    };

    _conmenu.resabone = {
        title: "レスあぼーん",
        type: "checkbox",
        id: "resabone",
        parentId: "ngsettings"
    };

    _conmenu.imgurabone = {
        title: "imgurあぼーん",
        type: "checkbox",
        id: "imgurabone",
        parentId: "ngsettings"
    };

    _conmenu.oekakiabone = {
        title: "お絵描きあぼーん",
        type: "checkbox",
        id: "oekakiabone",
        parentId: "ngsettings"
    };

    _conmenu.suretaiabone = {
        title: "スレタイあぼーん",
        type: "checkbox",
        id: "suretaiabone",
        parentId: "ngsettings"
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
        //documentUrlPatterns: ["http://*.open2ch.net/*"]
    };

    _conmenu.extracturl = {
        title: "URLを抽出する",
        type: "normal",
        id: "extracturl",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*", "http://*.open2ch.net/*/dat/*"]
    };

    _conmenu.favsure = {
        title: "このスレをお気に入りに登録する",
        type: "normal",
        id: "favsure",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*", "http://*.open2ch.net/*/dat/*"]
    };

    _conmenu.favita = {
        title: "この板をお気に入りに登録する",
        type: "normal",
        id: "favita",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/*", "http://*.open2ch.net/*/dat/*"]
    };

    _conmenu.download = {
        title: "画像を全てダウンロードする",
        type: "normal",
        id: "download",
        parentId: "abrowzer",
        documentUrlPatterns: ["http://*.open2ch.net/test/image.cgi/*"]
    };

    _conmenu.selecttext = {
        title: "「%s」を",
        type: "normal",
        id: "selecttext",
        parentId: "abrowzer",
        contexts: ["selection"],
        documentUrlPatterns: ["http://*.open2ch.net/test/read.cgi/*", "http://*.open2ch.net/*/dat/*"]
    };

    _conmenu.ngword = {
        title: "NGワードに設定する",
        type: "normal",
        id: "ngword",
        parentId: "selecttext",
        contexts: ["selection"]
    };

    _conmenu.ngname = {
        title: "NGネームに設定する",
        type: "normal",
        id: "ngname",
        parentId: "selecttext",
        contexts: ["selection"]
    };

    _conmenu.ngid = {
        title: "NGIDに設定する",
        type: "normal",
        id: "ngid",
        parentId: "selecttext",
        contexts: ["selection"]
    };

    _conmenu.find = {
        title: "検索する",
        type: "normal",
        id: "find",
        parentId: "selecttext",
        contexts: ["selection"]
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
        _execNGinSure();
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
                _bgobj.preserve.contexts = _defaultcontexts;
                _saveLocalStorage(_bgobj);
            }
            _updateContextMenu(_bgobj.preserve.favorite.ita, null);
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
        var diffs = Util.Array.diff(temp_fav, favkeys);
        if (diffs.length > 0) {
            for (var ix = 0, len = diffs.length; ix < len; ix++) {
                chrome.contextMenus.remove(diffs[ix]);
                delete _conmenu[diffs[ix]];
            }
        }

        //note: 閲覧モードとNGSettingsのチェックを表示する
        if (_bgobj.preserve.contexts.mode === "simplemode") {
            chrome.contextMenus.update("simplemode", { checked: true });
        }

        if (_bgobj.preserve.contexts.resabone === "yes") {
            chrome.contextMenus.update("resabone", { checked: true });
        }

        if (_bgobj.preserve.contexts.imgurabone === "yes") {
            chrome.contextMenus.update("imgurabone", { checked: true });
        }

        if (_bgobj.preserve.contexts.oekakiabone === "yes") {
            chrome.contextMenus.update("oekakiabone", { checked: true });
        }

        if (_bgobj.preserve.contexts.suretaiabone === "yes") {
            chrome.contextMenus.update("suretaiabone", { checked: true });
        }

        //note: 板登録
        if (pagetype === "板トップ" || pagetype === "スレッド一覧" || pagetype === "スレ" || pagetype === "dat" || pagetype === "subject") {
            chrome.contextMenus.update("favita", { enabled: true });
        } else {
            chrome.contextMenus.update("favita", { enabled: false });
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
                    case "スレッド一覧":
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

    function _injectSubback(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/subback.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/subback.css" });

            var message = {
                dashboard: _bgobj.preserve.dashboard,
                contexts: _bgobj.preserve.contexts
            };
            chrome.tabs.sendMessage(sender.tab.id, message, function() {});
            return;
        });
        return;
    }

    function _injectSubject(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/subject.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/subject.css" });

            var message = {
                dashboard: _bgobj.preserve.dashboard,
                contexts: _bgobj.preserve.contexts
            };
            chrome.tabs.sendMessage(sender.tab.id, message, function() {});
            return;
        });
        return;
    }

    function _injectItatop(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/itatop.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/itatop.css" });
            _bgobj.temporary = response[0];
            _storeHistory("ita", _bgobj.temporary);

            var message = {
                dashboard: _bgobj.preserve.dashboard,
                contexts: _bgobj.preserve.contexts
            };
            chrome.tabs.sendMessage(sender.tab.id, message, function() {});
            return;
        });
        return;
    }

    function _injectSure(parm, sender) {
        var bbsname = sender.url.match(/^.*open2ch.net\/test\/read.cgi\/(.*)\/[0-9]{10}\//)[1];
        var user_css = "css/user/sure/" + bbsname + ".css";

        chrome.tabs.executeScript(sender.tab.id, { file: "js/sure.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: user_css }, function(parm) {
                if (chrome.runtime.lastError) {
                    //console.log("insert css/sure.css because " + user_css + " was not found.");
                    chrome.tabs.insertCSS(sender.tab.id, { file: "css/sure.css" });
                }
            });

            _bgobj.temporary = response[0];
            _storeHistory("sure", _bgobj.temporary);
            var message = {
                dashboard: _bgobj.preserve.dashboard,
                contexts: _bgobj.preserve.contexts
            };
            chrome.tabs.sendMessage(sender.tab.id, message, function() {});
            return;
        });
        return;
    }

    function _execNGinSure() {
        chrome.webRequest.onCompleted.addListener(function(response) {
            var message = {
                dashboard: _bgobj.preserve.dashboard,
                contexts: _bgobj.preserve.contexts
            };
            chrome.tabs.sendMessage(response.tabId, message, function() {});
            return;
        }, { urls: ["http://*.open2ch.net/ajax/get_res*"] });
        return;
    }

    function _injectDat(parm, sender) {
        var bbsname = sender.url.match(/^.*open2ch.net\/(.*?)\/dat\/[0-9]{10}.dat/)[1];
        var user_css = "css/user/dat/" + bbsname + ".css";

        chrome.tabs.executeScript(sender.tab.id, { file: "js/dat.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: user_css }, function(parm) {
                if (chrome.runtime.lastError) {
                    //console.log("insert css/dat.css because " + user_css + " was not found.");
                    chrome.tabs.insertCSS(sender.tab.id, { file: "css/dat.css" });
                }
            });

            _bgobj.temporary = response[0];

            _getLocalJSON("data/bbsname.json", function(parm) {
                var bbsnameJ_maybe = parm[_bgobj.temporary.bbsname];
                if (bbsnameJ_maybe) {
                    _bgobj.temporary.bbsnameJ = bbsnameJ_maybe;
                } else {
                    var bbsnameJ_his = _bgobj.preserve.history.ita.filter(function(elm) {
                        return elm.bbsname === _bgobj.temporary.bbsname;
                    });
                    _bgobj.temporary.bbsnameJ = bbsnameJ_his.length !== 0 ? bbsnameJ_his[0].bbsnameJ : _bgobj.temporary.bbsname;
                }
                _storeHistory("sure", _bgobj.temporary);
            });

            var message = {
                dashboard: _bgobj.preserve.dashboard,
                contexts: _bgobj.preserve.contexts
            };
            chrome.tabs.sendMessage(sender.tab.id, message, function() {});
        });
        return;
    }

    function _getLocalJSON(filename, callback) {
        var url = chrome.extension.getURL(filename);
        var xhr = new XMLHttpRequest();
        var obj;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                obj = JSON.parse(xhr.responseText);
                callback(obj);
            }
        }
        xhr.open('GET', url, true);
        xhr.send();
        return;
    }

    function _injectImagelist(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/image.js" }, function() {});
        return;
    }

    function _injectBbsmenu(parm, sender) {
        chrome.tabs.executeScript(sender.tab.id, { file: "js/bbsmenu.js" }, function(response) {
            chrome.tabs.insertCSS(sender.tab.id, { file: "css/bbsmenu.css" });
            return;
        });
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

    function _addFav(_title, _url, _type) {
        var urls;
        if (_url.indexOf("/dat/") > -1) {
            //note: http://kohada.open2ch.net/yume/dat/1459780203.datの場合 <-> dat
            //       urls[1] -> http://kohada.open2ch.net
            //       urls[2] -> yume
            //       urls[3] -> 1459780203
            urls = _url.match(/(^.*open2ch.net)\/(.*)\/dat\/([0-9]{10})/);
        } else if (_url.indexOf("read.cgi") > -1) {
            //note: http://kohada.open2ch.net/test/read.cgi/yume/1459780203/l50の場合 <-> read.cgi
            //       urls[1] -> http://kohada.open2ch.net
            //       urls[2] -> yume
            //       urls[3] -> 1459780203                
            urls = _url.match(/(^.*open2ch.net)\/test\/read.cgi\/(.*)\/([0-9]{10})/);
        } else {
            //note: http://kohada.open2ch.net/yume/subback.html or
            //      http://kohada.open2ch.net/yume/subject.txt or
            //      http://kohada.open2ch.net/yume/ の場合
            //       urls[1] -> http://kohada.open2ch.net
            //       urls[2] -> yume
            urls = _url.match(/(^.*open2ch.net)\/(.*)\//);
        }

        var saveobj;
        if (_type === "favsure") {
            saveobj = {
                bbsname: urls[2],
                bbsnameJ: null,
                suretai: _title,
                url: urls[1] + "/test/read.cgi/" + urls[2] + "/" + urls[3] + "/"
            };
        } else {
            saveobj = {
                bbsname: urls[2],
                bbsnameJ: null,
                url: urls[1] + "/" + urls[2] + "/"
            };
        }

        //note: bbsnameJを確定させ、重複をチェックし、_bgobj/localStorageに値を格納する
        var dupcheck;
        var isDup;
        var type = _type.substr(3);
        _getLocalJSON("data/bbsname.json", function(parm) {
            var bbsnameJ_maybe = parm[saveobj.bbsname];
            if (bbsnameJ_maybe) {
                saveobj.bbsnameJ = bbsnameJ_maybe;
            } else {
                var bbsnameJ_his = _bgobj.preserve.history[type].filter(function(elm) {
                    return elm.bbsname === saveobj.bbsname;
                });
                saveobj.bbsnameJ = bbsnameJ_his.length !== 0 ? bbsnameJ_his[0].bbsnameJ : saveobj.bbsname;
            }

            //note: 重複チェック
            dupcheck = _bgobj.preserve.favorite[type].map(function(elm) {
                return elm.url;
            });
            isDup = dupcheck.some(function(elm) {
                return elm === saveobj.url;
            });
            if (!isDup) {
                //note: 値の格納
                _bgobj.preserve.favorite[type].unshift(saveobj);
                _saveLocalStorage(_bgobj);
            }

            return;
        });
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

    function _switchCurrentMode(selected, tabid) {
        _bgobj.preserve.contexts.mode = selected;
        _saveLocalStorage(_bgobj);
        chrome.tabs.reload(tabid);
        return;
    }

    function _applyNGsettings(type, checked, tabid) {
        _bgobj.preserve.contexts[type] = checked ? "yes" : "no";
        _saveLocalStorage(_bgobj);
        chrome.tabs.reload(tabid);
        return;
    }

    function _findKeyword(url, keyword) {
        //note: 選択されたテキストは複数行あっても１行とみなされる
        var bbsname;
        if (url.indexOf("/dat/") > -1) {
            bbsname = url.match(/^.*open2ch.net\/(.*)\/dat\/[0-9]{10}/)[1];
        } else {
            bbsname = url.match(/^.*open2ch.net\/test\/read.cgi\/(.*)\/[0-9]{10}\//)[1];
        }

        //note: "ID:"を含むテキストはIDを検索したいものとみなす
        if (keyword.indexOf("ID:") > -1) {
            keyword = keyword.replace(/(.*)(ID:.*)/, "$2")
                .replace("(主)", "")
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
        if (_bgobj.preserve.dashboard.enableRegExp_sure === "yes") {
            keyword = keyword.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        }

        var types = type + "s";

        if (_bgobj.preserve.dashboard[types] !== "") {
            _bgobj.preserve.dashboard[types] += "\n" + keyword;
        } else {
            _bgobj.preserve.dashboard[types] = keyword;
        }

        _saveLocalStorage(_bgobj);

        return;
    }

    function _execDownload(tab_image) {
        chrome.tabs.query({ title: "Abrowzer::Result" }, function(query) {
            if (query.length !== 0) {
                chrome.tabs.update(query[0].id, { active: true });
                alert("お手数ですがこのページは閉じてください。");
            } else {
                chrome.tabs.create({ url: chrome.runtime.getURL("html/result.html") }, function(tab_result) {
                    chrome.tabs.sendMessage(tab_image.id, { getimages: "getimages" }, function(parm_image) {
                        //note: tabs.createしてからresult.jsがlistenするのにほんの少し時間がかかるので
                        //       2000ミリ秒ほど待機してからメッセージを送信する
                        chrome.alarms.create("send_to_result", { when: Date.now() + 2000 });
                        chrome.alarms.onAlarm.addListener(function(alarm) {
                            if (alarm.name === "send_to_result") {
                                chrome.tabs.sendMessage(tab_result.id, { download: parm_image });
                            }
                        });
                    });
                });
                return;
            }
        });
        return;
    }

   function _extractURL(tab) {
        chrome.tabs.query({ title: "Abrowzer::Result" }, function(query) {
            if (query.length !== 0) {
                chrome.tabs.update(query[0].id, { active: true });
                alert("お手数ですがこのページは閉じてください。");
            } else {
                chrome.tabs.create({ url: chrome.runtime.getURL("html/result.html") }, function(tab_result) {
                    chrome.tabs.sendMessage(tab.id,{extracturl:"extracturl"},function(parm){
                        //note: tabs.createしてからresult.jsがlistenするのにほんの少し時間がかかるので
                        //       2000ミリ秒ほど待機してからメッセージを送信する
                        chrome.alarms.create("send_to_result", { when: Date.now() + 2000 });
                        chrome.alarms.onAlarm.addListener(function(alarm) {
                            if (alarm.name === "send_to_result") {
                                chrome.tabs.sendMessage(tab_result.id, { extracturl: parm });
                            }
                        });
                    });
                });
                return;
            }
        });
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
            if (info.menuItemId === "favsure") {
                _addFav(tab.title, tab.url, info.menuItemId);
            }

            if (info.menuItemId === "favita") {
                _addFav(tab.title, tab.url, info.menuItemId);
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
                _switchCurrentMode(info.menuItemId, tab.id);
            }

            if (info.parentMenuItemId === "ngsettings") {
                _applyNGsettings(info.menuItemId, info.checked, tab.id);
            }

            if (info.menuItemId === "download") {
                _execDownload(tab);
            }

            if (info.menuItemId === "extracturl"){
                _extractURL(tab);
            }

        });
        return;
    }

    function _assignBeforeRq() {
        chrome.webRequest.onBeforeRequest.addListener(function(parm) {
            var urltemp = parm.url.match(/(^.*\/)test\/read\.cgi\/(.*)\/([0-9]{10})/);;
            var url = urltemp[1] + urltemp[2] + "/dat/" + urltemp[3] + ".dat";

            if (_bgobj.preserve.contexts.mode === "simplemode") {
                return { redirectUrl: url };
            }
        }, { urls: ["http://*.open2ch.net/test/read.cgi/*"] }, ["blocking"]);
        return;
    }

    /* 集合演算ユーティリティ */
    Util.Array = (function() {
        //差集合
        function _diff(arr1, arr2) {
            var rtn = arr1.filter(function(elm) {
                return !arr2.includes(elm);
            });
            return rtn;
        }

        return {
            diff: _diff
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