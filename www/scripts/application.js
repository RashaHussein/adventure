var map, currentLocation, service, longitude, latitude, directionsDisplay;;
// Declared globaly so it clears previous directions
directionsDisplay = new google.maps.DirectionsRenderer();

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
	google.maps.event.addDomListener(btn, 'click', fetchPlaces);

}

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
	      directionsDisplay.setDirections(result);
	      document.getElementById('map').style.height = '90%';
	    }
	  });
	});
};

var pickRandom = function(places) {
	return places[Math.floor(Math.random()*places.length)];
};

