var map, currentLocation, service, longitude, latitude,
directionsDisplay = new google.maps.DirectionsRenderer(),
steps = [],
finalDestination,
currentStepIndex = 0,
infoWindow,
magicButton,
marker;

google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
  navigator.geolocation.getCurrentPosition(function(position) {

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    currentLocation = new google.maps.LatLng(latitude, longitude);
    map = new google.maps.Map(document.getElementById('map'), { center: currentLocation, zoom: 17 });
    google.maps.event.addListenerOnce(map, 'idle', function(){
      magicButton.style.display = "block";
      magicButton.textContent = " Start Adventure ";
      infoWindow = new google.maps.InfoWindow({
        content: '<div class="instr-label">You are here</div>'
      });
      placeMarker();
    });

  });
  magicButton = document.getElementById('magic-button');
  google.maps.event.addDomListener(magicButton, 'click', doMagic);
}

var doMagic = function () {
  if (currentStepIndex > 0) {
    advanceStep();
  } else {
    fetchPlaces();
  }
};

var fetchPlaces = function() {
  var request = {
    location: currentLocation,
    radius: '1600',
    types: ['amusement_park', 'aquarium', 'art_gallery', 'bar', 'book_store', 'bowling_alley', 'cafe', 'casino', 'food', 'library', 'museum', 'night_club', 'park', 'restaurant', 'shopping_mall', 'spa', 'zoo']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(results, status) {
    var destination = pickRandom(results);
    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin: currentLocation,
      destination: destination.geometry.location,
      travelMode: google.maps.TravelMode.WALKING
    };

    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        steps = result.routes[0].legs[0].steps;
        finalDesctination =  result.routes[0].legs[0]["end_address"];
        advanceStep();
        changeButton();
      }
    });
  });
};

var advanceStep = function () {
  if (steps[currentStepIndex]) {
    var currentStep = steps[currentStepIndex];
    currentLocation = new google.maps.LatLng(currentStep["end_point"].k, currentStep["end_point"].D);

    map.setZoom(17);
    map.setCenter(currentLocation);

    infoWindow = new google.maps.InfoWindow({
      content: '<div class="instr-label">' + currentStep.instructions + '</div>'
    });
    currentStepIndex++;
  } else {
    infoWindow = new google.maps.InfoWindow({
      content: '<div class="instr-label"><h4 style="padding:0; margin:0;">You have Arrived!:</h4>' + finalDesctination + '</div>'
    });
    magicButton.textContent = "Start New Adventure";
    currentStepIndex = 0;
    steps = [];
  }

  placeMarker();
};

var placeMarker = function() {
  if (marker) {
    marker.setMap(null);
  }

  marker = new google.maps.Marker({
    position: currentLocation,
    map: map,
    animation: google.maps.Animation.DROP,
    infoWindow: infoWindow
  });

  infoWindow.open(map, marker);
}

var changeButton = function () {
  magicButton.classList.add('nextStep');
  magicButton.textContent = " Next Step >> ";
}

var pickRandom = function(places) {
  return places[Math.floor(Math.random()*places.length)];
};

