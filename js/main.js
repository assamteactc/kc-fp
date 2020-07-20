//////////////////////////////////////////////////////
// [1-1. アクセス時の初期化処理]
//////////////////////////////////////////////////////

$(window).on("load", function() {
  //ウインドウを開いた時点の初期化動作

  // 艦種一覧データを読み込んで、艦娘選択モーダルウィンドウのタブに表示させる処理
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
    $("#friend_category").append(itemlist);
    $("#friend_type-CL").append(list1);
    $("#friend_type-DD").append(list2);
    $("#friend_type-DE").append(list3);
  });

  //キャプチャボタン用
  //HTML内に画像を表示
  html2canvas(document.getElementById("target"), {
    onrendered: function(canvas) {
      //imgタグのsrcの中に、html2canvasがレンダリングした画像を指定する。
      var imgData = canvas.toDataURL();
      document.getElementById("result").src = imgData;
    }
  });

  //ボタンを押下した際にダウンロードする画像を作る
  html2canvas(document.body, {
    onrendered: function(canvas) {
      //aタグのhrefにキャプチャ画像のURLを設定
      var imgData = canvas.toDataURL();
      document.getElementById("ss").href = imgData;
    }
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
            if (this[16] == "FALSE") {
              list1 += '<a href="javascript:ship_open(\'CL:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + ':' + this[14] + ':' + this[15] + ':' + this[17] + '\');" class="list-group-item list-group-item-action lists CL INCOMP ' + this[2] + '">';
              //引数 [艦カテゴリ(0),艦ID(1),艦種(2),名前(3),スロット数(4),火力(5),雷装(6),対空(7),対潜初期(8),対潜最大(9),回避初期(10),回避最大(11),索敵初期(12),索敵最大(13),運初期(14),運最大(15),射程(16)]
            } else {
              list1 += '<a href="javascript:ship_open(\'CL:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + ':' + this[14] + ':' + this[15] + ':' + this[17] + '\');" class="list-group-item list-group-item-action lists CL COMP ' + this[2] + '">';
            }
            list1 += '<div class="d-flex align_medium">';
            list1 += '<div class="ship_list_name"><img src="./img/ship/' + this[0] + '.png">&nbsp;' + this[3] + '</div>';
            list1 += '<div class="ship_list_param">' + this[5] + '</div>';
            list1 += '<div class="ship_list_param">' + this[6] + '</div>';
            list1 += '<div class="ship_list_param">' + this[7] + '</div>';
            list1 += '<div class="ship_list_param">' + this[9] + '</div>';
            list1 += '<div class="ship_list_param">' + this[14] + '</div>';
            list1 += '<div class="ship_list_param">' + this[4] + '</div>';
            list1 += '</div></a>';
            break;
          case "DD":
            if (this[16] == "FALSE") {
              list2 += '<a href="javascript:ship_open(\'DD:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + ':' + this[14] + ':' + this[15] + ':' + this[17] + '\');" class="list-group-item list-group-item-action lists DD INCOMP ' + this[2] + '">';
              //引数 [艦カテゴリ(0),艦ID(1),艦種(2),名前(3),スロット数(4),火力(5),雷装(6),対空(7),対潜初期(8),対潜最大(9),回避初期(10),回避最大(11),索敵初期(12),索敵最大(13),運初期(14),運最大(15),射程(16)]
            } else {
              list2 += '<a href="javascript:ship_open(\'DD:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + ':' + this[14] + ':' + this[15] + ':' + this[17] + '\');" class="list-group-item list-group-item-action lists DD COMP ' + this[2] + '">';
            }
            list2 += '<div class="d-flex">';
            list2 += '<div class="ship_list_name"><img src="./img/ship/' + this[0] + '.png">&nbsp;' + this[3] + '</div>';
            list2 += '<div class="ship_list_param">' + this[5] + '</div>';
            list2 += '<div class="ship_list_param">' + this[6] + '</div>';
            list2 += '<div class="ship_list_param">' + this[7] + '</div>';
            list2 += '<div class="ship_list_param">' + this[9] + '</div>';
            list2 += '<div class="ship_list_param">' + this[14] + '</div>';
            list2 += '<div class="ship_list_param">' + this[4] + '</div>';
            list2 += '</div></a>';
            break;
          case "DE":
            if (this[16] == "FALSE") {
              list3 += '<a href="javascript:ship_open(\'DE:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + ':' + this[14] + ':' + this[15] + ':' + this[17] + '\');" class="list-group-item list-group-item-action lists DE INCOMP ' + this[2] + '">';
              //引数 [艦カテゴリ(0),艦ID(1),艦種(2),名前(3),スロット数(4),火力(5),雷装(6),対空(7),対潜初期(8),対潜最大(9),回避初期(10),回避最大(11),索敵初期(12),索敵最大(13),運初期(14),運最大(15),射程(16)]
            } else {
              list3 += '<a href="javascript:ship_open(\'DE:' + this[0] + ':' + this[2] + ':' + this[3] + ':' + this[4] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + ':' + this[14] + ':' + this[15] + ':' + this[17] + '\');" class="list-group-item list-group-item-action lists DE COMP ' + this[2] + '">';
            }
            list3 += '<div class="d-flex">';
            list3 += '<div class="ship_list_name"><img src="./img/ship/' + this[0] + '.png">&nbsp;' + this[3] + '</div>';
            list3 += '<div class="ship_list_param">' + this[5] + '</div>';
            list3 += '<div class="ship_list_param">' + this[6] + '</div>';
            list3 += '<div class="ship_list_param">' + this[7] + '</div>';
            list3 += '<div class="ship_list_param">' + this[9] + '</div>';
            list3 += '<div class="ship_list_param">' + this[14] + '</div>';
            list3 += '<div class="ship_list_param">' + this[4] + '</div>';
            list3 += '</div></a>';
            break;
        }
      }
    })
    $("#friend_list-CL").append(list1);
    $("#friend_list-DD").append(list2);
    $("#friend_list-DE").append(list3);
  });
});

//////////////////////////////////////////////////////
// [2-1.艦娘選択時のモーダルウィンドウ表示処理]
//////////////////////////////////////////////////////
$('#ｍodal_friend').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget);
  const modal = $(this);
  let friend = button.data('friendid');
  $("#md_friend").val(friend);
  switch (friend) {
    case 1:
      modal.find('.modal-header span#md_shiptitle').text("旗艦");
      break;
    case 2:
      modal.find('.modal-header span#md_shiptitle').text("2番艦");
      break;
    case 3:
      modal.find('.modal-header span#md_shiptitle').text("3番艦");
      break;
    case 4:
      modal.find('.modal-header span#md_shiptitle').text("4番艦");
      break;
    case 5:
      modal.find('.modal-header span#md_shiptitle').text("5番艦");
      break;
    case 6:
      modal.find('.modal-header span#md_shiptitle').text("6番艦");
      break;
  }
});

//////////////////////////////////////////////////////
// [2-2.艦娘モーダルウィンドウ上のフィルタ操作]
//////////////////////////////////////////////////////
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
      });
    } else {
      listitem = document.getElementsByClassName("CL");
      $(listitem).each(function(index) {
        this.style.display = "block";
      });
    }
    if (document.getElementById("modal_ship_type-DD").value != "") {
      listitem = document.getElementsByClassName(document.getElementById("modal_ship_type-DD").value); //クラスINCOMP(未改造艦)を持つ要素を全て読み出し
      $(listitem).each(function(index) {
        this.style.display = "block";
      });
    } else {
      listitem = document.getElementsByClassName("DD");
      $(listitem).each(function(index) {
        this.style.display = "block";
      });
    }
    if (document.getElementById("modal_ship_type-DE").value != "") {
      listitem = document.getElementsByClassName(document.getElementById("modal_ship_type-DE").value); //クラスINCOMP(未改造艦)を持つ要素を全て読み出し
      $(listitem).each(function(index) {
        this.style.display = "block";
      });
    } else {
      listitem = document.getElementsByClassName("DE");
      $(listitem).each(function(index) {
        this.style.display = "block";
      });
    }
  }
}

//////////////////////////////////////////////////////
// [2-3.艦娘モーダルウィンドウリストより艦娘選択した時の動作]
//////////////////////////////////////////////////////
function ship_open(param) {
  //引数 [艦カテゴリ(0),艦ID(1),艦種(2),名前(3),スロット数(4),火力(5),雷装(6),対空(7),対潜初期(8),対潜最大(9),回避初期(10),回避最大(11),索敵初期(12),索敵最大(13),運初期(14),運最大(15),射程(16)]

  const result = param.split(':');
  const friendid = document.getElementById("md_friend").value;
  let i;
  let content;

  document.getElementById("friend_" + friendid + "_base_param").value = result[1] + ':' + result[4] + ':' + result[5] + ':' + result[6] + ':' + result[7] + ':' + result[8] + ':' + result[9] + ':' + result[10] + ':' + result[11] + ':' + result[12] + ':' + result[13] + ':' + result[14] + ':' + result[15] + ':' + result[16];
  //base_param [艦ID[0],スロット数[1],火力[2],雷装[3],対空[4],対潜初期[5],対潜最大[6],回避初期[7],回避最大[8],索敵初期[9],索敵最大[10],運初期[11],運最大[12],射程[13]

  document.getElementById("ship_" + friendid + "_face").src = "./img/ship/" + result[1] + ".png";
  document.getElementById("ship_" + friendid + "_name").innerHTML = result[3];
  document.getElementById("ship_" + friendid + "_lv").innerHTML = "99";
  document.getElementById("ship_" + friendid + "_pw").innerHTML = result[5];
  document.getElementById("ship_" + friendid + "_th").innerHTML = result[6];
  document.getElementById("ship_" + friendid + "_aa").innerHTML = result[7];
  document.getElementById("ship_" + friendid + "_as").innerHTML = result[9];
  document.getElementById("friend_" + friendid + "_base_as").value = result[9] + ":0";
  document.getElementById("friend_" + friendid + "_base_as").value = result[9] + ":0";
  document.getElementById("ship_" + friendid + "_search").innerHTML = result[13];
  document.getElementById("friend_" + friendid + "_base_search").value = result[13];
  document.getElementById("ship_" + friendid + "_luck").innerHTML = result[14];
  document.getElementById("ship_" + friendid + "_luck").innerHTML = result[14];

  document.getElementById("ship_" + friendid + "_luck_input").min = Number(result[14]);
  document.getElementById("ship_" + friendid + "_luck_input").max = Number(result[15]);
  document.getElementById("ship_" + friendid + "_luck_slidebar").min = Number(result[14]);
  document.getElementById("ship_" + friendid + "_luck_slidebar").max = Number(result[15]);

  //命中項計算
  i = Math.floor(Math.sqrt(99) * 2 + 1.5 * Math.sqrt(Number(result[14]))); //命中項計算
  document.getElementById("ship_" + friendid + "_hit").innerHTML = i + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';
  content = $('<p>■基礎命中項 = 2 × √(レベル) + 1.5 × √(運) + 装備命中値 + 装備改修(命中)<br>　※小数点以下は切り捨て</p><p>■計算結果<br>' + i + ' = 2 × √(99) + 1.5 × √(' + result[14] + ') + 0 + 0</p>');
  $('#ship_' + friendid + '_hit').data('powertipjq', content);
  $('#ship_' + friendid + '_hit').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });

  switch (Number(result[16])) {
    case 1:
      document.getElementById("ship_" + friendid + "_range").innerHTML = "短";
      break;
    case 2:
      document.getElementById("ship_" + friendid + "_range").innerHTML = "中";
      break;
    case 3:
      document.getElementById("ship_" + friendid + "_range").innerHTML = "超";
      break;
    case 4:
      document.getElementById("ship_" + friendid + "_range").innerHTML = "超長";
      break;
  }

  //火力計算
  content = $('<p>■計算式(砲撃攻撃力)<br>砲撃攻撃力 = 火力 + 装備改修(砲撃) ＋ 通常艦隊定数　</p><p>■計算結果<br>' + (Number(result[5]) + 5) + ' = ' + result[5] + ' + 0 + 5</p>');
  $('#ship_' + friendid + '_basefp').data('powertipjq', content);
  $('#ship_' + friendid + '_basefp').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });
  document.getElementById("ship_" + friendid + "_basefp").innerHTML = Number(result[5]) + 5 + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';

  //雷撃計算
  if (result[6] == "0") {
    document.getElementById("ship_" + friendid + "_baseth").innerHTML = 0;
    content = $('<p>■計算式(雷撃攻撃力)<br>雷撃攻撃力 = 雷撃 + 装備改修(雷撃) ＋ 通常艦隊定数　</p><p>■計算結果<br>0 = 0 + 0 + 0</p>');
  } else {
    document.getElementById("ship_" + friendid + "_baseth").innerHTML = Number(result[6]) + 5 + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';
    content = $('<p>■計算式(雷撃攻撃力)<br>雷撃攻撃力 = 雷撃 + 装備改修(雷撃) ＋ 通常艦隊定数　</p><p>■計算結果<br>' + (Number(result[6]) + 5) + ' = ' + result[6] + ' + 0 + 5</p>');
  }
  $('#ship_' + friendid + '_baseth').data('powertipjq', content);
  $('#ship_' + friendid + '_baseth').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });

  //対潜計算
  i = 2 * Math.sqrt(Number(result[9])) + 13;
  content = $('<p>■計算式(対潜攻撃力)<br>対潜攻撃力 = 対潜シナジー補正 × ( √(素対潜) × 2 + 装備対潜 × 1.5 + 装備改修(対潜) + 艦種別定数 )</p><p>■計算結果<br>' + Math.floor(i * 100000) / 100000 + ' = 1 × ( √(' + result[9] + ') × 2 + 0 × 1.5 + 0 + 13 )</p>');
  $('#ship_' + friendid + '_baseas').data('powertipjq', content);
  $('#ship_' + friendid + '_baseas').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });
  document.getElementById("ship_" + friendid + "_baseas").innerHTML = Math.floor(i * 100) / 100 + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';

  //夜戦計算
  content = $('<p>■計算式(夜戦攻撃力)<br>夜戦攻撃力 = 火力 + 雷装 + 装備改修(夜戦)　</p><p>■計算結果<br>' + (Number(result[5]) + Number(result[6])) + ' = ' + result[5] + ' + ' + result[6] + ' + 0 </p>');
  $('#ship_' + friendid + '_basenp').data('powertipjq', content);
  $('#ship_' + friendid + '_basenp').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });
  document.getElementById("ship_" + friendid + "_basenp").innerHTML = Number(result[5]) + Number(result[6]) + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';
  document.getElementById("md_" + friendid + "_wp_friend").value = result[1] + ':' + result[0] + ':' + result[2];

  //艦娘スロットの書き出し
  htmlwrite_wp_slot(friendid, result[4]);

  // 武器装備モーダルウィンドウ作成
  // 艦種共通の武器一覧データを読み込んで、武器選択モーダルウィンドウのタブに表示させる処理
  let wp_nav = "";
  let ship_type = "";
  let equip_type = "";
  let htmlwrite = "";
  let htmlwrite2 = "";
  let equip_search = "";
  let shiptype_search = "";

  if (document.getElementById("#md_" + friendid + "_wppricheck") == null) {
    htmlwrite_md_wp_improvebar(friendid);
    htmlwrite_md_wp_content(friendid);
  } else {
    htmlwrite_md_wp_content_clear(friendid);
  }

  $.get('./data/MY_WEAPON.csv', function(data) {
    csv = $.csv.toArrays(data);
    $(csv).each(function(index) {

      //装備のhtml書き出し処理
      if (equip_type != this[3]) {
        if (equip_type == "" || htmlwrite == "") {
          equip_type = this[3];
        } else {
          $("#wp_" + friendid + "_" + equip_type).html(htmlwrite);
          htmlwrite = "";
          equip_type = this[3];
        }
      }
      if (this[0] != "id") {
        shiptype_search = ":" + this[15] + ":";
        shiptype_search = shiptype_search.indexOf(":" + result[0] + ":"); //艦種の絞り込み
        equip_search = ":" + this[16] + ":";
        equip_search = equip_search.indexOf(":" + result[1] + ":"); //例外装備(追加用)
        if (shiptype_search != -1 || equip_search != -1) {
          if (this[14] == "FALSE") {
            htmlwrite += '<a href="javascript:weapon_open(\'' + friendid + ':' + this[0] + ':' + this[3] + ':' + this[4] + ':' + this[2] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + '\');" class="list-group-item list-group-item-action lists wp_' + friendid + '_' + this[0] + '_bonus notused">';
            //friendid値[0],武器id[1],カテゴリID[2],アイコンID[3],武器名[4],改修分類[5],火力[6],雷装[7],対空[8],対潜[9],索敵[10],命中[11],爆装[12],射程[13]
          } else {
            htmlwrite += '<a href="javascript:weapon_open(\'' + friendid + ':' + this[0] + ':' + this[3] + ':' + this[4] + ':' + this[2] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + '\');" class="list-group-item list-group-item-action lists wp_' + friendid + '_' + this[0] + '_bonus used">';
          }
          htmlwrite += '<div class="d-flex flex-align_medium">';
          htmlwrite += '<div class="d-flex wp_list_name"><div><img src="./img/weapon/' + this[4] + '.png"></div><div class="md_weapon_name">&nbsp;' + this[2] + '</div></div>';
          htmlwrite += '<div class="d-flex wp_list_param align-items-center">';
          htmlwrite += '<div class="wp_list_initial">' + this[6] + '</div>&nbsp;';
          htmlwrite += '<div class="d-flex flex-column">';
          htmlwrite += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_fp"></div>';
          htmlwrite += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_fp wp_improve_param"></div>';
          htmlwrite += '</div></div>';
          htmlwrite += '<div class="d-flex wp_list_param align-items-center">';
          htmlwrite += '<div class="wp_list_initial">' + this[7] + '</div>&nbsp;';
          htmlwrite += '<div class="d-flex flex-column">';
          htmlwrite += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_th"></div>';
          htmlwrite += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_th wp_improve_param"></div>';
          htmlwrite += '</div></div>';
          htmlwrite += '<div class="d-flex wp_list_param align-items-center">';
          htmlwrite += '<div class="wp_list_initial">' + this[8] + '</div>&nbsp;';
          htmlwrite += '<div class="d-flex flex-column">';
          htmlwrite += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_aa"></div>';
          htmlwrite += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_aa wp_improve_param"></div>';
          htmlwrite += '</div></div>';
          htmlwrite += '<div class="d-flex wp_list_param align-items-center">';
          htmlwrite += '<div class="wp_list_initial">' + this[9] + '</div>&nbsp;';
          htmlwrite += '<div class="d-flex flex-column">';
          htmlwrite += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_as"></div>';
          htmlwrite += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_as wp_improve_param"></div>';
          htmlwrite += '</div></div>';
          htmlwrite += '<div class="d-flex wp_list_param align-items-center">';
          htmlwrite += '<div class="wp_list_initial">' + this[10] + '</div>&nbsp;';
          htmlwrite += '<div class="d-flex flex-column">';
          htmlwrite += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_search"></div>';
          htmlwrite += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_search wp_improve_param"></div>';
          htmlwrite += '</div></div>';
          htmlwrite += '<div class="d-flex wp_list_param align-items-center">';
          htmlwrite += '<div class="wp_list_initial">' + this[11] + '</div>&nbsp;';
          htmlwrite += '<div class="d-flex flex-column">';
          htmlwrite += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_hit"></div>';
          htmlwrite += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_hit wp_improve_param"></div>';
          htmlwrite += '</div></div>';
          htmlwrite += '</div></a>';

          if (this[18] != "FALSE") {
            if (this[14] == "FALSE") {
              htmlwrite2 += '<a href="javascript:weapon_open(\'' + friendid + ':' + this[0] + ':' + this[3] + ':' + this[4] + ':' + this[2] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + '\');" class="list-group-item list-group-item-action lists wp_' + friendid + '_' + this[0] + '_bonus notused">';
              //friendid値[0],武器id[1],カテゴリID[2],アイコンID[3],武器名[4],改修分類[5],火力[6],雷装[7],対空[8],対潜[9],索敵[10],命中[11],爆装[12],射程[13]
            } else {
              htmlwrite2 += '<a href="javascript:weapon_open(\'' + friendid + ':' + this[0] + ':' + this[3] + ':' + this[4] + ':' + this[2] + ':' + this[5] + ':' + this[6] + ':' + this[7] + ':' + this[8] + ':' + this[9] + ':' + this[10] + ':' + this[11] + ':' + this[12] + ':' + this[13] + '\');" class="list-group-item list-group-item-action lists wp_' + friendid + '_' + this[0] + '_bonus  used">';
            }
            htmlwrite2 += '<div class="d-flex flex-align_medium">';
            htmlwrite2 += '<div class="d-flex wp_list_name"><div><img src="./img/weapon/' + this[4] + '.png"></div><div class="md_weapon_name">&nbsp;' + this[2] + '</div></div>';
            htmlwrite2 += '<div class="d-flex wp_list_param align-items-center">';
            htmlwrite2 += '<div class="wp_list_initial">' + this[6] + '</div>&nbsp;';
            htmlwrite2 += '<div class="d-flex flex-column">';
            htmlwrite2 += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_fp"></div>';
            htmlwrite2 += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_fp wp_improve_param"></div>';
            htmlwrite2 += '</div></div>';
            htmlwrite2 += '<div class="d-flex wp_list_param align-items-center">';
            htmlwrite2 += '<div class="wp_list_initial">' + this[7] + '</div>&nbsp;';
            htmlwrite2 += '<div class="d-flex flex-column">';
            htmlwrite2 += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_th"></div>';
            htmlwrite2 += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_th wp_improve_param"></div>';
            htmlwrite2 += '</div></div>';
            htmlwrite2 += '<div class="d-flex wp_list_param align-items-center">';
            htmlwrite2 += '<div class="wp_list_initial">' + this[8] + '</div>&nbsp;';
            htmlwrite2 += '<div class="d-flex flex-column">';
            htmlwrite2 += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_aa"></div>';
            htmlwrite2 += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_aa wp_improve_param"></div>';
            htmlwrite2 += '</div></div>';
            htmlwrite2 += '<div class="d-flex wp_list_param align-items-center">';
            htmlwrite2 += '<div class="wp_list_initial">' + this[9] + '</div>&nbsp;';
            htmlwrite2 += '<div class="d-flex flex-column">';
            htmlwrite2 += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_as"></div>';
            htmlwrite2 += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_as wp_improve_param"></div>';
            htmlwrite2 += '</div></div>';
            htmlwrite2 += '<div class="d-flex wp_list_param align-items-center">';
            htmlwrite2 += '<div class="wp_list_initial">' + this[10] + '</div>&nbsp;';
            htmlwrite2 += '<div class="d-flex flex-column">';
            htmlwrite2 += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_search"></div>';
            htmlwrite2 += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_search wp_improve_param"></div>';
            htmlwrite2 += '</div></div>';
            htmlwrite2 += '<div class="d-flex wp_list_param align-items-center">';
            htmlwrite2 += '<div class="wp_list_initial">' + this[11] + '</div>&nbsp;';
            htmlwrite2 += '<div class="d-flex flex-column">';
            htmlwrite2 += '<div class="wp_list_param wp_bonus_param wp_' + friendid + '_' + this[0] + '_bonus_hit"></div>';
            htmlwrite2 += '<div class="wp_list_param wp_' + friendid + '_improve_' + this[3] + ':' + this[5] + '_hit wp_improve_param"></div>';
            htmlwrite2 += '</div></div>';
            htmlwrite2 += '</div></a>';
          }
        }
      }
    });
    $("#wp_" + friendid + "_0").html(htmlwrite2);
  });



  //スライドバー制御用
  let arySpinnerCtrl = [];
  let spin_speed = 20; //変動スピード
  //長押し押下時
  $('.btnspinner').on('touchstart mousedown click', function(e) {
    if (arySpinnerCtrl['interval']) return false;
    let target = $(this).data('target');
    arySpinnerCtrl['target'] = target;
    arySpinnerCtrl['timestamp'] = e.timeStamp;
    arySpinnerCtrl['cal'] = Number($(this).data('cal'));
    //クリックは単一の処理に留める
    if (e.type == 'click') {
      spinnerCal();
      arySpinnerCtrl = [];
      return false;
    }
    //長押し時の処理
    setTimeout(function() {
      //インターバル未実行中 + 長押しのイベントタイプスタンプ一致時に計算処理
      if (!arySpinnerCtrl['interval'] && arySpinnerCtrl['timestamp'] == e.timeStamp) {
        arySpinnerCtrl['interval'] = setInterval(spinnerCal, spin_speed);
      }
    }, 500);
  });
  //長押し解除時 画面スクロールも解除に含む
  $(document).on('touchend mouseup scroll', function(e) {
    if (arySpinnerCtrl['interval']) {
      clearInterval(arySpinnerCtrl['interval']);
      arySpinnerCtrl = [];
    }
  });
  //変動計算関数
  function spinnerCal() {
    let target = $(arySpinnerCtrl['target']);
    let num = Number(target.val());
    num = num + arySpinnerCtrl['cal'];
    if (num > Number(target.attr('max'))) {
      target.val(Number(target.attr('max')));
    } else if (Number(target.attr('min')) > num) {
      target.val(Number(target.attr('min')));
    } else {
      target.val(num);
    }
  }


  $('#ｍodal_friend').modal('hide');
  document.getElementById("friend_" + friendid + "_selected").style.display = "block";
  document.getElementById("friend_" + friendid).style.display = "none";
  htmlwrite_md_wp_improve(friendid);

}

//////////////////////////////////////////////////////
// [2-4.艦娘モーダルウィンドウリストより艦娘選択した後に作成するHTML]
//////////////////////////////////////////////////////
function htmlwrite_wp_slot(friendid, slotnum) {
  slotnum = Number(slotnum);
  let htmlwrite = "";
  if (document.getElementById("wp_" + friendid + "_slot1_img") == null) {
    for (let i = 0; i < 6; i++) {
      htmlwrite = '<div class="d-flex">';
      if (i == 0) {
        htmlwrite += '<div class="d-flex align-items-center justify-content-between btn btn-light weapon_list">';
      } else {
        htmlwrite += '<div class="d-flex align-items-center justify-content-between btn btn-light weapon_list">';
      }
      htmlwrite += '<div class="d-flex align-items-center" data-toggle="modal" data-target="#ｍd_' + friendid + '_wp" data-slotid="' + i + '">';
      htmlwrite += '<div><img class="wp_slot_img" id="wp_' + friendid + '_slot' + i + '_img" src="./img/weapon/0.png"></div>';
      htmlwrite += '<div class="wp_slot_name" id="wp_' + friendid + '_slot' + i + '_name"></div>';
      htmlwrite += '</div>';
      htmlwrite += '<div class="wp_slot_improve"><input type="button" id="wp_' + friendid + '_slot' + i + '_improve" value="★0" onclick="wp_slot_improve_ch(\'' + friendid + ':' + i + '\');" disabled></div>';
      htmlwrite += '</div>';
      htmlwrite += '<div class="wp_slot_release"> <input type="button" id="wp_' + friendid + '_slot' + i + '_del" value="×" onclick="wp_slot_release(\'' + friendid + ':' + i + '\');" disabled></div>';
      htmlwrite += '</div>';
      document.getElementById("wp_" + friendid + "_slot" + i).innerHTML = htmlwrite;
    }
    htmlwrite = '<div id="wp_' + friendid + '_slotall_release">';
    htmlwrite += '<div class="wp_release_line" id="wp_' + friendid + '_release_line" style="height:' + String(30 * slotnum + 19) + 'px;"></div>';
    htmlwrite += '<div class="wp_release_all" style="margin-top:-7px;padding-left:3px;"><input type="button" id="wp_' + friendid + '_slotall_del" value="×" onclick="wp_slotall_release(\'' + friendid + '\');"></div></div>';
    document.getElementById("wp_" + friendid + "_slotall").innerHTML = htmlwrite;
    htmlwrite_friend_as(friendid); //対潜改修ツールバー
  } else {
    //艦娘装備スロットの解除
    wp_slotall_release(friendid);
    document.getElementById("wp_" + friendid + "_release_line").style = "height:" + String(30 * slotnum + 19) + "px;";
    improve_check(friendid + ':0');
    document.getElementById("md_" + friendid + "_wp_improvebar_0").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_1").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_2").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_3").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_4").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_5").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_6").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_7").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_8").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_9").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_10").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_0").classList.add('active');

    //対潜改修ツールバーの解除
    $('a#toolbar_' + friendid + '_as_bonus0').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus1').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus2').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus3').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus4').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus5').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus6').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus7').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus8').removeClass("toolbar_bonus_selected");
    $('a#toolbar_' + friendid + '_as_bonus9').removeClass("toolbar_bonus_selected");
  }
  switch (slotnum) {
    case 2:
      document.getElementById("wp_" + friendid + "_slot3_improve").type = "hidden";
      document.getElementById("wp_" + friendid + "_slot3_del").type = "hidden";
      document.getElementById("wp_" + friendid + "_slot3").style.display = "none";
      document.getElementById("wp_" + friendid + "_slot4_improve").type = "hidden";
      document.getElementById("wp_" + friendid + "_slot4_del").type = "hidden";
      document.getElementById("wp_" + friendid + "_slot4").style.display = "none";
      document.getElementById("wp_" + friendid + "_slot5_improve").type = "hidden";
      document.getElementById("wp_" + friendid + "_slot5_del").type = "hidden";
      document.getElementById("wp_" + friendid + "_slot5").style.display = "none";
      break;
    case 3:
      document.getElementById("wp_" + friendid + "_slot3").style.dispaly = "block";
      document.getElementById("wp_" + friendid + "_slot4").style.display = "none";
      document.getElementById("wp_" + friendid + "_slot5").style.display = "none";
      break;
    case 4:
      document.getElementById("wp_" + friendid + "_slot3").style.dispaly = "block";
      document.getElementById("wp_" + friendid + "_slot4").style.display = "block";
      document.getElementById("wp_" + friendid + "_slot5").style.display = "none";
      break;
    case 5:
      document.getElementById("wp_" + friendid + "_slot3").style.dispaly = "block";
      document.getElementById("wp_" + friendid + "_slot4").style.display = "block";
      document.getElementById("wp_" + friendid + "_slot5").style.display = "block";
      break;
  }
}

//対潜変更ツールバー作成
function htmlwrite_friend_as(friendid) {
  if (document.getElementById("friend_" + friendid + "_as_toolbar") == null) {
    let htmlwrite = "";
    htmlwrite += '<div id="friend_' + friendid + '_as_toolbar" class="hidden">';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus0" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 0 + '\');"><img src="./img/weapon/17.png"><i class="wp_slot_improve_list">+0</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus1" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 1 + '\');"><i class="wp_slot_improve_list">+1</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus2" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 2 + '\');"><i class="wp_slot_improve_list">+2</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus3" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 3 + '\');"><i class="wp_slot_improve_list">+3</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus4" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 4 + '\');"><i class="wp_slot_improve_list">+4</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus5" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 5 + '\');"><i class="wp_slot_improve_list">+5</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus6" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 7 + '\');"><i class="wp_slot_improve_list">+7</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus7" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 6 + '\');"><i class="wp_slot_improve_list">+6</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus8" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 8 + '\');"><i class="wp_slot_improve_list">+8</i></a>';
    htmlwrite += '<a id="toolbar_' + friendid + '_as_bonus9" href="javascript:void(0);" style="text-decoration:none;" onclick="toolbar_as_bonus(\'' + friendid + ':' + 9 + '\');"><i class="wp_slot_improve_list">+9</i></a>';
    htmlwrite += '</div>';
    $("#friend_" + friendid + "_as").html(htmlwrite);
    $("#ship_" + friendid + "_as").toolbar({
      content: '#friend_' + friendid + '_as_toolbar',
      position: 'bottom',
      style: 'primary',
      event: 'click',
      hideOnClick: true
    });
  }
}


//////////////////////////////////////////////////////
//[3-1.武器モーダルウィンドウ表示時に実行する処理]
//////////////////////////////////////////////////////
$('#ｍd_1_wp').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget);
  const modal = $(this);
  const slotid = button.data('slotid');
  md_wp_oepn("1", slotid, modal);
});
$('#ｍd_2_wp').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget);
  const modal = $(this);
  const slotid = button.data('slotid');
  md_wp_oepn("2", slotid, modal);
});
$('#ｍd_3_wp').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget);
  const modal = $(this);
  const slotid = button.data('slotid');
  md_wp_oepn("3", slotid, modal);
});
$('#ｍd_4_wp').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget);
  const modal = $(this);
  const slotid = button.data('slotid');
  md_wp_oepn("4", slotid, modal);
});
$('#ｍd_5_wp').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget);
  const modal = $(this);
  const slotid = button.data('slotid');
  md_wp_oepn("5", slotid, modal);
});
$('#ｍd_6_wp').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget);
  const modal = $(this);
  const slotid = button.data('slotid');
  md_wp_oepn("6", slotid, modal);
});

function md_wp_oepn(friendid, slotid, modal) {
  const improve = document.getElementById("wp_" + friendid + "_slot" + slotid + "_improve").value
  let param = document.getElementById("md_" + friendid + "_wp_friend").value + ':' + friendid + ':' + improve.slice(1);
  const result = param.split(':');

  //ボーナス値計算
  wp_bonus_single(result);
  // 艦ID(0),カテゴリ(1),艦種(2),friendid値(3),装備改修値(4)
  switch (slotid) {
    case 0:
      modal.find('.modal-header span#md_wptitle').text("補強増設スロット");
      break;
    case 1:
      modal.find('.modal-header span#md_wptitle').text("1番スロット");
      break;
    case 2:
      modal.find('.modal-header span#md_wptitle').text("2番スロット");
      break;
    case 3:
      modal.find('.modal-header span#md_wptitle').text("3番スロット");
      break;
    case 4:
      modal.find('.modal-header span#md_wptitle').text("4番スロット");
      break;
    case 5:
      modal.find('.modal-header span#md_wptitle').text("5番スロット");
      break;
  }
  document.getElementById("md_" + friendid + "_wp_slotid").value = slotid;

  //改修ボーナス値計算
  if (document.getElementById("wp_" + friendid + "_slot" + slotid + "_improve").disabled == false) {
    improve_check(friendid + ':' + result[4]);

    document.getElementById("md_" + friendid + "_wp_improvebar_0").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_1").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_2").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_3").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_4").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_5").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_6").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_7").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_8").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_9").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_10").classList.remove('active');
    document.getElementById("md_" + friendid + "_wp_improvebar_" + result[4]).classList.add('active');
  }

  if (slotid == "0") {
    $('#wp_' + friendid + '_nav_main').hide();
    $('#wp_' + friendid + '_nav_sec').hide();
    $('#wp_' + friendid + '_nav_tor').hide();
    $('#wp_' + friendid + '_nav_as').hide();
    $('#wp_' + friendid + '_nav_rd').hide();
    $('#wp_' + friendid + '_nav_ag').hide();
    $('#wp_' + friendid + '_nav_other').hide();
    $('#wp_' + friendid + '_nav_subslot').show();
    $('#wp_' + friendid + '_nav_subslot').addClass("active");
    $('#wp_' + friendid + '_content_main').removeClass("active");
    $('#wp_' + friendid + '_content_sec').removeClass("active");
    $('#wp_' + friendid + '_content_tor').removeClass("active");
    $('#wp_' + friendid + '_content_as').removeClass("active");
    $('#wp_' + friendid + '_content_rd').removeClass("active");
    $('#wp_' + friendid + '_content_ag').removeClass("active");
    $('#wp_' + friendid + '_content_other').removeClass("active");
    $('#wp_' + friendid + '_content_subslot').addClass("active");
  } else {
    $('#wp_' + friendid + '_nav_main').show();
    $('#wp_' + friendid + '_nav_sec').show();
    $('#wp_' + friendid + '_nav_tor').show();
    $('#wp_' + friendid + '_nav_as').show();
    $('#wp_' + friendid + '_nav_rd').show();
    $('#wp_' + friendid + '_nav_ag').show();
    $('#wp_' + friendid + '_nav_other').show();
    $('#wp_' + friendid + '_nav_subslot').hide();
    $('#wp_' + friendid + '_nav_subslot').removeClass("active");
    $('#wp_' + friendid + '_content_subslot').removeClass("active");
    if ($('#wp_' + friendid + '_nav_main').hasClass("active")) {
      $('#wp_' + friendid + '_content_main').addClass("active");
    }
    if ($('#wp_' + friendid + '_nav_sec').hasClass("active")) {
      $('#wp_' + friendid + '_content_sec').addClass("active");
    }
    if ($('#wp_' + friendid + '_nav_tor').hasClass("active")) {
      $('#wp_' + friendid + '_content_tor').addClass("active");
    }
    if ($('#wp_' + friendid + '_nav_as').hasClass("active")) {
      $('#wp_' + friendid + '_content_as').addClass("active");
    }
    if ($('#wp_' + friendid + '_nav_rd').hasClass("active")) {
      $('#wp_' + friendid + '_content_rd').addClass("active");
    }
    if ($('#wp_' + friendid + '_nav_ag').hasClass("active")) {
      $('#wp_' + friendid + '_content_ag').addClass("active");
    }
    if ($('#wp_' + friendid + '_nav_other').hasClass("active")) {
      $('#wp_' + friendid + '_content_other').addClass("active");
    }
  }
}

function htmlwrite_md_wp_content_clear(friendid) {
  $("#wp_" + friendid + "_0").html(""); //補強増設用
  $("#wp_" + friendid + "_1").html("");
  $("#wp_" + friendid + "_2").html("");
  $("#wp_" + friendid + "_3").html("");
  $("#wp_" + friendid + "_4").html("");
  $("#wp_" + friendid + "_5").html("");
  $("#wp_" + friendid + "_12").html("");
  $("#wp_" + friendid + "_13").html("");
  $("#wp_" + friendid + "_14").html("");
  $("#wp_" + friendid + "_15").html("");
  $("#wp_" + friendid + "_17").html("");
  $("#wp_" + friendid + "_18").html("");
  $("#wp_" + friendid + "_19").html("");
  $("#wp_" + friendid + "_21").html("");
  $("#wp_" + friendid + "_22").html("");
  $("#wp_" + friendid + "_23").html("");
  $("#wp_" + friendid + "_24").html("");
  $("#wp_" + friendid + "_27").html("");
  $("#wp_" + friendid + "_28").html("");
  $("#wp_" + friendid + "_29").html("");
  $("#wp_" + friendid + "_30").html("");
  $("#wp_" + friendid + "_31").html("");
  $("#wp_" + friendid + "_32").html("");
  $("#wp_" + friendid + "_33").html("");
  $("#wp_" + friendid + "_34").html("");
  $("#wp_" + friendid + "_35").html("");
  $("#wp_" + friendid + "_36").html("");
  $("#wp_" + friendid + "_37").html("");
  $("#wp_" + friendid + "_39").html("");
  $("#wp_" + friendid + "_43").html("");
  $("#wp_" + friendid + "_44").html("");
  $("#wp_" + friendid + "_46").html("");
  $("#wp_" + friendid + "_47").html("");
  $("#wp_" + friendid + "_48").html("");
  $("#wp_" + friendid + "_49").html("");
  $("#wp_" + friendid + "_50").html("");
}

//////////////////////////////////////////////////////
//[3-2.武器装備モーダルウィンドウ上の各種操作(フィルタ等)]
//////////////////////////////////////////////////////
function improve_check(param) {
  let result = param.split(':');
  // friendid値[0],改修値[1]
  result = document.getElementById("md_" + result[0] + "_wp_friend").value + ':' + param;
  result = result.split(':');
  // 艦ID(0),カテゴリ(1),艦種(2),friendid値(3),装備改修値(4)
  document.getElementById("md_" + result[3] + "_wp_improve").value = result[4];
  wp_bonus_single(result);
  //小口径主砲・高角砲なし
  let listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_1:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_1:1_hit');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  //小口径主砲・高角砲あり
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_1:2_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_1:2_aa');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 70) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_1:2_hit');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  //中口径主砲・高角砲なし
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_2:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_2:1_hit');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  //魚雷
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_5:1_th');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 120) / 100;
    }
  })
  //機銃
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_21:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_21:1_th');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 120) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_21:1_aa');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 70) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_36:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_36:1_aa');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 70) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_36:1_hit');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  //ソナー
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_14:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 75) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_14:1_as');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 200 / 3) / 100;
    }
  })
  //爆雷
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_15:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 75) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_15:1_as');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 200 / 3) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_15:2_as');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 200 / 3) / 100;
    }
  })
  //電探
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_12:1_hit');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_12:2_hit');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 170) / 100;
    }
  })
  //探照灯
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_29:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  //対地装備
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_24:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_37:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
  listitem = document.getElementsByClassName('wp_' + result[3] + '_improve_46:1_fp');
  $(listitem).each(function(index) {
    if (result[4] == "0") {
      this.innerHTML = "";
    } else {
      this.innerHTML = "+" + Math.round(Math.sqrt(Number(result[4])) * 100) / 100;
    }
  })
}
//不用装備のフィルタ
function filter_priweapon(friendid) {
  let listitem = "";
  if (document.getElementById("md_" + friendid + "_wppricheck").checked) {
    listitem = document.getElementsByClassName('notused'); //クラス初期装備を持つ要素を全て読み出し
    $(listitem).each(function(index) {
      this.style.display = "none";
    });
  } else {
    listitem = document.getElementsByClassName('notused'); //クラス初期装備を持つ要素を全て読み出し
    $(listitem).each(function(index) {
      this.style.display = "block";
    });
  }
}
//武器ボーナスを武器モーダルウインドウに書き出す処理
function wp_bonus_single(result) {
  // 艦ID(0),カテゴリ(1),艦種(2),friendid値(3),装備改修値(4)
  let ship_search = "";
  let wp_id = "";
  let lookup = false;
  let bonus = "";

  $.get('./data/BONUS.csv', function(data) {
    csv = $.csv.toArrays(data);
    $(csv).each(function(index) {
      if (this[0] != "id") {
        //最初のループ時のみ動作
        if (wp_id == "") {
          wp_id = this[0];
        }
        if (this[0] != wp_id) {
          if (lookup == false) {
            if ($('wp_' + result[3] + '_' + wp_id + '_bonus_fp').length) {
              $(document.getElementsByClassName('wp_' + result[3] + '_' + wp_id + '_bonus_fp')).each(function(index) {
                this.innerHTML = "";
              });
              $(document.getElementsByClassName('wp_' + result[3] + '_' + wp_id + '_bonus_th')).each(function() {
                this.innerHTML = "";
              });
              $(document.getElementsByClassName('wp_' + result[3] + '_' + wp_id + '_bonus_aa')).each(function() {
                this.innerHTML = "";
              });
              $(document.getElementsByClassName('wp_' + result[3] + '_' + wp_id + '_bonus_as')).each(function() {
                this.innerHTML = "";
              });
            }
          }
          wp_id = this[0];
          lookup = false;
        }
        if (lookup == false) {
          if (Number(result[4]) >= Number(this[2])) {
            search = ":" + this[12] + ":";
            if (search.indexOf(":" + result[0] + ":") != -1) {
              lookup = true;
            } else {
              if (this[11].indexOf(result[2]) != -1) {
                lookup = true;
              } else {
                if (this[10].indexOf(result[1]) != -1) {
                  lookup = true;
                }
              }
            }
          }
          if (lookup == true) {
            bonus = this[3];
            if (bonus == "0") {
              $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_fp')).each(function(index) {
                this.innerHTML = "";
              });
            } else {
              if (Math.sign(bonus) != -1) {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_fp')).each(function(index) {
                  this.innerHTML = "+" + bonus;
                });
              } else {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_fp')).each(function(index) {
                  this.innerHTML = bonus;
                });
              }
            }
            bonus = this[4];
            if (this[4] == "0") {
              $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_th')).each(function() {
                this.innerHTML = "";
              });
            } else {
              if (Math.sign(bonus) != -1) {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_th')).each(function() {
                  this.innerHTML = "+" + bonus;
                });
              } else {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_th')).each(function() {
                  this.innerHTML = bonus;
                });
              }
            }
            bonus = this[5]
            if (this[5] == "0") {
              $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_aa')).each(function() {
                this.innerHTML = "";
              });
            } else {
              if (Math.sign(this[5]) != -1) {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_aa')).each(function() {
                  this.innerHTML = "+" + bonus;
                });
              } else {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_aa')).each(function() {
                  this.innerHTML = bonus;
                });
              }
            }
            bonus = this[7];
            if (this[7] == "0") {
              $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_as')).each(function() {
                this.innerHTML = "";
              });
            } else {
              if (Math.sign(this[7]) != -1) {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_as')).each(function() {
                  this.innerHTML = "+" + bonus;
                });
              } else {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_as')).each(function() {
                  this.innerHTML = bonus;
                });
              }
            }
            bonus = this[8];
            if (this[8] == "0") {
              $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_search')).each(function() {
                this.innerHTML = "";
              });
            } else {
              if (Math.sign(this[8]) != -1) {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_search')).each(function() {
                  this.innerHTML = "+" + bonus;
                });
              } else {
                $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus_search')).each(function() {
                  this.innerHTML = bonus;
                });
              }
            }
            //改修ボーナスを武器選択リンクへ付与
            bonus = this[3] + ':' + this[4] + ':' + this[5] + ':' + this[7] + ':' + this[8] + ':' + this[9];
            $(document.getElementsByClassName('wp_' + result[3] + '_' + this[0] + '_bonus')).each(function() {
              $(this).attr('href', $(this).attr('href').slice(0, -3) + ':' + bonus + '\');');
            });
          }
        }
      }
    });
  });
}

//////////////////////////////////////////////////////
//[3-3.武器装備モーダルウィンドウ武器選択時に動作]
//////////////////////////////////////////////////////
function weapon_open(param) {
  const result = param.split(":");
  //friendid値[0],武器id[1],カテゴリID[2],アイコンID[3],武器名[4],改修分類[5],火力[6],雷装[7],対空[8],対潜[9],索敵[10],命中[11],爆装[12],射程[13],(火力ボーナス[14],雷装ボーナス[15],対空ボーナス[16],対潜ボーナス[17],索敵ボーナス[18],射程ボーナス[19])
  const slotid = document.getElementById("md_" + result[0] + "_wp_slotid").value
  const improve = document.getElementById("md_" + result[0] + "_wp_improve").value

  document.getElementById("wp_" + result[0] + "_slot" + slotid + "_img").src = "./img/weapon/" + result[3] + ".png";
  document.getElementById("wp_" + result[0] + "_slot" + slotid + "_name").innerHTML = result[4];
  document.getElementById("wp_" + result[0] + "_slot" + slotid + "_del").disabled = false;
  document.getElementById('friend_' + result[0] + '_slot' + slotid).value = "";

  if (result.length > 14) {
    document.getElementById('friend_' + result[0] + '_slot' + slotid).value = result[1] + ':' + result[2] + ':' + result[5] + ':' + improve + ':' + result[6] + ':' + result[7] + ':' + result[8] + ':' + result[9] + ':' + result[10] + ':' + result[11] + ':' + result[12] + ':' + result[13] + ':' + result[14] + ':' + result[15] + ':' + result[16] + ':' + result[17] + ':' + result[18] + ':' + result[19];
    //武器id[0],カテゴリID[1],改修分類[2],改修値[3],火力[4],雷装[5],対空[6],対潜[7],索敵[8],命中[9],爆装[10],射程[11],火力ボーナス[12],雷装ボーナス[13],対空ボーナス[14],対潜ボーナス[15],索敵ボーナス[16],射程ボーナス[17]
  } else {
    document.getElementById('friend_' + result[0] + '_slot' + slotid).value = result[1] + ':' + result[2] + ':' + result[5] + ':' + improve + ':' + result[6] + ':' + result[7] + ':' + result[8] + ':' + result[9] + ':' + result[10] + ':' + result[11] + ':' + result[12] + ':' + result[13] + ':' + 0 + ':' + 0 + ':' + 0 + ':' + 0 + ':' + 0 + ':' + 0;
    //武器id[0],カテゴリID[1],改修分類[2],改修値[3],火力[4],雷装[5],対空[6],対潜[7],索敵[8],命中[9],爆装[10],射程[11],火力ボーナス[12],雷装ボーナス[13],対空ボーナス[14],対潜ボーナス[15],索敵ボーナス[16],射程ボーナス[17]
  }
  if (result[5] == 0) {
    document.getElementById("wp_" + result[0] + "_slot" + slotid + "_improve").disabled = true;
    document.getElementById("wp_" + result[0] + "_slot" + slotid + "_improve").value = "★0";
  } else {
    document.getElementById("wp_" + result[0] + "_slot" + slotid + "_improve").disabled = false;
    document.getElementById("wp_" + result[0] + "_slot" + slotid + "_improve").value = "★" + improve;
  }
  friend_status_update(result[0]);
  $('#ｍd_' + result[0] + '_wp').modal('hide');
}


//艦ステータスを計算する
function friend_status_update(friendid) {

  const base = document.getElementById("friend_" + friendid + "_base_param").value.split(':');
  //base [艦ID(0),スロット数(1),火力(2),雷装(3),対空(4),対潜初期(5),対潜最大(6),回避初期(7),回避最大(8),索敵初期(9),索敵最大(10),運初期(11),運最大(12),射程(13)]
  let as = document.getElementById("friend_" + friendid + "_base_as").value;
  as = as.split(':');
  //対潜値[0],対潜改修値[1]

  let content;
  let improve;
  let bonus;
  let setbonus;
  let status;
  let lv = Number(document.getElementById("ship_" + friendid + "_lv").innerHTML);
  let luck = Number(document.getElementById("ship_" + friendid + "_luck").innerHTML);
  let search = Number(document.getElementById("friend_" + friendid + "_base_search").value);
  let fp;
  let th;

  let slot0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let slot1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let slot2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let slot3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let slot4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let slot5 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let param = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  //火力[0],雷装[1],対空[2],対潜[3],索敵[4],命中[5],爆装[6],射程[7],砲撃攻撃力[8],雷撃攻撃力[9],対潜攻撃力[10],夜戦攻撃力[11]

  if (document.getElementById("friend_" + friendid + "_slot0").value != "") {
    slot0 = document.getElementById("friend_" + friendid + "_slot0").value;
    slot0 = slot0.split(':');
    //武器id[0],カテゴリID[1],改修分類[2],改修値[3],火力[4],雷装[5],対空[6],対潜[7],索敵[8],命中[9],爆装[10],射程[11],火力ボーナス[12],雷装ボーナス[13],対空ボーナス[14],対潜ボーナス[15],索敵ボーナス[16],射程ボーナス[17]
  }
  if (document.getElementById("friend_" + friendid + "_slot1").value != "") {
    slot1 = document.getElementById("friend_" + friendid + "_slot1").value;
    slot1 = slot1.split(':');
  }
  if (document.getElementById("friend_" + friendid + "_slot2").value != "") {
    slot2 = document.getElementById("friend_" + friendid + "_slot2").value;
    slot2 = slot2.split(':');
  }
  if (document.getElementById("friend_" + friendid + "_slot3").value != "") {
    slot3 = document.getElementById("friend_" + friendid + "_slot3").value;
    slot3 = slot3.split(':');
  }
  if (document.getElementById("friend_" + friendid + "_slot4").value != "") {
    slot4 = document.getElementById("friend_" + friendid + "_slot4").value;
    slot4 = slot4.split(':');
  }
  if (document.getElementById("friend_" + friendid + "_slot5").value != "") {
    slot5 = document.getElementById("friend_" + friendid + "_slot5").value;
    slot5 = slot5.split(':');
  }

  //火力計算
  param[0] = Number(base[2]) + Number(slot0[4]) + Number(slot0[12]) + Number(slot1[4]) + Number(slot1[12]) + Number(slot2[4]) + Number(slot2[12]) + Number(slot3[4]) + Number(slot3[12]) + Number(slot4[4]) + Number(slot4[12]) + Number(slot5[4]) + Number(slot5[12]);
  //雷装計算
  param[1] = Number(base[3]) + Number(slot0[5]) + Number(slot0[13]) + Number(slot1[5]) + Number(slot1[13]) + Number(slot2[5]) + Number(slot2[13]) + Number(slot3[5]) + Number(slot3[13]) + Number(slot4[5]) + Number(slot4[13]) + Number(slot5[5]) + Number(slot5[13]);
  //対空計算
  param[2] = Number(base[4]) + Number(slot0[6]) + Number(slot0[14]) + Number(slot1[6]) + Number(slot1[14]) + Number(slot2[6]) + Number(slot2[14]) + Number(slot3[6]) + Number(slot3[14]) + Number(slot4[6]) + Number(slot4[14]) + Number(slot5[6]) + Number(slot5[14]);
  //対潜計算
  param[3] = Number(as[0]) + Number(as[1]) + Number(slot0[7]) + Number(slot0[15]) + Number(slot1[7]) + Number(slot1[15]) + Number(slot2[7]) + Number(slot2[15]) + Number(slot3[7]) + Number(slot3[15]) + Number(slot4[7]) + Number(slot4[15]) + Number(slot5[7]) + Number(slot5[15]);
  //索敵計算
  param[4] = search + Number(slot0[8]) + Number(slot0[16]) + Number(slot1[8]) + Number(slot1[16]) + Number(slot2[8]) + Number(slot2[16]) + Number(slot3[8]) + Number(slot3[16]) + Number(slot4[8]) + Number(slot4[16]) + Number(slot5[8]) + Number(slot5[16])
  //命中項計算
  bonus = Math.floor(param[5]) + Number(slot0[9]) + Number(slot1[9]) + Number(slot2[9]) + Number(slot3[9]) + Number(slot4[9]) + Number(slot5[9]);
  improve = get_hit_improve(slot0[1], slot0[2], slot0[3]) + get_hit_improve(slot1[1], slot1[2], slot1[3]) + get_hit_improve(slot2[1], slot2[2], slot2[3]) + get_hit_improve(slot3[1], slot3[2], slot3[3]) + get_hit_improve(slot4[1], slot4[2], slot4[3]) + get_hit_improve(slot5[1], slot5[2], slot5[3]);
  param[5] = Math.floor(2 * Math.sqrt(lv) + 1.5 * Math.sqrt(luck) + bonus + improve);
  content = $('<p>■基礎命中項 =  2 × √(レベル) + 1.5 × √(運) + 装備命中値 + 装備改修(命中)<br>　※小数点以下は切り捨て</p><p>■計算結果<br>' + param[5] + ' = 2 × √(' + lv + ') + 1.5 × √(' + luck + ') + ' + bonus + ' + ' + Math.floor(improve * 10000) / 10000 + '</p>');
  $('#ship_' + friendid + '_hit').data('powertipjq', content);
  $('#ship_' + friendid + '_hit').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });

  //射程計算
  param[7] = Math.max(Number(base[13]), Number(slot0[11]), Number(slot1[11]), Number(slot2[11]), Number(slot3[11]), Number(slot4[11]), Number(slot5[11]), Number(slot0[17]), Number(slot1[17]), Number(slot2[17]), Number(slot3[17]), Number(slot4[17]), Number(slot5[17]));
  //砲撃攻撃力計算
  param[8] = Number(base[2]) + Number(slot0[4]) + Number(slot1[4]) + Number(slot2[4]) + Number(slot3[4]) + Number(slot4[4]) + Number(slot5[4]) + Number(slot0[12]) + Number(slot1[12]) + Number(slot2[12]) + Number(slot3[12]) + Number(slot4[12]) + Number(slot5[12]);
  fp = param[8];
  improve = get_fp_improve(slot0[1], slot0[2], slot0[3]) + get_fp_improve(slot1[1], slot1[2], slot1[3]) + get_fp_improve(slot2[1], slot2[2], slot2[3]) + get_fp_improve(slot3[1], slot3[2], slot3[3]) + get_fp_improve(slot4[1], slot4[2], slot4[3]) + get_fp_improve(slot5[1], slot5[2], slot5[3]);
  param[8] += 5 + improve;
  content = $('<p>■計算式(砲撃攻撃力)<br>砲撃攻撃力 = 火力 + 装備改修(砲撃) ＋ 通常艦隊定数　</p><p>■計算結果<br>' + Math.floor(param[8] * 10000) / 10000 + ' = ' + fp + ' + ' + Math.floor(improve * 10000) / 10000 + ' + 5</p>');
  $('#ship_' + friendid + '_basefp').data('powertipjq', content);
  $('#ship_' + friendid + '_basefp').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });
  param[8] = Math.floor(param[8] * 100) / 100;
  //雷装攻撃力計算
  param[9] = Number(base[3]) + Number(slot0[5]) + Number(slot1[5]) + Number(slot2[5]) + Number(slot3[5]) + Number(slot4[5]) + Number(slot5[5]) + Number(slot0[13]) + Number(slot1[13]) + Number(slot2[13]) + Number(slot3[13]) + Number(slot4[13]) + Number(slot5[13]);
  th = param[9];
  improve = get_th_improve(slot0[1], slot0[2], slot0[3]) + get_th_improve(slot1[1], slot1[2], slot1[3]) + get_th_improve(slot2[1], slot2[2], slot2[3]) + get_th_improve(slot3[1], slot3[2], slot3[3]) + get_th_improve(slot4[1], slot4[2], slot4[3]) + get_th_improve(slot5[1], slot5[2], slot5[3]);
  param[9] += 5 + improve;
  content = $('<p>■計算式(雷撃攻撃力)<br>雷撃攻撃力 = 雷撃 + 装備改修(雷撃) ＋ 通常艦隊定数　</p><p>■計算結果<br>' + Math.floor(param[9] * 10000) / 10000 + ' = ' + th + ' + ' + Math.floor(improve * 10000) / 10000 + ' + 5</p>');
  $('#ship_' + friendid + '_baseth').data('powertipjq', content);
  $('#ship_' + friendid + '_baseth').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });
  param[9] = Math.floor(param[9] * 100) / 100;
  //対潜攻撃力計算
  status = Number(as[0]) + Number(as[1]);
  bonus = get_as(slot1[1], slot1[7]) + get_as(slot2[1], slot2[7]) + get_as(slot3[1], slot3[7]) + get_as(slot4[1], slot4[7]);
  improve = get_as_improve(slot1[1], slot1[2], slot1[3]) + get_as_improve(slot2[1], slot2[2], slot2[3]) + get_as_improve(slot3[1], slot3[2], slot3[3]) + get_as_improve(slot4[1], slot4[2], slot4[3]);
  setbonus = get_as_synergy(slot1[0], slot2[0], slot3[0], slot4[0]);
  param[10] = (13 + 2 * Math.sqrt(status) + bonus * 1.5 + improve) * setbonus;
  content = $('<p>■計算式(対潜攻撃力)<br>対潜攻撃力 = 対潜シナジー補正 × ( √(素対潜) × 2 + 装備対潜 × 1.5 + 装備強化値(対潜) + 艦種別定数 )</p><p>■計算結果<br>' + Math.floor(param[10] * 10000) / 10000 + ' = ' + setbonus + ' × ( √(' + status + ') × 2 + ' + bonus + ' × 1.5 + ' + Math.floor(improve * 10000) / 10000 + ' + 13 )</p>');
  $('#ship_' + friendid + '_baseas').data('powertipjq', content);
  $('#ship_' + friendid + '_baseas').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });
  param[10] = Math.floor(param[10] * 100) / 100;
  //夜戦攻撃力計算
  improve = get_np_improve(slot0[1], slot0[2], slot0[3]) + get_np_improve(slot1[1], slot1[2], slot1[3]) + get_np_improve(slot2[1], slot2[2], slot2[3]) + get_np_improve(slot3[1], slot3[2], slot3[3]) + get_np_improve(slot4[1], slot4[2], slot4[3]) + get_np_improve(slot5[1], slot5[2], slot5[3]);
  param[11] = fp + th + improve;
  content = $('<p>■計算式(夜戦攻撃力)<br>夜戦攻撃力 = 火力 + 雷装 + 改修強化値(夜戦)　</p><p>■計算結果<br>' + Math.floor(param[11] * 10000) / 10000 + ' = ' + fp + ' + ' + th + ' + ' + Math.floor(improve * 10000) / 10000 + '</p>');
  $('#ship_' + friendid + '_basenp').data('powertipjq', content);
  $('#ship_' + friendid + '_basenp').powerTip({
    openEvents: ['click'],
    closeEvents: ['click'],
    placement: 's'
  });
  param[11] = Math.floor(param[11] * 100) / 100;


  //パラメータ書き出し
  document.getElementById("ship_" + friendid + "_pw").innerHTML = param[0];
  document.getElementById("ship_" + friendid + "_th").innerHTML = param[1];
  document.getElementById("ship_" + friendid + "_aa").innerHTML = param[2];
  document.getElementById("ship_" + friendid + "_as").innerHTML = param[3];
  document.getElementById("ship_" + friendid + "_search").innerHTML = param[4];
  document.getElementById("ship_" + friendid + "_hit").innerHTML = param[5] + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';
  switch (param[7]) {
    case 1:
      document.getElementById("ship_" + friendid + "_range").innerHTML = "短";
      break;
    case 2:
      document.getElementById("ship_" + friendid + "_range").innerHTML = "中";
      break;
    case 3:
      document.getElementById("ship_" + friendid + "_range").innerHTML = "長";
      break;
    case 4:
      document.getElementById("ship_" + friendid + "_range").innerHTML = "超長";
      break;
  }
  document.getElementById("ship_" + friendid + "_basefp").innerHTML = param[8] + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';
  if (param[1] == 0) {
    document.getElementById("ship_" + friendid + "_baseth").innerHTML = 0;
  } else {
    document.getElementById("ship_" + friendid + "_baseth").innerHTML = param[9] + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';
  }
  document.getElementById("ship_" + friendid + "_baseas").innerHTML = param[10] + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';
  document.getElementById("ship_" + friendid + "_basenp").innerHTML = param[11] + '<img src="./img/util/tool.png" style="padding:0 1px 3px 2px;">';

}

function get_fp_improve(i, j, k) {
  let result = 0;
  if (k != 0) {
    let search = String(i) + ':' + String(j);
    switch (search) {
      case "1:1":
        result = Math.sqrt(Number(k));
        break;
      case "1:2":
        result = Math.sqrt(Number(k));
        break;
      case "2:1":
        result = Math.sqrt(Number(k));
        break;
      case "36:1":
        result = Math.sqrt(Number(k));
        break;
      case "14:1":
        result = Math.sqrt(Number(k)) * 3 / 4;
        break;
      case "15:1":
        result = Math.sqrt(Number(k)) * 3 / 4;
        break;
      case "29:1":
        result = Math.sqrt(Number(k));
        break;
      case "21:1":
        result = Math.sqrt(Number(k));
        break;
      case "24:1":
        result = Math.sqrt(Number(k));
        break;
      case "37:1":
        result = Math.sqrt(Number(k));
        break;
      case "46:1":
        result = Math.sqrt(Number(k));
        break;
    }
  }
  return result;
}

function get_th_improve(i, j, k) {
  let result = 0;
  if (k != 0) {
    let search = String(i) + ':' + String(j);
    switch (search) {
      case "5:1":
        result = Math.sqrt(Number(k)) * 6 / 5;
        break;
      case "21:1":
        result = Math.sqrt(Number(k)) * 6 / 5;
        break;
    }
  }
  return result;
}

function get_hit_improve(i, j, k) {
  let result = 0;
  if (k != 0) {
    let search = String(i) + ':' + String(j);
    switch (search) {
      case "1:1":
        result = Math.sqrt(Number(k));
        break;
      case "1:2":
        result = Math.sqrt(Number(k));
        break;
      case "2:1":
        result = Math.sqrt(Number(k));
        break;
      case "36:1":
        result = Math.sqrt(Number(k));
        break;
      case "12:1":
        result = Math.sqrt(Number(k));
        break;
      case "12:2":
        result = Math.sqrt(Number(k)) * 17 / 10;
        break;
    }
  }
  return result;
}

function get_as(search, i) {
  let result = 0;
  if (search == "14" || search == "15") {
    result = Number(i);
  }
  return result;
}

function get_as_improve(i, j, k) {
  let result = 0;
  if (k != 0) {
    let search = String(i) + ':' + String(j);
    switch (search) {
      case "14:1":
        result = Math.sqrt(Number(k)) * 2 / 3;
        break;
      case "15:1":
        result = Math.sqrt(Number(k)) * 2 / 3;
        break;
      case "15:2":
        result = Math.sqrt(Number(k)) * 2 / 3;
        break;
    }
  }
  return result;
}


function get_as_synergy(slot1, slot2, slot3, slot4) {
  const type = [':46:47:149:260:261:262:', ':287:288:346:347:377:378:', ':44:45:', ':226:227:'];
  let lookup = [false, false, false, false];
  let result = 1;
  let search = "";
  //ソナー[0],爆雷投射機(爆雷シナジー無し)[1],爆雷投射機(爆雷シナジー有り)[2],爆雷[3]

  for (let i = 0; i < 4; i++) {
    if (type[i].indexOf(":" + slot1 + ":") != -1) {
      lookup[i] = true;
    } else {
      if (type[i].indexOf(":" + slot2 + ":") != -1) {
        lookup[i] = true;
      } else {
        if (type[i].indexOf(":" + slot3 + ":") != -1) {
          lookup[i] = true;
        } else {
          if (type[i].indexOf(":" + slot4 + ":") != -1) {
            lookup[i] = true;
          }
        }
      }
    }
  }
  if (lookup[0] == true && lookup[2] == true && lookup[3] == true) {
    result = 1.4375;
  } else {
    if (lookup[0] == true && lookup[1] == true) {
      result = 1.15;
    } else {
      if (lookup[0] == true && lookup[2] == true) {
        result = 1.15;
      } else {
        if (lookup[0] == true && lookup[3] == true) {
          result = 1.15;
        } else {
          if (lookup[2] == true && lookup[3] == true) {
            result = 1.10;
          }
        }
      }
    }
  }
  return result;
}


function get_np_improve(i, j, k) {
  let result = 0;
  if (k != 0) {
    let search = String(i) + ':' + String(j);
    switch (search) {
      case "1:1":
        result = Math.sqrt(Number(k));
        break;
      case "1:2":
        result = Math.sqrt(Number(k));
        break;
      case "2:1":
        result = Math.sqrt(Number(k));
        break;
      case "36:1":
        result = Math.sqrt(Number(k));
        break;
      case "14:1":
        result = Math.sqrt(Number(k)) * 3 / 4;
        break;
      case "15:1":
        result = Math.sqrt(Number(k)) * 3 / 4;
        break;
      case "29:1":
        result = Math.sqrt(Number(k));
        break;
      case "24:1":
        result = Math.sqrt(Number(k));
        break;
      case "36:1":
        result = Math.sqrt(Number(k));
        break;
      case "46:1":
        result = Math.sqrt(Number(k));
        break;
      case "5:1":
        result = Math.sqrt(Number(k));
        break;
    }
  }
  return result;
}


//////////////////////////////////////////////////////
//[3-4.武器装備モーダルウィンドウに関する各種HTML作成動作]
//////////////////////////////////////////////////////
function htmlwrite_md_wp_improvebar(friendid) {

  let htmlwrite = "";
  if (document.getElementById("md_" + friendid + "_wp_improveform") == null) {
    htmlwrite = '<div class="d-flex justify-content-between wp_improve_frame">';
    htmlwrite += '<form id="md_' + friendid + '_wp_improveform">';
    htmlwrite += '<div><div class="btn-group d-flex" data-toggle="buttons">';
    htmlwrite += '<label class="improve_title">装備改修</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve active" id="md_' + friendid + '_wp_improvebar_0"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':0\')\;" value="0" checked="checked">★0</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_1"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':1\')\;" value="1" >★1</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_2"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':2\')\;" value="2" >★2</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_3"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':3\')\;" value="3" >★3</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_4"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':4\')\;" value="4" >★4</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_5"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':5\')\;" value="5" >★5</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_6"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':6\')\;" value="6" >★6</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_7"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':7\')\;" value="7" >★7</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_8"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':8\')\;" value="8" >★8</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_9"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':9\')\;" value="9" >★9</label>';
    htmlwrite += '<label class="btn btn-outline-info wp_improve" id="md_' + friendid + '_wp_improvebar_10"><input type="radio" name="wp_improve" onclick="improve_check(\'' + friendid + ':10\')\;" value="10" >★10</label>';
    htmlwrite += '</div></div>';
    htmlwrite += '</form>';
    htmlwrite += '<div class="custom-control custom-checkbox comp_ckeck">';
    htmlwrite += '<input class="custom-control-input" type="checkbox" id="md_' + friendid + '_wppricheck" onchange="filter_priweapon(\'' + friendid + '\')\;" checked>';
    htmlwrite += '<label class="custom-control-label" for="md_' + friendid + '_wppricheck">初期装備は表示しない</label>';
    htmlwrite += '</div></div>';
    $("#md_" + friendid + "_wp_improvebar").html(htmlwrite);
  }
  htmlwrite = '<ul class="nav nav-tabs" role="tablist">';
  htmlwrite += '<li class="nav-item"><a class="nav-link active" id="wp_' + friendid + '_nav_main" href="#wp_' + friendid + '_content_main" role="tab" data-toggle="tab">主砲</a></li>';
  htmlwrite += '<li class="nav-item"><a class="nav-link" id="wp_' + friendid + '_nav_sec" href="#wp_' + friendid + '_content_sec" role="tab" data-toggle="tab">副砲/機銃</a></li>';
  htmlwrite += '<li class="nav-item"><a class="nav-link" id="wp_' + friendid + '_nav_tor" href="#wp_' + friendid + '_content_tor" role="tab" data-toggle="tab">魚雷</a></li>';
  htmlwrite += '<li class="nav-item"><a class="nav-link" id="wp_' + friendid + '_nav_as" href="#wp_' + friendid + '_content_as" role="tab" data-toggle="tab">対潜</a></li>';
  htmlwrite += '<li class="nav-item"><a class="nav-link" id="wp_' + friendid + '_nav_rd" href="#wp_' + friendid + '_content_rd" role="tab" data-toggle="tab">電探</a></li>';
  htmlwrite += '<li class="nav-item"><a class="nav-link" id="wp_' + friendid + '_nav_ag" href="#wp_' + friendid + '_content_ag" role="tab" data-toggle="tab">対地</a></li>';
  htmlwrite += '<li class="nav-item"><a class="nav-link" id="wp_' + friendid + '_nav_other" href="#wp_' + friendid + '_content_other" role="tab" data-toggle="tab">その他</a></li>';
  htmlwrite += '<li class="nav-item"><a class="nav-link" id="wp_' + friendid + '_nav_subslot" href="#wp_' + friendid + '_content_subslot" role="tab" data-toggle="tab">補強増設</a></li>';
  htmlwrite += '</ul>';
  $("#md_" + friendid + "_wp_tabbar").html(htmlwrite);
}

//自艦隊武器スロットの改修度変更ツールバー作成
function htmlwrite_md_wp_improve(friendid) {
  if (document.getElementById("wp_" + friendid + "_1_toolbar") == null) {
    let htmlwrite = "";
    for (let i = 0; i < 6; i++) {
      htmlwrite += '<div id="wp_' + friendid + '_' + i + '_toolbar" class="hidden">';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':0\');"><i class="wp_slot_improve_list">★0</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':1\');"><i class="wp_slot_improve_list">★1</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':2\');"><i class="wp_slot_improve_list">★2</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':3\');"><i class="wp_slot_improve_list">★3</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':4\');"><i class="wp_slot_improve_list">★4</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':5\');"><i class="wp_slot_improve_list">★5</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':6\');"><i class="wp_slot_improve_list">★6</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':7\');"><i class="wp_slot_improve_list">★7</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':8\');"><i class="wp_slot_improve_list">★8</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':9\');"><i class="wp_slot_improve_list">★9</i></a>';
      htmlwrite += '<a href="javascript:void(0);" style="text-decoration:none;" onclick="wp_slot_improve(\'' + friendid + ':' + i + ':10\');"><i class="wp_slot_improve_list">★10</i></a>';
      htmlwrite += '</div>';
    }
    $("#wp_" + friendid + "_improve_toolbar").html(htmlwrite);
    for (i = 0; i < 6; i++) {
      $("#wp_" + friendid + "_slot" + i + "_improve").toolbar({
        content: '#wp_' + friendid + '_' + i + '_toolbar',
        position: 'bottom',
        style: 'primary',
        event: 'click',
        hideOnClick: true
      });
    }
  }
}

function htmlwrite_md_wp_content(friendid) {
  let htmlwrite = "";
  htmlwrite += '<div class="tab-content">';
  //主砲
  htmlwrite += '<div class="tab-pane active" id="wp_' + friendid + '_content_main" role="tabpanel" aria-labelledby="tab-weapon-main">';
  htmlwrite += '<div class="list-group"><li class="list-group-item plain"><div class="list_title d-flex">';
  htmlwrite += '<div class="wp_list_label_name">武器名</div>';
  htmlwrite += '<div class="wp_list_param">火力</div>';
  htmlwrite += '<div class="wp_list_param">雷装</div>';
  htmlwrite += '<div class="wp_list_param">対空</div>';
  htmlwrite += '<div class="wp_list_param">対潜</div>';
  htmlwrite += '<div class="wp_list_param">索敵</div>';
  htmlwrite += '<div class="wp_list_param">命中</div>';
  htmlwrite += '<div class="wp_list_label_fooder"></div>';
  htmlwrite += '</div></li>';
  htmlwrite += '<div class="div_srcollbar">';
  htmlwrite += '<div id="wp_' + friendid + '_3"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_2"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_1"></div>';
  htmlwrite += '</div></div></div>';

  //副砲
  htmlwrite += '<div class="tab-pane" id="wp_' + friendid + '_content_sec" role="tabpanel" aria-labelledby="tab-weapon-sec">';
  htmlwrite += '<div class="list-group"><li class="list-group-item plain"><div class="list_title d-flex">';
  htmlwrite += '<div class="wp_list_label_name">武器名</div>';
  htmlwrite += '<div class="wp_list_param">火力</div>';
  htmlwrite += '<div class="wp_list_param">雷装</div>';
  htmlwrite += '<div class="wp_list_param">対空</div>';
  htmlwrite += '<div class="wp_list_param">対潜</div>';
  htmlwrite += '<div class="wp_list_param">索敵</div>';
  htmlwrite += '<div class="wp_list_param">命中</div>';
  htmlwrite += '<div class="wp_list_label_fooder"></div>';
  htmlwrite += '</div></li>';
  htmlwrite += '<div class="div_srcollbar">';
  htmlwrite += '<div id="wp_' + friendid + '_4"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_21"></div>';
  htmlwrite += '</div></div></div>';

  //魚雷
  htmlwrite += '<div class="tab-pane" id="wp_' + friendid + '_content_tor" role="tabpanel" aria-labelledby="tab-weapon-tor">';
  htmlwrite += '<div class="list-group"><li class="list-group-item plain"><div class="list_title d-flex">';
  htmlwrite += '<div class="wp_list_label_name">武器名</div>';
  htmlwrite += '<div class="wp_list_param">火力</div>';
  htmlwrite += '<div class="wp_list_param">雷装</div>';
  htmlwrite += '<div class="wp_list_param">対空</div>';
  htmlwrite += '<div class="wp_list_param">対潜</div>';
  htmlwrite += '<div class="wp_list_param">索敵</div>';
  htmlwrite += '<div class="wp_list_param">命中</div>';
  htmlwrite += '<div class="wp_list_label_fooder"></div>';
  htmlwrite += '</div></li>';
  htmlwrite += '<div class="div_srcollbar">';
  htmlwrite += '<div id="wp_' + friendid + '_32"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_5"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_22"></div>';
  htmlwrite += '</div></div></div>';

  //対潜
  htmlwrite += '<div class="tab-pane" id="wp_' + friendid + '_content_as" role="tabpanel" aria-labelledby="tab-weapon-as">';
  htmlwrite += '<div class="list-group"><li class="list-group-item plain"><div class="list_title d-flex">';
  htmlwrite += '<div class="wp_list_label_name">武器名</div>';
  htmlwrite += '<div class="wp_list_param">火力</div>';
  htmlwrite += '<div class="wp_list_param">雷装</div>';
  htmlwrite += '<div class="wp_list_param">対空</div>';
  htmlwrite += '<div class="wp_list_param">対潜</div>';
  htmlwrite += '<div class="wp_list_param">索敵</div>';
  htmlwrite += '<div class="wp_list_param">命中</div>';
  htmlwrite += '<div class="wp_list_label_fooder"></div>';
  htmlwrite += '</div></li>';
  htmlwrite += '<div class="div_srcollbar">';
  htmlwrite += '<div id="wp_' + friendid + '_14"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_15"></div>';
  htmlwrite += '</div></div></div>';

  //電探
  htmlwrite += '<div class="tab-pane" id="wp_' + friendid + '_content_rd" role="tabpanel" aria-labelledby="tab-weapon-rd">';
  htmlwrite += '<div class="list-group"><li class="list-group-item plain"><div class="list_title d-flex">';
  htmlwrite += '<div class="wp_list_label_name">武器名</div>';
  htmlwrite += '<div class="wp_list_param">火力</div>';
  htmlwrite += '<div class="wp_list_param">雷装</div>';
  htmlwrite += '<div class="wp_list_param">対空</div>';
  htmlwrite += '<div class="wp_list_param">対潜</div>';
  htmlwrite += '<div class="wp_list_param">索敵</div>';
  htmlwrite += '<div class="wp_list_param">命中</div>';
  htmlwrite += '<div class="wp_list_label_fooder"></div>';
  htmlwrite += '</div></li>';
  htmlwrite += '<div class="div_srcollbar">';
  htmlwrite += '<div id="wp_' + friendid + '_12"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_13"></div>';
  htmlwrite += '</div></div></div>';

  //対地
  htmlwrite += '<div class="tab-pane" id="wp_' + friendid + '_content_ag" role="tabpanel" aria-labelledby="tab-weapon-ag">';
  htmlwrite += '<div class="list-group"><li class="list-group-item plain"><div class="list_title d-flex">';
  htmlwrite += '<div class="wp_list_label_name">武器名</div>';
  htmlwrite += '<div class="wp_list_param">火力</div>';
  htmlwrite += '<div class="wp_list_param">雷装</div>';
  htmlwrite += '<div class="wp_list_param">対空</div>';
  htmlwrite += '<div class="wp_list_param">対潜</div>';
  htmlwrite += '<div class="wp_list_param">索敵</div>';
  htmlwrite += '<div class="wp_list_param">命中</div>';
  htmlwrite += '<div class="wp_list_label_fooder"></div>';
  htmlwrite += '</div></li>';
  htmlwrite += '<div class="div_srcollbar">';
  htmlwrite += '<div id="wp_' + friendid + '_24"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_46"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_37"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_47"></div>';
  htmlwrite += '</div></div></div>';

  //その他
  htmlwrite += '<div class="tab-pane" id="wp_' + friendid + '_content_other" role="tabpanel" aria-labelledby="tab-weapon-other">';
  htmlwrite += '<div class="list-group"><li class="list-group-item plain"><div class="list_title d-flex">';
  htmlwrite += '<div class="wp_list_label_name">武器名</div>';
  htmlwrite += '<div class="wp_list_param">火力</div>';
  htmlwrite += '<div class="wp_list_param">雷装</div>';
  htmlwrite += '<div class="wp_list_param">対空</div>';
  htmlwrite += '<div class="wp_list_param">対潜</div>';
  htmlwrite += '<div class="wp_list_param">索敵</div>';
  htmlwrite += '<div class="wp_list_param">命中</div>';
  htmlwrite += '<div class="wp_list_label_fooder"></div>';
  htmlwrite += '</div></li>';
  htmlwrite += '<div class="div_srcollbar">';
  htmlwrite += '<div id="wp_' + friendid + '_17"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_30"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_23"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_39"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_43"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_18"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_19"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_27"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_28"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_36"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_29"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_31"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_33"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_34"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_35"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_44"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_48"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_49"></div>';
  htmlwrite += '<div id="wp_' + friendid + '_50"></div>';
  htmlwrite += '</div></div></div>';

  //補強増設
  htmlwrite += '<div class="tab-pane" id="wp_' + friendid + '_content_subslot" role="tabpanel" aria-labelledby="tab-weapon-subslot">';
  htmlwrite += '<div class="list-group"><li class="list-group-item plain"><div class="list_title d-flex">';
  htmlwrite += '<div class="wp_list_label_name">武器名</div>';
  htmlwrite += '<div class="wp_list_param">火力</div>';
  htmlwrite += '<div class="wp_list_param">雷装</div>';
  htmlwrite += '<div class="wp_list_param">対空</div>';
  htmlwrite += '<div class="wp_list_param">対潜</div>';
  htmlwrite += '<div class="wp_list_param">索敵</div>';
  htmlwrite += '<div class="wp_list_param">命中</div>';
  htmlwrite += '<div class="wp_list_label_fooder"></div>';
  htmlwrite += '</div></li>';
  htmlwrite += '<div class="div_srcollbar">';
  htmlwrite += '<div id="wp_' + friendid + '_0"></div>';
  htmlwrite += '</div></div></div>';
  htmlwrite += '</div>';

  $("#md_" + friendid + "_wp_content").html(htmlwrite);
}


//////////////////////////////////////////////////////
//[4-1.自艦隊ウィンドウに関する各種操作
//////////////////////////////////////////////////////
//装備改修ボタン選択時に動作
function wp_slot_improve(param) {
  const result = param.split(":");
  //friendid値[0],スロット[1],改修値[2]
  param = document.getElementById("friend_" + result[0] + "_slot" + result[1]).value;
  param = param.split(':');
  //武器id[0],カテゴリID[1],改修分類[2],改修値[3],火力[4],雷装[5],対空[6],対潜[7],索敵[8],命中[9],爆装[10],射程[11],火力ボーナス[12],雷装ボーナス[13],対空ボーナス[14],対潜ボーナス[15],索敵ボーナス[16],射程ボーナス[17]
  param[3] = result[2];
  document.getElementById("wp_" + result[0] + "_slot" + result[1] + "_improve").value = "★" + result[2];
  document.getElementById("friend_" + result[0] + "_slot" + result[1]).value = param[0] + ':' + param[1] + ':' + param[2] + ':' + param[3] + ':' + param[4] + ':' + param[5] + ':' + param[6] + ':' + param[7] + ':' + param[8] + ':' + param[9] + ':' + param[10] + ':' + param[11] + ':' + param[12] + ':' + param[13] + ':' + param[14] + ':' + param[15] + ':' + param[16] + ':' + param[17];
  friend_status_update(result[0]);
  $('#wp_' + result[0] + '_slot' + result[1] + '_improve').toolbar('hide');
}

function toolbar_as_bonus(param) {
  const result = param.split(':');
  //friendid[0],対潜改修値[1]

  let as = document.getElementById("friend_" + result[0] + "_base_as").value;
  as = as.split(':');
  document.getElementById("friend_" + result[0] + "_base_as").value = as[0] + ':' + result[1];

  $('a#toolbar_' + result[0] + '_as_bonus0').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus1').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus2').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus3').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus4').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus5').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus6').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus7').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus8').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus9').removeClass("toolbar_bonus_selected");
  $('a#toolbar_' + result[0] + '_as_bonus' + result[1]).addClass("toolbar_bonus_selected");
  friend_status_update(result[0]);
  $('#ship_' + result[0] + '_as').toolbar('hide');
}

//艦娘[閉じる]ボタン選択時に動作
function ship_release(friendid) {
  document.getElementById("ship_" + friendid + "_face").src = "";
  document.getElementById("ship_" + friendid + "_name").innerHTML = "";
  document.getElementById("ship_" + friendid + "_pw").innerHTML = "";
  document.getElementById("ship_" + friendid + "_th").innerHTML = "";
  document.getElementById("ship_" + friendid + "_as").innerHTML = "";
  document.getElementById("ship_" + friendid + "_lv").innerHTML = "";
  document.getElementById("ship_" + friendid + "_range").innerHTML = "";
  wp_slotall_release(friendid);
  $('#ｍodal_friend').modal('hide');
  document.getElementById("friend_" + friendid).style.display = "block";
  document.getElementById("friend_" + friendid + "_selected").style.display = "none";
}

//武器スロット[閉じる]ボタン選択時に動作
function wp_slot_release(param) {
  //friendid値[0],スロット[1]
  const result = param.split(":");
  document.getElementById("wp_" + result[0] + "_slot" + result[1] + "_img").src = "./img/weapon/0.png";
  document.getElementById("wp_" + result[0] + "_slot" + result[1] + "_name").innerHTML = "";
  document.getElementById("wp_" + result[0] + "_slot" + result[1] + "_del").disabled = true;
  document.getElementById("wp_" + result[0] + "_slot" + result[1] + "_improve").disabled = true;
  document.getElementById("wp_" + result[0] + "_slot" + result[1] + "_improve").value = "★0";
  document.getElementById("friend_" + result[0] + "_slot" + result[1]).value = "";
  friend_status_update(result[0]);
}

//武器スロット[全て閉じる]ボタン選択時に動作
function wp_slotall_release(friendid) {
  //friendid値[0]
  for (let i = 0; i < 6; i++) {
    document.getElementById("wp_" + friendid + "_slot" + String(i) + "_img").src = "./img/weapon/0.png";
    document.getElementById("wp_" + friendid + "_slot" + String(i) + "_name").innerHTML = "";
    document.getElementById("wp_" + friendid + "_slot" + String(i) + "_del").disabled = true;
    document.getElementById("wp_" + friendid + "_slot" + String(i) + "_improve").disabled = true;
    document.getElementById("wp_" + friendid + "_slot" + String(i) + "_improve").value = "★0";
    document.getElementById("friend_" + friendid + "_slot" + String(i)).value = "";
  }
  friend_status_update(friendid);
}

//切り替えスイッチ
$('.btn-toggle').click(function() {
  let listitem = "";
  $(this).find('.btn').toggleClass('active');

  if ($(this).find('.btn-dark').length > 0) {
    $(this).find('.btn').toggleClass('btn-dark');
  }

  if ($('#ship_extra_switch').hasClass('btn-dark')) {
    listitem = document.getElementsByClassName("friend_extra")
    $(listitem).each(function(index) {
      this.style.display = "block";
    });
  } else {
    listitem = document.getElementsByClassName("friend_extra")
    $(listitem).each(function(index) {
      this.style.display = "none";
    });
  }
  $(this).find('.btn').toggleClass('btn-default');
});

function friend_all_close() {
  for (let i = 1; i < 7; i++) {
    document.getElementById("friend_" + i + "_selected").style.display = "none";
    document.getElementById("friend_" + i).style.display = "block";
  }
}

//////////////////////////////////////////////////////
//[4-2.自艦隊ウィンドウに関するヘルプメニュー
//////////////////////////////////////////////////////
//ツールチップ表示用
$(function() {
  $('.tool_icons').powerTip({
    placement: 'n'
  });
});

//スクリーンショット
function screen_shot1() {
  $('.weapon_list').addClass("weapon_list_shot");
  $('.weapon_list_shot').removeClass("weapon_list");
  $('.wp_slot_img').addClass("wp_slot_img_shot");
  $('.wp_slot_img_shot').removeClass("wp_slot_img");
  $('.wp_release_all').addClass("wp_release_all_shot");
  $('.wp_release_all_shot').removeClass("wp_release_all");
  $('.wp_release_line').addClass("wp_release_line_shot");
  $('.wp_release_line_shot').removeClass("wp_release_line");
  $('.wp_slot_release').hide();
  $('.ship_close').hide();
  $('.ship_list').addClass("ship_list_shot");
  $('.ship_list_shot').removeClass("ship_list");
  $('.ship_status').addClass("ship_status_shot");
  $('.ship_status_shot').removeClass("ship_status");
  $('.linkbox').addClass("linkbox_shot");
  $('.linkbox_shot').removeClass("linkbox");
  $('.ship_status_guid').children('img').hide();
  $('.kan_frame_selected').addClass("kan_frame_selected_shot");
  $('.kan_frame_selected_shot').removeClass("kan_frame_selected");
  $('.kan_frame').addClass("kan_frame_shot");
  $('.kan_frame_shot').removeClass("kan_frame");
  $('.select').addClass("select_shot");
  $('.select_shot').removeClass("select");
  $('.wp_slot_name').addClass("wp_slot_name_shot");
  $('.wp_slot_name_shot').removeClass("wp_slot_name");
  $('.ship_param_label_a').css("padding-top", "0px");
  $('.ship_param_label_b').css("padding-top", "0px");
  $('.ship_param_label_c').css("padding-top", "0px");


  html2canvas(document.querySelector("#screen_shot1_start"), {}).then(canvas => {
    canvas.toBlob(blob => {
      let now = new Date();
      let filename = "screen_image_" + now.getFullYear() + now.getMonth() + now.getDate() + now.getMilliseconds() + ".png";
      $("#screen_shot1_result").attr("download", filename).attr("href", window.URL.createObjectURL(blob));
      $('a#screen_shot1_result')[0].click();
    });
  });

  $('.weapon_list_shot').addClass("weapon_list");
  $('.weapon_list').removeClass("weapon_list_shot");
  $('.wp_slot_img_shot').addClass("wp_slot_img");
  $('.wp_slot_img').removeClass("wp_slot_img_shot");
  $('.wp_release_all_shot').addClass("wp_release_all");
  $('.wp_release_all').removeClass("wp_release_all_shot");
  $('.wp_release_line_shot').addClass("wp_release_line");
  $('.wp_release_line').removeClass("wp_release_line_shot");
  $('.wp_slot_release').show();
  $('.ship_close').show();
  $('.ship_list_shot').addClass("ship_list");
  $('.ship_list').removeClass("ship_list_shot");
  $('.ship_status_shot').addClass("ship_status");
  $('.ship_status').removeClass("ship_status_shot");
  $('.linkbox_shot').addClass("linkbox");
  $('.linkbox').removeClass("linkbox_shot");
  $('.kan_frame_selected_shot').addClass("kan_frame_selected");
  $('.kan_frame_selected').removeClass("kan_frame_selected_shot");
  $('.kan_frame_shot').addClass("kan_frame");
  $('.kan_frame').removeClass("kan_frame_shot");
  $('.select_shot').addClass("select");
  $('.select').removeClass("select_shot");
  $('.wp_slot_name_shot').addClass("wp_slot_name");
  $('.wp_slot_name').removeClass("wp_slot_name_shot");
  $('.ship_param_label_a').css("padding-top", "5px");
  $('.ship_param_label_b').css("padding-top", "5px");
  $('.ship_param_label_c').css("padding-top", "5px");
  $('.ship_status_guid').children('img').show();
}



//ドロップダウンメニュー関連の処理
$('.dropdown-menu').click(function(e) {
  e.stopPropagation();
});

//ドロップダウンメニューオープン時の処理
$("#ship_1_lvch").on("click", function() {
  document.getElementById("ship_1_lv_input").value = document.getElementById("ship_1_lv").innerHTML;
  document.getElementById("ship_1_lv_slidebar").value = document.getElementById("ship_1_lv").innerHTML;
});
$("#ship_1_luckch").on("click", function() {
  document.getElementById("ship_1_luck_input").value = document.getElementById("ship_1_luck").innerHTML;
  document.getElementById("ship_1_luck_slidebar").value = document.getElementById("ship_1_luck").innerHTML;
});
$("#ship_2_lvch").on("click", function() {
  document.getElementById("ship_2_lv_input").value = document.getElementById("ship_2_lv").innerHTML;
  document.getElementById("ship_2_lv_slidebar").value = document.getElementById("ship_2_lv").innerHTML;
});
$("#ship_2_luckch").on("click", function() {
  document.getElementById("ship_2_luck_input").value = document.getElementById("ship_2_luck").innerHTML;
  document.getElementById("ship_2_luck_slidebar").value = document.getElementById("ship_2_luck").innerHTML;
});
$("#ship_3_lvch").on("click", function() {
  document.getElementById("ship_3_lv_input").value = document.getElementById("ship_3_lv").innerHTML;
  document.getElementById("ship_3_lv_slidebar").value = document.getElementById("ship_3_lv").innerHTML;
});
$("#ship_3_luckch").on("click", function() {
  document.getElementById("ship_3_luck_input").value = document.getElementById("ship_3_luck").innerHTML;
  document.getElementById("ship_3_luck_slidebar").value = document.getElementById("ship_3_luck").innerHTML;
});
$("#ship_4_lvch").on("click", function() {
  document.getElementById("ship_4_lv_input").value = document.getElementById("ship_4_lv").innerHTML;
  document.getElementById("ship_4_lv_slidebar").value = document.getElementById("ship_4_lv").innerHTML;
});
$("#ship_4_luckch").on("click", function() {
  document.getElementById("ship_4_luck_input").value = document.getElementById("ship_4_luck").innerHTML;
  document.getElementById("ship_4_luck_slidebar").value = document.getElementById("ship_4_luck").innerHTML;
});
$("#ship_5_lvch").on("click", function() {
  document.getElementById("ship_5_lv_input").value = document.getElementById("ship_5_lv").innerHTML;
  document.getElementById("ship_5_lv_slidebar").value = document.getElementById("ship_5_lv").innerHTML;
});
$("#ship_5_luckch").on("click", function() {
  document.getElementById("ship_5_luck_input").value = document.getElementById("ship_5_luck").innerHTML;
  document.getElementById("ship_5_luck_slidebar").value = document.getElementById("ship_5_luck").innerHTML;
});
$("#ship_6_lvch").on("click", function() {
  document.getElementById("ship_6_lv_input").value = document.getElementById("ship_6_lv").innerHTML;
  document.getElementById("ship_6_lv_slidebar").value = document.getElementById("ship_6_lv").innerHTML;
});
$("#ship_6_luckch").on("click", function() {
  document.getElementById("ship_6_luck_input").value = document.getElementById("ship_6_luck").innerHTML;
  document.getElementById("ship_6_luck_slidebar").value = document.getElementById("ship_6_luck").innerHTML;
});


//ドロップダウンメニュー決定ボタン選択時の処理
function ship_dropdown_submit(param) {
  const result = param.split(':');
  //friendid値[0],ドロップダウン操作パラメータ[1]
  param = document.getElementById("friend_" + result[0] + "_base_param").value;
  const status = param.split(':');
  //艦ID[0],スロット数[1],火力[2],雷装[3],対空[4],対潜初期[5],対潜最大[6],回避初期[7],回避最大[8],索敵初期[9],索敵最大[10],運初期[11],運最大[12],射程[13]
  param = document.getElementById("friend_" + result[0] + "_base_as").value;
  const as = param.split(':');

  //対潜値[0],対潜改修値[1]
  if (result[1] == "lv") {
    let lv = document.getElementById("ship_" + result[0] + "_lv_input").value;
    document.getElementById("ship_" + result[0] + "_lv").innerHTML = lv;
    document.getElementById("friend_" + result[0] + "_base_search").value = Math.floor((Number(status[10]) - Number(status[9])) / 99 * lv + Number(status[9]));
    document.getElementById("friend_" + result[0] + "_base_as").value = Math.floor((Number(status[6]) - Number(status[5])) / 99 * lv + Number(status[5])) + ':' + as[1];
    friend_status_update(result[0]);
    $("#ship_" + result[0] + "_dropdown").collapse('toggle');
  }
  if (result[1] == "luck") {
    let luck = document.getElementById("ship_" + result[0] + "_luck_input").value;
    document.getElementById("ship_" + result[0] + "_luck").innerHTML = luck;
    friend_status_update(result[0]);
    $("#ship_" + result[0] + "_dropdown_luck").collapse('toggle');
  }
}

//ドロップダウンメニュー閉じるボタン選択時の処理
function ship_dropdown_close(friendid) {
  $("#ship_" + friendid + "_dropdown").collapse('toggle');
}

function ship_dropdown_luck_close(friendid) {
  $("#ship_" + friendid + "_dropdown_luck").collapse('toggle');
}
