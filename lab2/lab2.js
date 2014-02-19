var myLat;
var myLon;
function getLocation()
{
  var op = window.location.search.substring(1);
  console.log(op);
  switch(op)
  {
    case "troy":
    myLat = 42.5803;
    myLon = -83.1431;
    ajaxCall();
    break;
    case "raleigh":
    myLat = 35.8189;
    myLon = -78.6447;
    ajaxCall();
    break;
    case "mauna":
    myLat = 21.3000;
    myLon = -157.8167;
    ajaxCall();
    break;
    case "gps":
    default:
    if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(queryOpenweather, errorFunc, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    }
    else{alert("Geolocation is not supported by this browser.");}  
    break;

  }
  
};
function queryOpenweather(position)
{
  myLat = position.coords.latitude;
  myLon = position.coords.longitude;
  ajaxCall();
};
function errorFunc(error)
{ 
  myLat = 21.3000;
  myLon = -157.8167;
  ajaxCall();
};
function ajaxCall()
{ 
  $.ajax({
    type: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?lat=" + myLat + "&lon=" + myLon + "&units=imperial",
    dataType: "jsonp",
    success: function(responseData, status) {
      console.log(responseData);
      $('#panel-title').html("The your local city is: " + responseData.name + ".");
      for (var i = 0; i < responseData.weather.length; i++) {
        $("<img/>", {
          src: "http://openweathermap.org/img/w/" + responseData.weather[i].icon + ".png",
          width: 100,
          class: "img-thumbnail"
        }).appendTo("#rightSide");
      };
      $("<hr/>", { }).appendTo('#rightSide');
      $("<p/>", {
        html: ((responseData.main.temp).toFixed(2) + "°F")
      }).appendTo('#rightSide');
    },
    error: function(msg) {
      alert("There was a problem: " + msg.status + " " + msg.statusText);
    }
  })
};
getLocation();