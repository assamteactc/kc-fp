$(window).on("load",function(){

//艦種一覧データを読み込んで、艦娘選択モーダルウィンドウのタブに表示させる処理
$.get('./data/MY_SHIPTYPE.csv',function(data){
  var csv = $.csv.toArrays(data);
  var itemlist = '';
  $(csv).each(function(index){
    if (this[0]!="id") {
      switch (this[1]){
        case 1:
              itemlist += '<button type="button" class="btn btn-danger">' + this[2] + '<button>';
              break;
        case 2:
              itemlist += '<button type="button" class="btn btn-w2arning">' + this[2] + '<button>';
              break;
      }
    }
  })
  console.log(itemlist);
  $("#myship_type").append(itemlist);
});


//艦娘データを読み込んで、艦娘選択モーダルウィンドウに表示させる処理
  $.get('./data/MY_SHIP.csv',function(data){
    csv = $.csv.toArrays(data);
    itemlist = '';
    $(csv).each(function(index){
      if (this[0]!="id") {
        itemlist += '<a href="#" class="list-group-item list-group-item-action lists">';
        itemlist += '<div class="flex-container">';
        itemlist += '<div class="width_55p"><img src="./img/ship/' + this[0] + '.png">&nbsp;' + this[3] + '</div>';
        itemlist += '<div class="width_15p font-pw">&nbsp;' + this[4] + '</div>';
        itemlist += '<div class="width_15p font-th">&nbsp;' + this[5] + '</div>';
        itemlist += '<div class="width_15p font-as">&nbsp;' + this[7] + '</div>';
        itemlist += '</div></a>';
      }
    })
    $("#myship_list").append(itemlist);
  });

});
