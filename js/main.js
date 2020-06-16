$(window).on("load", function() {

  //ウインドウを開いた時点の初期化動作

  //艦種一覧データを読み込んで、艦娘選択モーダルウィンドウのタブに表示させる処理
  $.get('./data/MY_SHIPTYPE.csv', function(data) {
    let csv = $.csv.toArrays(data);
    let itemlist = '';
    let list1 = '<button class="btn btn-primary pl-1 pr-1 init_tag" name="CL" data-toggle="button" onclick=show_CL();>全て表示</button>';
    let list2 = '<button class="btn btn-primary pl-1 pr-1 init_tag" name="CL" data-toggle="button" onclick=show_DD();>全て表示</button>';
    let list3 = '<button class="btn btn-primary pl-1 pr-1 init_tag" name="CL" data-toggle="button" onclick=show_DE();>全て表示</button>';
    $(csv).each(function(index) {
      if (this[0] != "id") {
        if (this[1] == "2") {
          switch (this[3]) {
            case "CL":
              list1 += '<button class="btn btn-outline-dark tag" name="CL" onclick="filter_CL(\''+this[0]+'\');">' + this[2] + '</button>';
              break;
            case "DD":
              list2 += '<button class="btn btn-outline-dark tag" name="DD" onclick="filter_DD(\''+this[0]+'\');">' + this[2] + '</button>';
              break;
            case "DE":
              list3 += '<button class="btn btn-outline-dark tag" name="DE" onclick="filter_DE(\''+this[0]+'\');">' + this[2] + '</button>';
              break;
          }
        }
      }
    })
    $("#myship_category").append(itemlist);
    $("#myship_type-CL").append(list1);
    $("#myship_type-DD").append(list2);
    $("#myship_type-DE").append(list3);
  });

  //艦娘データを読み込んで艦娘選択モーダルウィンドウにリストを表示させる処理
  $.get('./data/MY_SHIP.csv', function(data) {
    csv = $.csv.toArrays(data);
    list1 = '';
    list2 = '';
    list3 = '';
    $(csv).each(function(index) {
      if (this[0] != "id") {
        switch (this[1]) {
          case "CL":
            if (this[9]=="FALSE"){
              list1 += '<a href="javascript:ship_open(\'DD:'+ this[0] + ':'+ this[2] +':'+ this[3] + ':'+ this[4] + ':'+ this[5] + ':'+ this[6]+':'+ this[7]+':'+ this[10]+'\');" class="list-group-item list-group-item-action lists CL INCOMP ' + this[8] +'">';
            } else {
              list1 += '<a href="javascript:ship_open(\'DD:'+ this[0] + ':'+ this[2] +':'+ this[3] + ':'+ this[4] + ':'+ this[5] + ':'+ this[6]+':'+ this[7]+':'+ this[10]+'\');" class="list-group-item list-group-item-action lists CL COMP ' + this[8] +'">';
            }
            list1 += '<div class="d-flex align_medium">';
            list1 += '<div class="width_56p"><img src="./img/ship/' + this[0] + '.png">&nbsp;' + this[2] + '</div>';
            list1 += '<div class="width_12p font-slot text_medium">' + this[3] + '</div>';
            list1 += '<div class="width_10p font-pw text_medium">' + this[4] + '</div>';
            list1 += '<div class="width_10p font-th text_medium">' + this[5] + '</div>';
            list1 += '<div class="width_12p font-as text_medium">' + this[7] + '</div>';
            list1 += '</div></a>';
            break;
          case "DD":
            if (this[9]=="FALSE"){
              list2 += '<a href="javascript:ship_open(\'DD:'+ this[0] + ':'+ this[2] +':'+ this[3] + ':'+ this[4] + ':'+ this[5] + ':'+ this[6]+':'+ this[7]+':'+ this[10]+'\');" class="list-group-item list-group-item-action lists DD INCOMP ' + this[8] +'">';
            } else {
              list2 += '<a href="javascript:ship_open(\'DD:'+ this[0] + ':'+ this[2] +':'+ this[3] + ':'+ this[4] + ':'+ this[5] + ':'+ this[6]+':'+ this[7]+':'+ this[10]+'\');" class="list-group-item list-group-item-action lists DD COMP ' + this[8] +'">';
              //引数 [艦種(0),艦ID(1),スロット数(3),火力(4),雷装(5),対潜初期(6),対潜最大(7),射程(8)]
            }
            list2 += '<div class="d-flex">';
            list2 += '<div class="width_56p"><img src="./img/ship/' + this[0] + '.png">&nbsp;' + this[2] + '</div>';
            list2 += '<div class="width_12p font-slot text_medium">' + this[3] + '</div>';
            list2 += '<div class="width_10p font-pw text_medium">' + this[4] + '</div>';
            list2 += '<div class="width_10p font-th text_medium">' + this[5] + '</div>';
            list2 += '<div class="width_12p font-as text_medium">' + this[7] + '</div>';
            list2 += '</div></a>';
            break;
          case "DE":
            if (this[9]=="FALSE"){
              list3 += '<a href="javascript:ship_open(\'DD:'+ this[0] + ':'+ this[2] +':'+ this[3] + ':'+ this[4] + ':'+ this[5] + ':'+ this[6]+':'+ this[7]+':'+ this[10]+'\');" class="list-group-item list-group-item-action lists DE INCOMP ' + this[8] +'">';
            } else {
              list3 += '<a href="javascript:ship_open(\'DD:'+ this[0] + ':'+ this[2] +':'+ this[3] + ':'+ this[4] + ':'+ this[5] + ':'+ this[6]+':'+ this[7]+':'+ this[10]+'\');" class="list-group-item list-group-item-action lists DE COMP ' + this[8] +'">';
            }
            list3 += '<div class="d-flex">';
            list3 += '<div class="width_56p"><img src="./img/ship/' + this[0] + '.png">&nbsp;' + this[2] + '</div>';
            list3 += '<div class="width_12p font-slot text_medium">' + this[3] + '</div>';
            list3 += '<div class="width_10p font-pw text_medium">' + this[4] + '</div>';
            list3 += '<div class="width_10p font-th text_medium">' + this[5] + '</div>';
            list3 += '<div class="width_12p font-as text_medium">' + this[7] + '</div>';
            list3 += '</div></a>';
            break;
        }
      }
    })
    $("#myship_list-CL").append(list1);
    $("#myship_list-DD").append(list2);
    $("#myship_list-DE").append(list3);

    listitem=document.getElementsByClassName('INCOMP');
    $(listitem).each(function(index) {
      this.style.display = "none";
    })
  });
})


//イベント発生処理　(艦娘モーダルウィンドウ関連のイベント)

//艦娘リストモーダルウィンドウ表示
$('#ｍodal_myship').on('show.bs.modal', function (event) {
    let button= $(event.relatedTarget);
    let modal = $(this);
    modal.find('.modal-header span#get_text').text(button.data('shipframe'));
});

function ship_open(param){
  //引数 [艦種(0),艦ID(1),スロット数(3),火力(4),雷装(5),対潜初期(6),対潜最大(7),射程(8)]
  let result=param.split(':');
  let kan_frame="";

  switch (document.getElementById('get_text').innerHTML) {
    case "旗艦":kan_frame="1st";break;
    case "2番艦":kan_frame="2nd";break;
    case "3番艦":kan_frame="3rd";break;
    case "4番艦":kan_frame="4th";break;
    case "5番艦":kan_frame="5th";break;
    case "6番艦":kan_frame="6th";break;
  }

  document.getElementById("ship_"+kan_frame+"_face").src="./img/ship/" +result[1]+".png";
  document.getElementById("ship_"+kan_frame+"_name").innerHTML=result[2];
  document.getElementById("ship_"+kan_frame+"_pw").innerHTML=result[4];
  document.getElementById("ship_"+kan_frame+"_th").innerHTML=result[5];
  document.getElementById("ship_"+kan_frame+"_as").innerHTML=result[7];
  document.getElementById("ship_"+kan_frame+"_as-min").value=result[6];
  document.getElementById("ship_"+kan_frame+"_as-max").value=result[7];
  document.getElementById("ship_"+kan_frame+"_lv").innerHTML="99";
  document.getElementById("ship_"+kan_frame+"_range").innerHTML=result[8];

  document.getElementById("ship_"+kan_frame+"_basepw").innerHTML=Number(result[4])+5;
  document.getElementById("ship_"+kan_frame+"_baseth").innerHTML=Number(result[5])+5;
  let baseas=Math.sqrt(Number(result[7]))+13;
  document.getElementById("ship_"+kan_frame+"_baseas").innerHTML=baseas.toFixed(3);
  document.getElementById("ship_"+kan_frame+"_baseairpw").innerHTML=0;

      switch(result[3]){
        case "2":
          document.getElementById("ship_"+kan_frame+"_wp3").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp4").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp5").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp3-r").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp4-r").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp5-r").style.display="none";
          document.getElementById("ship_"+kan_frame+"_release").style.height="35px";
          break;
        case "3":
          document.getElementById("ship_"+kan_frame+"_wp3").style.display="block";
          document.getElementById("ship_"+kan_frame+"_wp4").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp5").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp3-r").style.display="block";
          document.getElementById("ship_"+kan_frame+"_wp4-r").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp5-r").style.display="none";
          document.getElementById("ship_"+kan_frame+"_release").style.height="60px";
          break;
        case "4":
          document.getElementById("ship_"+kan_frame+"_wp3").style.display="block";
          document.getElementById("ship_"+kan_frame+"_wp4").style.display="block";
          document.getElementById("ship_"+kan_frame+"_wp5").style.display="none";
          document.getElementById("ship_"+kan_frame+"_wp3-r").style.display="block";
          document.getElementById("ship_"+kan_frame+"_wp4-r").style.display="block";
          document.getElementById("ship_"+kan_frame+"_wp5-r").style.display="none";
          document.getElementById("ship_"+kan_frame+"_release").style.height="85px";
          break;
      }

  $('#ｍodal_myship').modal('hide');

  document.getElementById("ship_"+kan_frame+"_selected").style.display="block";
  document.getElementById("ship_"+kan_frame).style.display="none";

}

function ship_discard(){
  //引数 [艦種(0),艦ID(1),スロット数(3),火力(4),雷装(5),対潜初期(6),対潜最大(7),射程(8)]

  switch (document.getElementById('get_text').innerHTML) {
    case "旗艦":kan_frame="1st";break;
    case "2番艦":kan_frame="2nd";break;
    case "3番艦":kan_frame="3rd";break;
    case "4番艦":kan_frame="4th";break;
    case "5番艦":kan_frame="5th";break;
    case "6番艦":kan_frame="6th";break;
  }
  document.getElementById("ship_"+kan_frame+"_face").src="";
  document.getElementById("ship_"+kan_frame+"_name").innerHTML="";
  document.getElementById("ship_"+kan_frame+"_pw").innerHTML="";
  document.getElementById("ship_"+kan_frame+"_th").innerHTML="";
  document.getElementById("ship_"+kan_frame+"_as").innerHTML="";
  document.getElementById("ship_"+kan_frame+"_as-min").value="";
  document.getElementById("ship_"+kan_frame+"_as-max").value="";
  document.getElementById("ship_"+kan_frame+"_lv").innerHTML="99";
  document.getElementById("ship_"+kan_frame+"_range").innerHTML="";

  $('#ｍodal_myship').modal('hide');

  document.getElementById("ship_"+kan_frame).style.display="block";
  document.getElementById("ship_"+kan_frame+"_selected").style.display="none";
}

//艦娘データのフィルタリング処理(全て表示タグ選択)
function show_CL(target) {
  let listitem="";
  if(document.getElementById("complete_check").checked){   //checkedの場合非改造艦を読み込まない。
    listitem = document.getElementsByClassName('CL COMP');
  } else {
    listitem = document.getElementsByClassName('CL');
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}
function show_DD(target) {
  let listitem="";
  if(document.getElementById("complete_check").checked){  //checkedの場合非改造艦を読み込まない。
    listitem = document.getElementsByClassName('DD COMP');
  } else {
    listitem = document.getElementsByClassName('DD');
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}
function show_DE(target) {
  let listitem="";
  if(document.getElementById("complete_check").checked){  //checkedの場合非改造艦を読み込まない。
    listitem = document.getElementsByClassName('DE COMP');
  } else {
    listitem = document.getElementsByClassName('DE');
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}

//艦娘データのフィルタリング処理
function filter_CL(target) {
  let listitem = document.getElementsByClassName('CL');　//クラスCLを持つ要素を全て読み出し
  $(listitem).each(function(index) {
    this.style.display = "none";
  })
  if(document.getElementById("complete_check").checked){
    listitem = document.getElementsByClassName(target +' COMP'); //クラスCLかつ改造済み艦を全て読み出し
  } else {
    listitem = document.getElementsByClassName(target);
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}
function filter_DD(target) {
  let listitem = document.getElementsByClassName('DD');　//クラスDDを持つ要素を全て読み出し
  $(listitem).each(function(index) {
    this.style.display = "none";
  })
  if(document.getElementById("complete_check").checked){
    listitem = document.getElementsByClassName(target +' COMP'); //クラスDDかつ改造済み艦を全て読み出し
  } else {
    listitem = document.getElementsByClassName(target);
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}
function filter_DE(target) {
  let listitem = document.getElementsByClassName('DE');　//クラスDEを持つ要素を全て読み出し
  $(listitem).each(function(index) {
    this.style.display = "none";
  })
  if(document.getElementById("complete_check").checked){
    listitem = document.getElementsByClassName(target +' COMP'); //クラスDEかつ改造済み艦を全て読み出し
  } else {
    listitem = document.getElementsByClassName(target);
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}
function filter_complete() {
  if(document.getElementById("complete_check").checked){
    let listitem = document.getElementsByClassName('INCOMP');　//クラスINCOMP(未改造艦)を持つ要素を全て読み出し
    $(listitem).each(function(index) {
      this.style.display = "none";
    })
  } else {
    let listitem = document.getElementsByClassName('INCOMP');　//クラスINCOMP(未改造艦)を持つ要素を全て読み出し
    $(listitem).each(function(index) {
      this.style.display = "block";
    })
  }
}
