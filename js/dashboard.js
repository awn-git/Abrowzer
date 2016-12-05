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
    /* private member */
    var bg; //backgroundの_bgobj
    var configs;
    var defaultconfigs;

    var suresavebtn = {
        "enableRegExp_sure": null,
        "ngwords": null,
        "ngnames": null,
        "ngmails": null,
        "ngids": null
    };
    var suretaisavebtn = {
        "enableRegExp_suretai": null,
        "ngsuretai": null
    }



    /* initializer */
    _init();


    /* private method */
    function _getForm(parm) {
        return document.forms[parm];
    }


    function _init() {
        _setDashboard();
        _setSaveBtnEventListener("sure-savebtn", suresavebtn, _checkSureRegexp);
        _setSaveBtnEventListener("suretai-savebtn", suretaisavebtn, _checkSuretaiRegexp);

        _setChooseAllBtnEventListener("hisitaall", "his");
        _setChooseAllBtnEventListener("hissureall", "his");
        _setHistoryDeleteBtnEventListener("hisita-deletebtn");
        _setHistoryDeleteBtnEventListener("hissure-deletebtn");

        _setChooseAllBtnEventListener("favitaall", "fav");
        _setChooseAllBtnEventListener("favsureall", "fav");

        _setFavoriteDeleteBtnEventListener("favita-deletebtn");
        _setFavoriteDeleteBtnEventListener("favsure-deletebtn");


        _setInitBtnEventListener("init-btn");
        _loadConfig("configio-loadbtn");
        _saveConfig("configio-savebtn");

        _chooseAll("configio");

        _viewAnotherPage("toku_surerireki");
        _viewAnotherPage("toku_imgurdel");

        _saveTenpure();
        _saveAutosaveRireki();

        return;
    }


    function _setDashboard() {
        chrome.runtime.getBackgroundPage(function(backgroundPage) {
            bg = backgroundPage.bg.getBG();
            configs = backgroundPage.bg.getConfigs();
            defaultconfigs = backgroundPage.bg.getDefaultConfigs();

            _setConfig(bg.preserve.dashboard);
            _setFavorite(bg.preserve.favorite);
            _setHistory(bg.preserve.history);
            _setTenpure(bg.preserve.tenpure);

        });
        return;
    }


    function _setConfig(das) {
        var form = _getForm("main");
        for (var key in das) {
            form[key].value = das[key];
        }
        return;
    }


    function _displayPreservedData(data, name) {
        var data;
        var output;
        if (data.length) {
            var str;
            if (name.indexOf("ita") > -1) {
                output = data.map(function(elm) {
                    str = "<input type='checkbox' name='" + name + "'><a href = '" + elm.url + "' target='_blank'>【" + elm.bbsnameJ + "】</a></input><br>";
                    return str;
                });
            } else {
                output = data.map(function(elm) {
                    str = "<input type='checkbox' name='" + name + "'>【" + elm.bbsnameJ + "】<a href = '" + elm.url + "l50' target='_blank'>" + elm.suretai + "</a></input><br>";
                    return str;
                });
            }
            output = output.join("");
        } else {
            if (name.indexOf("his") > -1) {
                output = "<span>履歴、ありません。。</span>";
            } else if (name.indexOf("fav") > -1) {
                output = "<span>お気に入り、ありません。。</span>";
            }
        }
        return output;
    }


    function _setHistory(his) {
        var itahtml = _displayPreservedData(his.ita, "hisita");
        var surehtml = _displayPreservedData(his.sure, "hissure");
        var d = document;

        d.getElementById("hisita").innerHTML = itahtml;
        d.getElementById("hissure").innerHTML = surehtml;

        if (his.ita.length) {
            d.getElementById("hisita-delete").setAttribute("style", "display:block");
        }
        if (his.sure.length) {
            d.getElementById("hissure-delete").setAttribute("style", "display:block");
        }
        return;
    }

    function _setFavorite(fav) {
        var itahtml = _displayPreservedData(fav.ita, "favita");
        var surehtml = _displayPreservedData(fav.sure, "favsure");
        var d = document;

        d.getElementById("favita").innerHTML = itahtml;
        d.getElementById("favsure").innerHTML = surehtml;

        if (fav.ita.length) {
            d.getElementById("favita-delete").setAttribute("style", "display:block");
        }
        if (fav.sure.length) {
            d.getElementById("favsure-delete").setAttribute("style", "display:block");
        }
        return;
    }


    function _sendMessageToBackground(parm) {
        chrome.runtime.sendMessage(parm);
        return;
    }


    function _setSaveBtnEventListener(id, obj, func) {
        var elm = document.getElementById(id);
        elm.addEventListener("click", function() {
            if (confirm("保存しますか？")) {
                var form = _getForm("main");
                for (var key in obj) {
                    obj[key] = form[key].value;
                }
                var message = func(obj);
                if (message) {
                    _sendMessageToBackground({ dashboard: message });
                }
            }
            return;
        });
        return;
    }


    function _checkSureRegexp(obj) {
        if (obj.enableRegExp_sure === "yes") {
            try {
                obj["ngwords"].split("\n").filter(function(elm) {
                    return elm !== "";
                }).map(function(elm) {
                    return new RegExp(elm);
                });
                obj["ngmails"].split("\n").filter(function(elm) {
                    return elm !== "";
                }).map(function(elm) {
                    return new RegExp(elm);
                });
                obj["ngnames"].split("\n").filter(function(elm) {
                    return elm !== "";
                }).map(function(elm) {
                    return new RegExp(elm);
                });
                obj["ngids"].split("\n").filter(function(elm) {
                    return elm !== "";
                }).map(function(elm) {
                    return new RegExp(elm);
                });
            } catch (e) {
                alert("正規表現が間違っているようです");
                return false;
            }
            return obj;
        } else {
            return obj;
        }
    }


    function _checkSuretaiRegexp(obj) {
        if (obj.enableRegExp_suretai === "yes") {
            try {
                obj["ngsuretai"].split("\n").filter(function(elm) {
                    return elm !== "";
                }).map(function(elm) {
                    return new RegExp(elm);
                });
            } catch (e) {
                alert("正規表現が間違っているようです");
                return false;
            }
            return obj;
        } else {
            return obj;
        }
    }

    function _setChooseAllBtnEventListener(id, category) {
        var elm = document.getElementById(id);
        var type = id.indexOf("ita") > -1 ? "ita" : "sure";

        elm.addEventListener("change", function() {
            var isElmChecked = elm.checked;
            var data = _getForm("main")[(category + type)];

            if (data.length) {
                for (var ix = 0, len = data.length; ix < len; ix++) {
                    data[ix].checked = isElmChecked;
                }
            } else {
                data.checked = isElmChecked;
            }
            return;
        });
        return;
    }

    function _setHistoryDeleteBtnEventListener(id) {
        var elm = document.getElementById(id);
        var type = id.indexOf("ita") > -1 ? "ita" : "sure";

        elm.addEventListener("click", function() {
            if (confirm("削除しますか？")) {
                var data = _getForm("main")[("his" + type)];
                var cnt = 0;

                if (data.length) {
                    for (var ix = 0, len = data.length; ix < len; ix++) {
                        if (data[ix].checked) {
                            bg.preserve.history[type][ix].url = "delete";
                            cnt++;
                        }
                    }
                } else {
                    if (data.checked) {
                        bg.preserve.history[type][0].url = "delete";
                        cnt++;
                    }
                }

                if (cnt) {
                    var newhistory = bg.preserve.history[type].filter(function(elm) {
                        return elm.url !== "delete";
                    });
                    bg.preserve.history[type] = newhistory;
                    _sendMessageToBackground({ history: bg.preserve.history });
                    location.reload();
                }
            }
            return;
        });
        return;
    }

    function _setInitBtnEventListener(id) {
        var elm = document.getElementById(id);

        elm.addEventListener("click", function() {
            if (confirm("初期化しますか？")) {
                var form = _getForm("main");
                for (var key in defaultconfigs) {
                    form[key].value = defaultconfigs[key];
                }
                _sendMessageToBackground({ dashboard: defaultconfigs });
            }
            return;
        });
        return;
    }


    function _setFavoriteDeleteBtnEventListener(id) {
        var elm = document.getElementById(id);
        var type = id.indexOf("ita") > -1 ? "ita" : "sure";

        elm.addEventListener("click", function() {
            if (confirm("削除しますか？")) {
                var data = _getForm("main")[("fav" + type)];
                var cnt = 0;

                if (data.length) {
                    for (var ix = 0, len = data.length; ix < len; ix++) {
                        if (data[ix].checked) {
                            bg.preserve.favorite[type][ix].url = "delete";
                            cnt++;
                        }
                    }
                } else {
                    if (data.checked) {
                        bg.preserve.favorite[type][0].url = "delete";
                        cnt++;
                    }
                }

                if (cnt) {
                    var newfavorite = bg.preserve.favorite[type].filter(function(elm) {
                        return elm.url !== "delete";
                    });
                    bg.preserve.favorite[type] = newfavorite;
                    _sendMessageToBackground({ favorite: bg.preserve.favorite });
                    location.reload();
                }
            }
            return;
        });
        return;
    }

    function _loadConfig(id) {
        var elm = document.getElementById(id);
        var textarea = document.getElementById("configio");
        elm.addEventListener("click", function() {
            var myconfigJ = JSON.stringify(bg.preserve.dashboard);
            textarea.value = myconfigJ;
            return;
        });
        return;
    }

    function _saveConfig(id) {
        var elm = document.getElementById(id);
        var textarea = document.getElementById("configio");
        elm.addEventListener("click", function() {

            var myconfigJ = textarea.value.trim();
            console.dir(myconfig);
            console.dir(defaultconfigs);

            //未入力ならば終了
            if (textarea.value.trim() === "") {
                alert("何も入力されていないみたいです。。");
                return;
            }

            //JSON文字列でないなら終了
            try {
                var myconfig = JSON.parse(myconfigJ);
            } catch (e) {
                alert("入力文字列の形式がおかしいです。。");
                return;
            }

            //keyが揃わないなら終了
            var myconkeys = Object.keys(myconfig);
            var defaultkeys = Object.keys(defaultconfigs);
            var isPropSame_m2d = false,
                isPropSame_d2m = false;
            isPropSame_m2d = defaultkeys.every(function(elm) {
                return myconkeys.find(function(inelm) {
                    return inelm === elm;
                })
            });
            isPropSame_d2m = myconkeys.every(function(elm) {
                return defaultkeys.find(function(inelm) {
                    return inelm === elm;
                })
            });

            if (!(isPropSame_m2d && isPropSame_d2m)) {
                alert("存在しない項目を設定 or 存在する項目を未設定なようです。。");
                return;
            }

            //正規表現を設定している場合、正規表現でエラーが出れば終了
            if (_checkSureRegexp(myconfig) === false) {
                alert("NGキーワードのどこかでおかしい正規表現が含まれているようです。。");
                return;
            }

            if (_checkSuretaiRegexp(myconfig) === false) {
                alert("NGスレタイのどこかでおかしい正規表現が含まれているようです。。");
                return;
            }

            //正規表現を設定していない場合 -> NG処理の中でエスケープするので問題無し

            //dashboard.js内部の更新
            bg.preserve.dashboard = myconfig;
            _setConfig(bg.preserve.dashboard);

            //background.js内部の更新
            _sendMessageToBackground({ dashboard: bg.preserve.dashboard });

            //テキストエリアの清掃
            textarea.value = "設定を反映しますた。";
            setTimeout(function() {
                textarea.value = "";
            }, 3000);

            return;
        });
        return;
    }

    function _chooseAll(id) {
        var elm = document.getElementById(id);
        elm.addEventListener("focus", function() {
            elm.select();
        });
        return;
    }

    function _viewAnotherPage(id) {
        var elm = document.getElementById(id);
        elm.addEventListener("click", function(ev) {
            ev.preventDefault();
            //chrome.tabs.create({url: "http://google.com"});
            alert("準備中です。。");
            return;
        });
        return;
    }

    function _saveTenpure() {
        var elm = document.getElementById("tenpure_savevtn");
        var fm = _getForm("main");
        var obj = {
            title: null,
            name: null,
            mail: null,
            text: null
        };

        elm.addEventListener("click", function(ev) {
            if (confirm("保存しますか？")) {
                obj.title = fm["tenpure_title"].value;
                obj.name = fm["tenpure_name"].value;
                obj.mail = fm["tenpure_mail"].value;
                obj.text = fm["tenpure_text"].value;
                _sendMessageToBackground({ tenpure: obj });
            }
            return;
        });
    }

    function _setTenpure(obj) {
        var fm = _getForm("main");
        fm["tenpure_title"].value = obj.title;
        fm["tenpure_name"].value = obj.name;
        fm["tenpure_mail"].value = obj.mail;
        fm["tenpure_text"].value = obj.text;

        return;
    }

    function _saveAutosaveRireki() {
        var elm = document.getElementById("autosave_rirekibtn");
        elm.addEventListener("click", function(ev) {
            if (confirm("保存しますか？")) {
                var fm = _getForm("main");
                var enableAutosave = fm["autosave_rireki"].value;
                _sendMessageToBackground({ autosave: enableAutosave });
            }
        })
        return;
    }

    /* public api */
    return;
})();