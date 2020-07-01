$(window).on("load", function() {

  //ウインドウを開いた時点の初期化動作

  //艦種一覧データを読み込んで、艦娘選択モーダルウィンドウのタブに表示させる処理
  $.get('./data/MY_SHIPTYPE.csv', function(data) {
    let csv = $.csv.toArrays(data);
    let itemlist = '';
    let list1 = '<label class="btn btn-primary pl-1 pr-1 init_tag" name="CL" onclick=show_CL();><input type="radio" />全て表示</label>';
    let list2 = '<label class="btn btn-primary pl-1 pr-1 init_tag" name="CL" onclick=show_DD();><input type="radio" />全て表示</label>';
    let list3 = '<label class="btn btn-primary pl-1 pr-1 init_tag" name="CL" onclick=show_DE();><input type="radio" />全て表示</label>';
    $(csv).each(function(index) {
      if (this[0] != "id") {
        if (this[1] == "2") {
          switch (this[3]) {
            case "CL":
              list1 += '<label class="btn btn-outline-dark tag" name="CL" onclick="filter_CL(\'' + this[0] + '\');"><input type="radio" />' + this[2] + '</label>';
              break;
            case "DD":
              list2 += '<label class="btn btn-outline-dark tag" name="DD" onclick="filter_DD(\'' + this[0] + '\');"><input type="radio" />' + this[2] + '</label>';
              break;
            case "DE":
              list3 += '<label class="btn btn-outline-dark tag" name="DE" onclick="filter_DE(\'' + this[0] + '\');"><input type="radio" />' + this[2] + '</label>';
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
            if (this[9] == "FALSE") {
              list1 += '<a href="javascript:ship_open(\'CL:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[10] + '\');" class="list-group-item list-group-item-action lists CL INCOMP ' + this[8] + '">';
            } else {
              list1 += '<a href="javascript:ship_open(\'CL:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[10] + '\');" class="list-group-item list-group-item-action lists CL COMP ' + this[8] + '">';
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
            if (this[9] == "FALSE") {
              list2 += '<a href="javascript:ship_open(\'DD:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[10] + '\');" class="list-group-item list-group-item-action lists DD INCOMP ' + this[8] + '">';
            } else {
              list2 += '<a href="javascript:ship_open(\'DD:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[10] + '\');" class="list-group-item list-group-item-action lists DD COMP ' + this[8] + '">';
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
            if (this[9] == "FALSE") {
              list3 += '<a href="javascript:ship_open(\'DE:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[10] + '\');" class="list-group-item list-group-item-action lists DE INCOMP ' + this[8] + '">';
            } else {
              list3 += '<a href="javascript:ship_open(\'DE:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[10] + '\');" class="list-group-item list-group-item-action lists DE COMP ' + this[8] + '">';
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

  });
});



//各種イベント発生処理　(艦娘モーダルウィンドウ関連のイベント)
//艦娘リストモーダルウィンドウ表示
$('#ｍodal_myship').on('show.bs.modal', function(event) {
  let button = $(event.relatedTarget);
  let modal = $(this);
  modal.find('.modal-header span#get_text').text(button.data('shipframe'));
});


//艦娘リストモーダルウインドウより艦娘選択時に実行
function ship_open(param) {
  //引数 [艦種(0),艦ID(1),スロット数(3),火力(4),雷装(5),対潜初期(6),対潜最大(7),射程(8)]
  let result = param.split(':');
  let kan_frame = "";

  switch (document.getElementById('get_text').innerHTML) {
    case "旗艦":
      kan_frame = "1st";
      break;
    case "2番艦":
      kan_frame = "2nd";
      break;
    case "3番艦":
      kan_frame = "3rd";
      break;
    case "4番艦":
      kan_frame = "4th";
      break;
    case "5番艦":
      kan_frame = "5th";
      break;
    case "6番艦":
      kan_frame = "6th";
      break;
  }

  document.getElementById("ship_" + kan_frame + "_face").src = "./img/ship/" + result[1] + ".png";
  document.getElementById("ship_" + kan_frame + "_name").innerHTML = result[2];
  document.getElementById("ship_" + kan_frame + "_pw").innerHTML = result[4];
  document.getElementById("ship_" + kan_frame + "_th").innerHTML = result[5];
  document.getElementById("ship_" + kan_frame + "_as").innerHTML = result[7];
  document.getElementById("ship_" + kan_frame + "_as-min").value = result[6];
  document.getElementById("ship_" + kan_frame + "_as-max").value = result[7];
  document.getElementById("ship_" + kan_frame + "_lv").innerHTML = "99";
  document.getElementById("ship_" + kan_frame + "_range").innerHTML = result[8];
  document.getElementById("ship_" + kan_frame + "_basepw").innerHTML = Number(result[4]) + 5;
  document.getElementById("ship_" + kan_frame + "_baseth").innerHTML = Number(result[5]) + 5;
  let baseas = Math.sqrt(Number(result[7])) + 13;
  document.getElementById("ship_" + kan_frame + "_baseas").innerHTML = baseas.toFixed(3);
  document.getElementById("ship_" + kan_frame + "_baseairpw").innerHTML = 0;

  switch (result[3]) {
    case "2":
      document.getElementById("ship_" + kan_frame + "_wp3").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp4").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp5").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp3-r").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp4-r").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp5-r").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_release").style.height = "35px";
      break;
    case "3":
      document.getElementById("ship_" + kan_frame + "_wp3").style.display = "block";
      document.getElementById("ship_" + kan_frame + "_wp4").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp5").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp3-r").style.display = "block";
      document.getElementById("ship_" + kan_frame + "_wp4-r").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp5-r").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_release").style.height = "60px";
      break;
    case "4":
      document.getElementById("ship_" + kan_frame + "_wp3").style.display = "block";
      document.getElementById("ship_" + kan_frame + "_wp4").style.display = "block";
      document.getElementById("ship_" + kan_frame + "_wp5").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_wp3-r").style.display = "block";
      document.getElementById("ship_" + kan_frame + "_wp4-r").style.display = "block";
      document.getElementById("ship_" + kan_frame + "_wp5-r").style.display = "none";
      document.getElementById("ship_" + kan_frame + "_release").style.height = "85px";
      break;
  }

  // 武器装備モーダルウィンドウ作成
  // 艦種共通の武器一覧データを読み込んで、武器選択モーダルウィンドウのタブに表示させる処理
  let wp_nav = "";
  let ship_type = "";
  let equip_type = "";
  let htmlwrite = "";
  let equip_search = "";
  let shiptype_search = "";

  $.get('./data/MY_WEAPON.csv', function(data) {
    csv = $.csv.toArrays(data);
    $(csv).each(function(index) {

      //装備のhtml書き出し処理
      if (equip_type != this[3]) {
        if (equip_type == "" || htmlwrite == "") {
          equip_type = this[3];
        } else {
          $("#wp_1st_" + equip_type).append(htmlwrite);
          htmlwrite = "";
          equip_type = this[3];
        }
      }

      if (this[0] != "id") {
        shiptype_search = ":" + this[13] + ":";
        shiptype_search = shiptype_search.indexOf(":" + result[0] + ":"); //艦種の絞り込み
        equip_search = ":" + this[14] + ":";
        equip_search = equip_search.indexOf(":" + result[1] + ":"); //例外装備(追加用)
        if (shiptype_search != -1 || equip_search != -1) {
          if (this[12] == "FALSE") {
            htmlwrite += '<a href="javascript:weapon_open(\'' + this[3] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + '\');" class="list-group-item list-group-item-action lists NOTUSED" >';
          } else {
            htmlwrite += '<a href="javascript:weapon_open(\'' + this[3] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + '\');" class="list-group-item list-group-item-action lists USED">';
          }
          htmlwrite += '<div class="d-flex align_medium">';
          htmlwrite += '<div class="d-flex" style="width:52%;"><div><img src="./img/weapon/' + this[4] + '.png"></div><div class="weapon_name">&nbsp;' + this[2] + '</div></div>';
          htmlwrite += '<div style="width:12%;text-align:right">' + this[5] + '</div>&nbsp';
          htmlwrite += '<div class="wp-type_' + this[3] + '_fp wp_improve_param" style="width:12%;text-align:left">+0</div>';
          htmlwrite += '<div style="width:12%;text-align:right">' + this[9] + '</div>&nbsp';
          htmlwrite += '<div  class="wp-type_' + this[3] + '_hit wp_improve_param" style="width:12%;text-align:left">+0</div>';
          htmlwrite += '</div></a>';
        }
      }
    });
  });

  $('#ｍodal_myship').modal('hide');
  document.getElementById("ship_" + kan_frame + "_selected").style.display = "block";
  document.getElementById("ship_" + kan_frame).style.display = "none";
}

function ship_discard() {
  //引数 [艦種(0),艦ID(1),スロット数(3),火力(4),雷装(5),対潜初期(6),対潜最大(7),射程(8)]
  switch (document.getElementById('get_text').innerHTML) {
    case "旗艦":
      kan_frame = "1st";
      break;
    case "2番艦":
      kan_frame = "2nd";
      break;
    case "3番艦":
      kan_frame = "3rd";
      break;
    case "4番艦":
      kan_frame = "4th";
      break;
    case "5番艦":
      kan_frame = "5th";
      break;
    case "6番艦":
      kan_frame = "6th";
      break;
  }
  document.getElementById("ship_" + kan_frame + "_face").src = "";
  document.getElementById("ship_" + kan_frame + "_name").innerHTML = "";
  document.getElementById("ship_" + kan_frame + "_pw").innerHTML = "";
  document.getElementById("ship_" + kan_frame + "_th").innerHTML = "";
  document.getElementById("ship_" + kan_frame + "_as").innerHTML = "";
  document.getElementById("ship_" + kan_frame + "_as-min").value = "";
  document.getElementById("ship_" + kan_frame + "_as-max").value = "";
  document.getElementById("ship_" + kan_frame + "_lv").innerHTML = "99";
  document.getElementById("ship_" + kan_frame + "_range").innerHTML = "";

  $('#ｍodal_myship').modal('hide');
  document.getElementById("ship_" + kan_frame).style.display = "block";
  document.getElementById("ship_" + kan_frame + "_selected").style.display = "none";
}

//艦娘データのフィルタリング処理(全て表示タグ選択)
function show_CL() {
  let listitem = "";
  if (document.getElementById("complete_check").checked) { //checkedの場合非改造艦を読み込まない。
    listitem = document.getElementsByClassName('CL COMP');
  } else {
    listitem = document.getElementsByClassName('CL');
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}

function show_DD() {
  let listitem = "";
  if (document.getElementById("complete_check").checked) { //checkedの場合非改造艦を読み込まない。
    listitem = document.getElementsByClassName('DD COMP');
  } else {
    listitem = document.getElementsByClassName('DD');
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}

function show_DE() {
  let listitem = "";
  if (document.getElementById("complete_check").checked) { //checkedの場合非改造艦を読み込まない。
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
  //引数 [艦種タイプ(DD-1等)]
  let listitem = document.getElementsByClassName('CL'); //クラスCLを持つ要素を全て読み出し
  $(listitem).each(function(index) {
    this.style.display = "none";
  })
  if (document.getElementById("complete_check").checked) {
    listitem = document.getElementsByClassName(target + ' COMP'); //クラスCLかつ改造済み艦を全て読み出し
  } else {
    listitem = document.getElementsByClassName(target);
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
  document.getElementById("modal_ship_type-CL").value = target;
}

function filter_DD(target) {
  let listitem = document.getElementsByClassName('DD'); //クラスDDを持つ要素を全て読み出し
  $(listitem).each(function(index) {
    this.style.display = "none";
  })
  if (document.getElementById("complete_check").checked) {
    listitem = document.getElementsByClassName(target + ' COMP'); //クラスDDかつ改造済み艦を全て読み出し
  } else {
    listitem = document.getElementsByClassName(target);
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
  document.getElementById("modal_ship_type-DD").value = target;
}

function filter_DE(target) {
  let listitem = document.getElementsByClassName('DE'); //クラスDEを持つ要素を全て読み出し
  $(listitem).each(function(index) {
    this.style.display = "none";
  })
  if (document.getElementById("complete_check").checked) {
    listitem = document.getElementsByClassName(target + ' COMP'); //クラスDEかつ改造済み艦を全て読み出し
  } else {
    listitem = document.getElementsByClassName(target);
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
  document.getElementById("modal_ship_type-DE").value = target;
}

function filter_complete() {
  let listitem = "";
  if (document.getElementById("complete_check").checked) {
    listitem = document.getElementsByClassName('INCOMP'); //クラスINCOMP(未改造艦)を持つ要素を全て読み出し
    $(listitem).each(function(index) {
      this.style.display = "none";
    })
  } else {
    if (document.getElementById("modal_ship_type-CL").value != "") {
      listitem = document.getElementsByClassName(document.getElementById("modal_ship_type-CL").value); //クラスINCOMP(未改造艦)を持つ要素を全て読み出し
      $(listitem).each(function(index) {
        this.style.display = "block";
      })
    }
    if (document.getElementById("modal_ship_type-DD").value != "") {
      listitem = document.getElementsByClassName(document.getElementById("modal_ship_type-DD").value); //クラスINCOMP(未改造艦)を持つ要素を全て読み出し
      $(listitem).each(function(index) {
        this.style.display = "block";
      })
    }
    if (document.getElementById("modal_ship_type-DE").value != "") {
      listitem = document.getElementsByClassName(document.getElementById("modal_ship_type-DE").value); //クラスINCOMP(未改造艦)を持つ要素を全て読み出し
      $(listitem).each(function(index) {
        this.style.display = "block";
      })
    }
  }
}

function filter_priweapon() {
  let listitem = "";
  if (document.getElementById("weapon_check").checked) {
    listitem = document.getElementsByClassName('NOTUSED'); //クラス初期装備を持つ要素を全て読み出し
    $(listitem).each(function(index) {
      this.style.display = "none";
    });
  } else {
    listitem = document.getElementsByClassName('NOTUSED'); //クラス初期装備を持つ要素を全て読み出し
    $(listitem).each(function(index) {
      this.style.display = "block";
    });
  }
}
// "wp-type_' + this[3]+'_fp"
function improve_check(param) {
  let listitem = document.getElementsByClassName('wp-type_1_fp');
  $(listitem).each(function(index) {
    if (param == "0") {
      this.innerHTML = "+0";
    } else {
      this.innerHTML = "+"+Math.round(Math.sqrt(Number(param)) * 100) / 100 ;
    }
  })

  listitem = document.getElementsByClassName('wp-type_1_hit');
  $(listitem).each(function(index) {
    if (param == "0") {
      this.innerHTML = "+0";
    } else {
      this.innerHTML =  "+"+Math.round(Math.sqrt(Number(param)) * 100) / 100;
    }
  })
}
