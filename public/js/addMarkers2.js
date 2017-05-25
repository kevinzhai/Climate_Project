var map;
var markers = [];

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

	var icons = {
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

	
	var legend = document.getElementById('legend');
	for (var key in icons) {
		var type = icons[key];
		var name = type.name;
		var icon = type.icon;
		var div = document.createElement('div');
		div.innerHTML = '<img src="pics/' + type.pic + '"> ' + '<font size="4">' + name + '</font>';
		legend.appendChild(div);
	}

	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);


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

    // Loop through markers and set map to null for each
    for (var i=0; i<markers.length; i++) {

    	markers[i].setMap(null);
    }

    // Reset the markers array
    markers = [];

    // Call set markers to re-add markers
    setMarkers(map, bleach98);
}

function reload02() {

    // Loop through markers and set map to null for each
    for (var i=0; i<markers.length; i++) {

    	markers[i].setMap(null);
    }

    // Reset the markers array
    markers = [];

    // Call set markers to re-add markers
    setMarkers(map, bleach02);
}

function reload16() {

    // Loop through markers and set map to null for each
    for (var i=0; i<markers.length; i++) {

    	markers[i].setMap(null);
    }

    // Reset the markers array
    markers = [];

    // Call set markers to re-add markers
    setMarkers(map, bleach98);
}

function initialize() {
	
	var mapOptions = {
		center: {lat: -17.3, lng: 146.36},
		zoom: 6
	}
	
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	setMarkers(map, bleach98);
	
    // Bind event listener on button to reload markers
    document.getElementById('map1').addEventListener('click', reload98());
    document.getElementById('map2').addEventListener('click', reload02());
    document.getElementById('map3').addEventListener('click', reload16());
}

initialize();


