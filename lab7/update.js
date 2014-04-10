$(document).ready(function () {
  var tweets = [];
  var has = [];
  var data = $.getJSON("tweets.json", function (data) {
    $.each(data, function (key, val) {
      tweets.push(val.text);
      var tempHashes = val.entities.hashtags;
      for (var i = 0; i < tempHashes.length; i++) {
        has.push(tempHashes[i].text);
      };
    });
    for (var i = 0; i < 5; i++) {
      addT(i);
      addH(i);
    };
    setTimeout(refreshT, 3000, 5 % tweets.length);
    setTimeout(refreshH, 4000, 5 % has.length);
  });

  function refreshT(count) {
    addT(count);
    setTimeout(refreshT, 3000, (count + 1) % tweets.length);
  }

  function addT(count) {
    $("<li/>", {
      html: tweets[count % tweets.length]
    }).hide().prependTo('#tweetslist').slideDown('slow');
    var target = $( "#tweetslist li:nth-child(6)" );
    target.hide('slow', function(){ target.remove(); });
  }

  function refreshH(count){
    addH(count);
    setTimeout(refreshH, 4000, (count + 1) % has.length);
  }

  function addH(count){
    $("<li/>", {
      html: "#".concat(has[count % has.length])
    }).hide().prependTo('#hashlist').slideDown('slow');
    var target = $( "#hashlist li:nth-child(6)" );
    target.hide('slow', function(){ target.remove(); });
  }
});