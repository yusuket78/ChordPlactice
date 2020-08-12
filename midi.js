//■改善したいこと
//同じ種類のコードなら、ルートからのオフセット値で正解定義できる
//ベース音を一緒に練習する場合の処理


//正解定義
const chord = {//メジャーコード
               "C":[0,4,7],
               "Db":[1,5,8],
               "D":[2,6,9],
               "Eb":[3,7,10],
               "E":[4,8,11],
               "F":[5,9,0],
               "Gb":[6,10,1],
               "G":[7,11,2],
               "Ab":[8,0,3],
               "A":[9,1,4],
               "Bb":[10,2,5],
               "B":[11,3,6],
                //マイナーコード
               "Cm":[0,3,7],
               "C#m":[1,4,8],
               "Dm":[2,5,9],
               "Ebm":[3,6,10],
               "Em":[4,7,11],
               "Fm":[5,8,0],
               "F#m":[6,9,1],
               "Gm":[7,10,2],
               "G#m":[8,11.3],
               "Am":[9,0,4],
               "Bbm":[10,1,5],
               "Bm":[11,2,6]
               };
//ランダム抽選用配列
const chordName=0;
const totalCnt=1;
const validCnt=2;
const invalidCnt =3;
var chordlist =[//メジャーコード
                ["C",0,0,0],
                ["Db",0,0,0],
                ["D",0,0,0],
                ["Eb",0,0,0],
                ["E",0,0,0],
                ["F",0,0,0],
                ["Gb",0,0,0],
                ["G",0,0,0],
                ["Ab",0,0,0],
                ["A",0,0,0],
                ["Bb",0,0,0],
                ["B",0,0,0],
                //マイナーコード
               ["Cm",0,0,0],
               ["C#m",0,0,0],
               ["Dm",0,0,0],
               ["Ebm",0,0,0],
               ["Em",0,0,0],
               ["Fm",0,0,0],
               ["F#m",0,0,0],
               ["Gm",0,0,0],
               ["G#m",0,0.0],
               ["Am",0,0,0],
               ["Bbm",0,0,0],
               ["Bm",0,0,0]
              ]
//ユーザー表示用
const noteList =["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
var inputNotes =[];
var chordPoint = 0;
var cullentChord = "";

	window.onload = function()
	{
		var midi_num=0;
		var log=null;
    changeChord();


	/* -------------------- MIDI -------------------- */
		var m=null;
		var inputs=null;
		var outputs=null;

		navigator.requestMIDIAccess().then( success, failure );

		function success(midiAccess)
		{
			m=midiAccess;

			if (typeof m.inputs === "function") {
				inputs=m.inputs();
				outputs=m.outputs();
			} else {
				var inputIterator = m.inputs.values();
				inputs = [];
				for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
					inputs.push(o.value)
				}

				var outputIterator = m.outputs.values();
				outputs = [];
				for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
					outputs.push(o.value)
				}
			}

			for(var i=0; i<inputs.length; i++){
				inputs[i].onmidimessage = handleMIDIMessage;
			}
		}
}
		function failure(error)
		{
			alert( "Midi not found!" );
		}

		function handleMIDIMessage( event ) {
      //console.dir(event);

			if( event.data[0] ==0xFE ) return;

			if( event.data.length>1) {
        if(event.data[0]==144){
          var note = convertScale(event.data[1]);
          console.dir(note);
          checkChord(note);
        }
			}
		}


  function convertScale(noteNumber){
    num=noteNumber%12;
    return num;
  }

  function checkChord(note){
    var truecount = 0;
    inputNotes.push(note);

   //展開コード、アルペジオを考慮して、全通り比較。
   if(inputNotes.length == chord[cullentChord].length){
     for (var i = 0, len = inputNotes.length; i < len; ++i) {
        for (var k = 0, len = chord[cullentChord].length; k < len; ++k) {
          if(inputNotes[i]==chord[cullentChord][k]){
            truecount = truecount + 1;
          }
        }
      }
      console.log(truecount);
      if(truecount >=chord[cullentChord].length){
        countScore(true);
      }else{
        countScore(false);
      }
      inputNotes=[];
      changeChord();
      displayscore();
    }
  }

  function changeChord(){
    chordPoint = Math.floor(Math.random() * chordlist.length);
    cullentChord = chordlist[chordPoint][chordName];
    document.getElementById("question").innerText = cullentChord;
  }
  function countScore(flag){
     chordlist[chordPoint][totalCnt] ++;
    if(flag){
     chordlist[chordPoint][validCnt] ++;
    }else{
      chordlist[chordPoint][invalidCnt] ++;
    }
  }
  function displayscore(){
    var ele = "codeName,total,collect,incollect</br>";
    for (var i = 0, len = chordlist.length; i < len; ++i) {
      console.dir(chordlist[i]);
       ele += chordlist[i].join(",") +"</br>";
    }
    document.getElementById("score").innerHTML = ele;
  }
