function initMap() {
	var mapDiv = document.getElementById('map');

	var map = new google.maps.Map(mapDiv, {
		center: {lat: -17.3, lng: 146.36},
		zoom: 6
	});


	setMarkers(map);
}

//begin reading the global variable json containing information about the trucks and populate the trucks list
function parseTruckData(bleach_json) {
	var reefs = []
	for (var i = 0; i < bleach_json.length; i++) {	
		var reef = [];
		reef.push(bleach_json[i]['name']);
		reef.push(parseFloat(bleach_json[i]['lat']));
		reef.push(parseFloat(bleach_json[i]['long']));
		reef.push(bleach_json[i]['bleach']);
		reefs.push(reef);
	}
	return reefs
}

// function sendUpdate() {
// 	update = document.getElementById('xentry');
// 	var updateText = update.value;
// 	update.value = "";
// 	truck_id = update.parentNode.id.toString().split('truck-update')[1];
// 	console.log(truck_id);
// 	// $.post("/update_menu", {id: truck_id, data: updateText}, function(error) {
// 	// 	if (error) {
// 	// 		console.log(error)
// 	// 	}
// 	// });
// }

function setMarkers(map) {
	b98 = parseTruckData(bleach98);
	b02 = parseTruckData(bleach02);

	function getCircle(magnitude) {
        return {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'red',
          fillOpacity: .2,
          scale: Math.pow(2, magnitude) / 2,
          strokeColor: 'white',
          strokeWeight: .5
        };
      }

	for (var i = 0; i < b98.length; i++) {
		(function(index){
			var reef = b98[index];
			var marker = new google.maps.Marker({
				position: {lat: reef[1], lng: reef[2]},
				map: map,
				icon: getCircle(5),
				title: reef[0]
			});
			var infowindow = new google.maps.InfoWindow({
				content: '<div>'+
				'<h1 color="black">' + reef[0] + '</h1>' +
				'</div>'
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		})(i);
	}
}