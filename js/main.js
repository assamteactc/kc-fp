$(window).on("load",function(){

  console.log('hello world');


  $.get('./data/MY_SHIP.csv',function(data){
    var csv = $.csv.toArrays(data);
    var itemlist = '';
    $(csv).each(function(index){
      itemlist += '<div class="list-item">';
      itemlist += '<span><img source="./img/ship/' + this[0] + '.png"</span>';
      console.log('<span><img source="./img/ship/' + this[0] + '.png"</span>');
      itemlist += '<span>ID:' + this[0]+'</span>';
      itemlist += '<span><a href="' + this[1] + '">' + this[2] + '</a></span>';
      itemlist += '<span>' + this[3] + '</span>';
      itemlist += '</div>';
    })
    $("#myship_list").append(itemlist);
  });


});
