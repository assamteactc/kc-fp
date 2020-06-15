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
              list1 += '<a href="#" class="list-group-item list-group-item-action lists CL INCOMP ' + this[8] +'">';
            } else {
              list1 += '<a href="#" class="list-group-item list-group-item-action lists CL COMP ' + this[8] +'">';
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
              list2 += '<a href="#" class="list-group-item list-group-item-action lists DD INCOMP ' + this[8] +'">';
            } else {
              list2 += '<a href="javascript:void(0);" onclick="ship_open();" class="list-group-item list-group-item-action lists DD COMP ' + this[8] +'">';
              //引数 [艦種,艦ID,スロット数,火力,雷装,対潜初期,対潜最大]
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
              list3 += '<a href="#" class="list-group-item list-group-item-action lists DE INCOMP ' + this[8] +'">';
            } else {
              list3 += '<a href="#" class="list-group-item list-group-item-action lists DE COMP ' + this[8] +'">';
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

// $("#btn1").on('click', function() {
//   // モーダル閉じる
//   $('#sampleModal').modal('hide');
//   let foodVal = $('#food').val();
//   $('#re').text(foodVal);
// });

function ship_open(){
  // let result =param.split(':');
  // alert('test');
  $('#modal_myship').modal('hide');
}
//艦娘データのフィルタリング処理(全て表示)
function show_CL(target) {
  if(document.getElementById("complete_check").checked){   //checkedの場合非改造艦を読み込まない。
    let listitem = document.getElementsByClassName('CL COMP');
  } else {
    let listitem = document.getElementsByClassName('CL');
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}
function show_DD(target) {
  if(document.getElementById("complete_check").checked){  //checkedの場合非改造艦を読み込まない。
    let listitem = document.getElementsByClassName('DD COMP');
  } else {
    let listitem = document.getElementsByClassName('DD');
  }
  $(listitem).each(function(index) {
    this.style.display = "block";
  })
}
function show_DE(target) {
  if(document.getElementById("complete_check").checked){  //checkedの場合非改造艦を読み込まない。
    let listitem = document.getElementsByClassName('DE COMP');
  } else {
    let listitem = document.getElementsByClassName('DE');
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
