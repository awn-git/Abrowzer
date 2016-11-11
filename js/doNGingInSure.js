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


//MEMO:
/*
- DOM上書き実行時、".abDone"のようなクラスを設定する
  => その後".abDone"以外のdl-dt-dd要素に対して処理を行う
  => 処理済みフラグのようなものをつける
  <= ∵ でないとsplitエラー、パースエラー、Nodeが存在しないよエラーなどになる。
  => あぼ〜ん処理においての話です。

*/

/* この関数の責務
	- スレのdl,dt,dd要素を取得する
	- あぼーん候補を抽出する
	- あぼーんを実行する
*/

/*
memo:
var uzrInput = $("#MESSAGE").val();
var data = uzrInput.split("\n");
var uzrReg = data.map(function(elm){return new RegExp(elm);});


var elm = document.getElementById("MESSAGE").value; <- valueで取れば
var data = uzrInput.split("\n"); <- うまいかんじで
var uzrReg = data.map(function(elm){return new RegExp(elm);}); <- 正規表現できる。

*/

(function(){
	console.log("this is execfrombg");
	console.log("I'm in " + location.href);

/* スレのdl,dt,dd要素を取得する */
	var Op2SureObj = (function(){
		/* private member */

		var _dl  = [];//_dl = _dt + _dd
		var _dt  = [];//_dtはレス番号、名前欄、日付欄、メール欄、IDが格納されている
		var _dd  = [];//_ddは本文が格納されている
		var _res = [];//プリミティブな感じで上記の内容を格納

		_extractDx();

		function _extractDx(){
			//一時変数
			var _dthread
			var _dttemp;
			var _mailtemp;
			var _dllength = 0;

			//resに格納する情報
			var _num;
			var _name;
			var _mail;
			var _id;
			var _text;


			//dl要素を取得する
			_dthread  = document.querySelector(".thread");
			_dl = _dthread.getElementsByTagName("dl"); 

			//_data.resに格納する範囲を更新する
			_dllength = _dl.length;

			//dlをdtとddに分解する
			for(var ix = 0; ix < _dllength; ix++){
				_dt.push( _dl[ix].getElementsByTagName("dt")[0] );
				_dd.push( _dl[ix].getElementsByTagName("dd")[0] );
			}

			//_dt,_ddの各要素毎にレス情報を取得する
			for(var ix = 0; ix < _dllength; ix++){

				/* _dt に関する処理 */
				//テキスト(レス内容)取得処理
				_text = _dd[ix].innerText;

				/* _dd に関する処理 */
				//メール欄取得処理
				_mailtemp = _dt[ix].querySelector("font > a") || _dt[ix].querySelectorAll("a")[1];
				_mail = _mailtemp === null || _mailtemp === undefined ? undefined : _mailtemp.getAttribute("href").split(":")[1];


				//レス番号、名前欄、日付欄、ID取得処理
				_dttemp = _dt[ix].innerText.split("：");
				_num  = _dttemp[0].match(/[0-9]*/)[0] - 0;
				_name = _dttemp[1].substr(_dttemp[1].length-1) === " " ? _dttemp[1].substr(0,_dttemp[1].length-1) : _dttemp[1];
				_id   = _dttemp[2].split(" ID:")[1].split(" ")[0];


				//オブジェクトに格納する
				_res.push( {
					num  : _num,
					name : _name,
					mail : _mail, 
					id   : _id,
					text : _text
				});
			}//end of for

		return;	
		}//end of _extractDx
	
	return {
			dl  : _dl,
			dt  : _dt,
			dd  : _dd,
			res : _res
		};
	})();



	//end of Op2SureObj


/* あぼーん候補を抽出する */

/*
	- 本文
	- 名前
	- ID
	- メール
	- imgur画像
	- お絵かき画像
*/

	var len = Op2SureObj.res.length;

	var aboneArea = {
		texts : ["うほ","定理"],
		names : [],
		ids : ["123"],
		mails : ["ageo"]
	};

	var r1,r2,r3,r4;
	var output = [];
	for(var ix = 0; ix < len; ix++){
		r1 = aboneArea.texts.some(function(elm){return Op2SureObj.res[ix].text.indexOf(elm) > -1;});
		r2 = aboneArea.names.some(function(elm){return Op2SureObj.res[ix].name.indexOf(elm) > -1 ;});
		r3 = Op2SureObj.res[ix].mail === undefined ? false : aboneArea.mails.some(function(elm){return Op2SureObj.res[ix].mail.indexOf(elm);});
		r4 = aboneArea.ids.some(function(elm){return Op2SureObj.res[ix].id.indexOf(elm) > -1;});	
		if( r1 || r2 || r3 || r4){
			output.push(ix);
		}
	}
console.log(output);

/* あぼーんを実行する */
//d.dd[0].classList.add("abababa");


console.dir( Op2SureObj );

	return Op2SureObj;//<= last return into background.js
})();


/**********************************************************************/







