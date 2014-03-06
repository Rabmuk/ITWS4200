$(document).ready(function () {
  var tweets = [];
  var has = [];
  var data = $.getJSON("tweets2.json", function (data) {
    $.each(data, function (key, val) {
      tweets.push(val.text);
      var tempHashes = val.entities.hashtags;
      for (var i = 0; i < tempHashes.length; i++) {
        has.push(tempHashes[i].text);
      };
    });
    refreshT(0);
    refreshH(0);
  });

  function refreshT(count) {
    // console.log(count);
      $("<li/>", {
        html: tweets[count % tweets.length]
      }).hide().prependTo('#tweetslist').slideDown('slow');
      var target = $( "#tweetslist li:nth-child(6)" );
      target.hide('slow', function(){ target.remove(); });
      setTimeout(refreshT, 3000, (count + 1) % tweets.length);
    }

  function refreshH(count){
      $("<li/>", {
        html: "#".concat(has[count % has.length])
      }).hide().prependTo('#hashlist').slideDown('slow');
      var target = $( "#hashlist li:nth-child(6)" );
      target.hide('slow', function(){ target.remove(); });
      setTimeout(refreshH, 4000, (count + 1) % has.length);
  }
  });