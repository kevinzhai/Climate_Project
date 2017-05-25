var markers = [];
var icons = {}; 
var map;
var legend = document.getElementById('legend');;

function initMap() {
	var mapDiv = document.getElementById('map');

	map = new google.maps.Map(mapDiv, {
		center: {lat: -17.3, lng: 146.36},
		zoom: 6
	});

	setMarkers(map, bleach98);
	setLegend();
}



function setLegend() {
	for (var key in icons) {
		var type = icons[key];
		var name = type.name;
		var icon = type.icon;
		var div = document.createElement('div');
		div.innerHTML = '<img src="pics/' + type.pic + '"> ' + '<font size="4">' + name + '</font>';
		legend.appendChild(div);
	}

	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
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
function setMarkers(map, data) {
	b98 = parseTruckData(data);

	function getCircle(color, opacity, magnitude) {
		return {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: color,
			fillOpacity: opacity,
			scale: Math.pow(2, magnitude) / 2,
			strokeColor: 'white',
			strokeWeight: .5
		};
	}

	icons = {
		one: {
			name: '<1% Bleached',
			icon: getCircle('green', .5, 4),
			pic: 'one.png'
		},
		two: {
			name: '1-10% Bleached',
			icon: getCircle('yellowgreen', .5, 4),
			pic: 'two.png'
		},
		three: {
			name: '10-30% Bleached',
			icon: getCircle('yellow', .5, 4),
			pic: 'three.png'
		},
		four: {
			name: '30-60% Bleached',
			icon: getCircle('Orange', .5, 4),
			pic: 'four.png'
		},
		five: {
			name: '>60% Bleached',
			icon: getCircle('red', .5, 4),
			pic: 'five.png'
		}
	};


	for (var i = 0; i < b98.length; i++) {
		(function(index){
			var reef = b98[index];

			if (reef[3] == 1) {
				var type_icon = icons.one.icon
			} else if (reef[3] == 2) {
				var type_icon = icons.two.icon
			} else if (reef[3] == 3) {
				var type_icon = icons.three.icon
			}else if (reef[3] == 4) {
				var type_icon = icons.four.icon
			}else {
				var type_icon = icons.five.icon
			}



			var marker = new google.maps.Marker({
				position: {lat: reef[1], lng: reef[2]},
				map: map,
				icon: type_icon,
				title: reef[0]
			});
			markers.push(marker);
			var infowindow = new google.maps.InfoWindow({
				content: '<div id="tooltip">'+
				'<h1>' + reef[0] + '</h1>' +
				'</div>'
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		})(i);
	}
}

function reload98() {
	var mapDiv = document.getElementById('map');

	map = new google.maps.Map(mapDiv, {
		center: {lat: -17.3, lng: 146.36},
		zoom: 6
	});

	$('#map1').removeClass('button').addClass('buttonselect');
	$('#map2').removeClass('buttonselect').addClass('button');
	$('#map3').removeClass('buttonselect').addClass('button');
	setMarkers(map, bleach98);
}

function reload02() {
	var mapDiv = document.getElementById('map');

	map = new google.maps.Map(mapDiv, {
		center: {lat: -17.3, lng: 146.36},
		zoom: 6
	});

	$('#map1').removeClass('buttonselect').addClass('button');
	$('#map2').removeClass('button').addClass('buttonselect');
	$('#map3').removeClass('buttonselect').addClass('button');
	setMarkers(map, bleach02);
}

function reload16() {
	var mapDiv = document.getElementById('map');

	map = new google.maps.Map(mapDiv, {
		center: {lat: -17.3, lng: 146.36},
		zoom: 6
	});

	$('#map1').removeClass('buttonselect').addClass('button');
	$('#map2').removeClass('buttonselect').addClass('button');
	$('#map3').removeClass('button').addClass('buttonselect');
	setMarkers(map, bleach16);
}

//$('#map2').removeClass('button').addClass('buttonselect');