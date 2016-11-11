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

/*
    dashboard.jsの機能
        - ページが開いたら、データを読み込む
        - ボタンを押したら、データを書き込む
*/
(function() {

    /* private member */
    var form = document.forms.main;
    var bg;


    /* initializer */
    _init();


    /* private method */
    function _init() {
        _setDashboard();
        _setSaveBtnEventListener("sure-savebtn");
        _setSaveBtnEventListener("suretai-savebtn");
        //_setSaveBtnEventListener("autoaku-savebtn");
        _setSaveBtnEventListener("modoru-savebtn");
        _setChooseAllBtnEventListener("hisitaall");
        _setChooseAllBtnEventListener("hissureall");
        _setHistoryDeleteBtnEventListener("hisita-deletebtn");
        _setHistoryDeleteBtnEventListener("hissure-deletebtn");
        return;
    }

    function _setDashboard() {
        chrome.runtime.getBackgroundPage(function(backgroundPage) {
            var data = backgroundPage.bg.getBG();
            bg = data;
            form.abonetype.value = data.preserve.dashboard.abonetype;
            form.imgurabone.value = data.preserve.dashboard.imgurabone;
            form.oekakiabone.value = data.preserve.dashboard.oekakiabone;
            form.ngwords.value = data.preserve.dashboard.ngwords;
            form.ngnames.value = data.preserve.dashboard.ngnames;
            form.ngmails.value = data.preserve.dashboard.ngmails;
            form.ngids.value = data.preserve.dashboard.ngids;
            form.suretaiabone.value = data.preserve.dashboard.suretaiabone;
            form.ngsuretai.value = data.preserve.dashboard.ngsuretai;
            form.suretaikaigyou.value = data.preserve.dashboard.suretaikaigyou;
            form.modoru.value = data.preserve.dashboard.modoru;
            form.autoaku.value = data.preserve.dashboard.autoaku;
            //form.autoakuwords.value   = data.preserve.dashboard.autoakuwords;

            _setHistory(data.preserve.history);

        });
        return;
    }

    function _setHistory(his) {
        var ita = his.ita; //array
        var sure = his.sure; //array
        var itastr = "";
        var surestr = "";
        var d = document;
        var divhisita = d.getElementById("hisita");
        var divhissure = d.getElementById("hissure");
        var divhisitadelete = d.getElementById("hisita-delete");
        var divhissuredelete = d.getElementById("hissure-delete");

        if (ita.length > 0) {
            for (var ix = 0, italen = ita.length; ix < italen; ix++) {
                itastr += "<input type='checkbox' name='hisita'><a href = '" + ita[ix].url + "' target='_blank'>【" + ita[ix].bbsnameJ + "】</a></input><br>";
            }
            divhisitadelete.setAttribute("style", "display:block");

        } else {
            itastr = "<span>履歴、ありません。。</span>";
        }


        if (sure.length > 0) {
            for (var ix = 0, surelen = sure.length; ix < surelen; ix++) {
                surestr += "<input type='checkbox' name='hissure'>【" + sure[ix].bbsnameJ + "】<a href = '" + sure[ix].url + "l50' target='_blank'>" + sure[ix].suretai + "</a></input><br>";
            }
            divhissuredelete.setAttribute("style", "display:block");
        } else {
            surestr = "<span>履歴、ありません。。</span>";
        }



        divhisita.innerHTML = itastr;
        divhissure.innerHTML = surestr;


        return;
    }

    function _getFormValues() {
        /* [今北産業]
            - formの
            - 値を
            - 取得する
        */
        var rtn = {};
        var form = document.forms.main;
        var _abonetype = form.abonetype.value;
        var _imgurabone = form.imgurabone.value;
        var _oekakiabone = form.oekakiabone.value;
        var _ngwords = form.ngwords.value;
        var _ngnames = form.ngnames.value;
        var _ngmails = form.ngmails.value;
        var _ngids = form.ngids.value;
        var _suretaiabone = form.suretaiabone.value;
        var _ngsuretai = form.ngsuretai.value;
        var _suretaikaigyou = form.suretaikaigyou.value;
        var _modoru = form.modoru.value;
        var _autoaku = form.autoaku.value;
        var _autoakuwords = form.autoakuwords.value;

        rtn = {
            suresavebtn: {
                abonetype: _abonetype,
                imgurabone: _imgurabone,
                oekakiabone: _oekakiabone,
                ngwords: _ngwords,
                ngnames: _ngnames,
                ngmails: _ngmails,
                ngids: _ngids,
            },
            suretaisavebtn: {
                suretaiabone: _suretaiabone,
                suretaikaigyou: _suretaikaigyou,
                ngsuretai: _ngsuretai,
            },
            modorusavebtn: {
                modoru: _modoru,
            },
            autoakusavebtn: {
                autoaku: _autoaku,
                autoakuwords: _autoakuwords
            }
        };
        return rtn;
    }

    function _sendMessageToBackground(parm) {
        chrome.runtime.sendMessage(parm);
        return;
    }

    //debugger;//さくじょしょりかくのめんどうだね
    function _deleteSomething() {
        for (var ix = 0; ix < form.main.hissure.length; ix++) {
            form.main.hissure[ix].checked ? check.push(ix) : undefined;
        }
        return;
    }


    function _setSaveBtnEventListener(id) {
        var elm = document.getElementById(id);
        elm.addEventListener("click", function() {
            var ans = confirm("保存しますか？");
            if (ans) {
                var data = _getFormValues();
                var key = id.split("-").join("");
                var mes = data[key];
                _sendMessageToBackground({ dashboard: mes });
            }
        });
    }


    function _setChooseAllBtnEventListener(name) {
        var elm = document.getElementsByName(name)[0];
        elm.addEventListener("change", function() {
            var isElmChecked = elm.checked;
            var inputbox = form[name.slice(0, -3)];
            for (var ix = 0, len = inputbox.length; ix < len; ix++) {
                inputbox[ix].checked = isElmChecked;
            }
        })
    }

    function _setHistoryDeleteBtnEventListener(id) {
        var elm = document.getElementById(id);
        var type = id.indexOf("ita") > -1 ? "ita" : "sure";

        elm.addEventListener("click", function() {
            var ans = confirm("削除しますか？");
            if (ans) {
                var data = type === "ita" ? document.forms.main.hisita : document.forms.main.hissure;
                var cnt = 0;
                if (data[0] !== undefined) {
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
            }
            if (cnt) {
                var newhistory = bg.preserve.history[type].filter(function(elm) {
                    return elm.url !== "delete";
                });
                bg.preserve.history[type] = newhistory;
                _sendMessageToBackground({ history: bg.preserve.history });
                location.reload();
            }
        });
    }

    /* public api */

    return;
})();