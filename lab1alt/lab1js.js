$(document).ready(function(e) {
	var i=0;
	$.ajax({
		type: "GET",
		url: "tweets-clean.json",
		dataType: "json",
		success: function(responseData, status) {
			var text = '';
			var hashtags = '';
			$.each(responseData.tweet, function(i, item) {
				text += '<li>' + item.text + "</li>";
				
				$.each(item.entities.hashtags, function(a, tag) {
					hashtags += '<li>' + tag.text + "</li>";
				});

			});
		$("#text").html(text);
		$("#hashtags").html(hashtags);
		},

		error: function(msg) {
		alert("There was a problem: " + msg.status + " " + msg.statusText);
		}
	})

// begin tweets slideshow style, yo
window.setInterval(function(){
    $('#text li:first-child').each(function(index){
    	$(this).append();
    	$(this).remove();
    });
    
}, 1500);
//end tweets slideshow style, yo

// begin hashtags slideshow style, yo
window.setInterval(function(){
  var target = $('#hashtags li:first-child').hide('slow');
  target.hide('slow', function(){ 
    $('#hashtags').append(target); 
  });
  
    // .each(function(){
      
      // $('#hashtags li:nth-child(1)').remove();
    // });
    
}, 500);
//end hashtags slideshow style, yo





});
