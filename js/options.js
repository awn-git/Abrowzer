(function() {


    _init();


    function _init() {
        _load();
        _saveBtn();
        return;
    }

    function _load(){        
        return;
    }

    function _saveBtn() {
        var elm = document.getElementById("save");
        var obj = {
            debug: null,
            key:null
        };
        var show_elm = document.getElementById("status");

        elm.addEventListener("click", function(ev) {
            obj.debug   = document.getElementById("debug").value;
            obj.key = document.getElementById("key").value;
            chrome.runtime.sendMessage({options: obj});

            show_elm.textContent = "save has done";
            setTimeout(function() {
                show_elm.textContent = '';
            }, 750);

            return;
        });
        return;
    }

    return;
})();