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
//@title sample.js
//@description サンプル的なjavascriptです。
//
//作った人: Awn(@Awn_tw)
//
//改定履歴
//-20xxxxxx(ver 1.0.0) : 新規作成
//
////////////////////////////////////////////////////////////////////////////////
(function() {
    /* private member */
    var bg; //backgroundの_bgobj
    var configs;
    var defaultconfigs;

    var suresavebtn = {
        "abonetype": null,
        "imgurabone": null,
        "oekakiabone": null,
        "ngkeywordregexp": null,
        "ngwords": null,
        "ngnames": null,
        "ngmails": null,
        "ngids": null
    };
    var suretaisavebtn = {
        "suretaiabone": null,
        "suretaikaigyou": null,
        "ngsuretai": null,
        "ngsuretairegexp": null
    }
    var modorusavebtn = {
        "modoru": null
    };



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
        _setSaveBtnEventListener("modoru-savebtn", modorusavebtn, function(inp) {return inp;});
        _setChooseAllBtnEventListener("hisitaall");
        _setChooseAllBtnEventListener("hissureall");
        _setHistoryDeleteBtnEventListener("hisita-deletebtn");
        _setHistoryDeleteBtnEventListener("hissure-deletebtn");
        _setInitBtnEventListener("init-btn");
        return;
    }


    function _setDashboard() {
        chrome.runtime.getBackgroundPage(function(backgroundPage) {
            bg = backgroundPage.bg.getBG();
            configs = backgroundPage.bg.getConfigs();
            defaultconfigs = backgroundPage.bg.getDefaultConfigs();

            _setConfig(bg.preserve.dashboard);
            //_setFavorite(bg.preserve.faborite);
            _setHistory(bg.preserve.history);
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


    function _generateHistoryTexts(data, name) {
        var data;
        var output;
        if (data.length) {
            var str;
            if (name === "hisita") {
                output = data.map(function(elm) {
                    str = "<input type='checkbox' name='hisita'><a href = '" + elm.url + "' target='_blank'>【" + elm.bbsnameJ + "】</a></input><br>";
                    return str;
                });
            } else {
                output = data.map(function(elm) {
                    str = "<input type='checkbox' name='hissure'>【" + elm.bbsnameJ + "】<a href = '" + elm.url + "l50' target='_blank'>" + elm.suretai + "</a></input><br>";
                    return str;
                });
            }
            output = output.join("");
        } else {
            output = "<span>履歴、ありません。。</span>";
        }
        return output;
    }


    function _setHistory(his) {
        var itahtml = _generateHistoryTexts(his.ita, "hisita");
        var surehtml = _generateHistoryTexts(his.sure, "hissure");
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
        if (obj.ngkeywordregexp === "yes") {
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
        if (obj.ngsuretairegexp === "yes") {
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

    function _setChooseAllBtnEventListener(id) {
        var elm = document.getElementById(id);
        var type = id.indexOf("ita") > -1 ? "ita" : "sure";

        elm.addEventListener("change", function() {
            var isElmChecked = elm.checked;
            var data = _getForm("main")[("his" + type)];

            if (data.length) {
                for (var ix = 0, len = data.length; ix < len; ix++) {
                    data[ix].checked = isElmChecked;
                }
            }else{
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

    function _setInitBtnEventListener(id){
        var elm = document.getElementById(id);

        elm.addEventListener("click",function(){
            if( confirm("初期化しますか？") ){
                var form = _getForm("main");
                for(var key in defaultconfigs){
                    form[key].value = defaultconfigs[key];
                }
                _sendMessageToBackground({ dashboard: defaultconfigs});
            }
            return;
        });
        return;
    }

    /* public api */
    return;
})();