var map, currentLocation, service, longitude, latitude, directionsDisplay, steps;
// Declared globaly so it clears previous directions
directionsDisplay = new google.maps.DirectionsRenderer();
steps = [];
var dest;
var currentStep = 0;
var marker;
google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
	// Get User Location and Display Map
	navigator.geolocation.getCurrentPosition(function(position) {
		console.log(position);

		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		currentLocation = new google.maps.LatLng(latitude, longitude);
		map = new google.maps.Map(document.getElementById('map'), { center: currentLocation, zoom: 15 });
		google.maps.event.addListener(map, 'tilesloaded', function() {
			btn.style.display = "block";
		});
	});
	var btn = document.getElementById('magic-button');
	google.maps.event.addDomListener(btn, 'click', doMagic);

}

var doMagic = function () {
	if(currentStep > 0) {
		advanceStep();
	}
	else {
		fetchPlaces();
	}
};

var fetchPlaces = function() {
	var request = {
	  location: currentLocation,
	  radius: '1600',
	  types: ['amusement_park', 'aquarium', 'art_gallery', 'bar', 'book_store', 'bowling_alley', 'cafe', 'casino', 'food', 'library', 'museum', 'night_club', 'park', 'restaurant', 'shopping_mall', 'spa', 'zoo']
	};
	//Initialize Places Search and retrieve a nearby place randomly
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, function(results, status) {
	  var destination = pickRandom(results);
	  
	  var directionsService = new google.maps.DirectionsService();
	  
	  directionsDisplay.setMap(map);
	  directionsDisplay.setPanel(document.getElementById("directionsPanel"))
	  var request = {
	    origin: currentLocation,
	    destination: destination.geometry.location,
	    travelMode: google.maps.TravelMode.WALKING
	  };
	  directionsService.route(request, function(result, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      //directionsDisplay.setDirections(result);
	      console.log(result.routes[0].legs[0]);
	      steps = result.routes[0].legs[0].steps;
	      dest =  result.routes[0].legs[0]["end_address"];
	      console.log(steps);

	      advanceStep();	
	      changeButton();      
	    }
	  });
	});
};


var advanceStep = function () {
	var pos = new google.maps.LatLng(steps[currentStep]["end_point"].k, steps[currentStep]["end_point"].D)
	map.setCenter(pos);
	map.setZoom(16);

	//Create InfoWindow to display next step in direction list
	var infoWindow = new google.maps.InfoWindow({
	    content: '<div class="instr-label"><h4 style="padding:0; margin:0;">Next Step:</h4>'+ steps[currentStep].instructions + '</div>'
	});

	var lastInfo = new google.maps.InfoWindow({
		content:'<div class="instr-label"><h4 style="padding:0; margin:0;">You have Arrived to your adventure:</h4>'+dest+'</div>'
	});
	//make sure to remove all markers before displaying next step
	if(marker) marker.setMap(null);

	if(currentStep == steps.length - 1) {
		var btn = document.getElementById('magic-button');
		btn.textContent = "Start Another Adventure";
		currentStep = 0;
		steps = [];
		infoWindow = lastInfo;
	}

	marker = new google.maps.Marker({
		position: pos,
		map: map,
		infoWindow: infoWindow
	});
	infoWindow.open(map, marker);
	currentStep++;
};

var changeButton = function () {
	//Remove Start Adventure Button
	var btn = document.getElementById('magic-button');
	btn.classList.add('nextStep');
	btn.textContent = "Display Next Step";
}

var pickRandom = function(places) {
	return places[Math.floor(Math.random()*places.length)];
};

