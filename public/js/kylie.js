// launchpad
function initializeMap() {
  // creating base svg
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  

  // hexagon shape variables
  var hex_di  = 100,
      // radius
      hex_rad = hex_di / 2,
      // apothem
      hex_apo = hex_rad * Math.cos(Math.PI / 6),
      // matrix defining state placement
      states_grid = usStateMatrix(),
      // data
      states_data = usStateData(),
      // rows we'll generate
      rows 		= states_grid.length,
      // columns we'll generate
      cols 		= states_grid[0].length,
      // stroke width around hexagon
      stroke  = 4,
      // the hover state zoom scale
      scale   = 2,
      // initial x
      x				= hex_rad * scale / 2 + stroke * scale,
      // initial y
      y				= hex_rad * scale + stroke * scale,
      // side length in pixels
      side    = Math.sin(Math.PI / 6) * hex_rad,
      // height of map in pixels
      height	= (hex_di - side) * rows + side + hex_rad * scale + stroke * scale,
      // width of map in pixels
      width		= (hex_apo * 2) * cols + hex_rad * scale + stroke * scale;
  

  // svg attributes
  svg.setAttribute("class", "svg");
  svg.setAttribute("width", "110%");
  svg.setAttribute("height", "90%");
  svg.setAttribute("viewBox", "0 0 " + width + " " + height);
  
  // loop variables
  var offset = false,
      // parsing state data
      states = states_data.states,
      data = states_data.data,
      // initial state index
      state_index = 0;
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // getting range of data defaults

  var colony_change_max = -1000000,
      colony_change_min = 1000000,
      affliction_max = 0,
      affliction_min = 100,
      perc_change_max = -1000,
      perc_change_min = 150;
  
  // for each data find max and min
  for(var d = 0; d < data.length; d++) {
    perc_change_min = Math.min(perc_change_min, data[d].perc_change);
    perc_change_max = Math.max(perc_change_max, data[d].perc_change);
    colony_change_max = Math.max(colony_change_max, data[d].colony_change);
    colony_change_min = Math.min(colony_change_min, data[d].colony_change);
    affliction_max = Math.max(affliction_max, data[d].affliction);
    affliction_min = Math.min(affliction_min, data[d].affliction);
  }

  
  // getting differences in range
  var colony_change_diff = colony_change_max - colony_change_min,
      affliction_diff = affliction_max - affliction_min
      perc_change_diff = perc_change_max - perc_change_min;

  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // draw grid
  for(var i = 0; i < states_grid.length; i++) {

    var loop_x = offset ? hex_apo * 2 : hex_apo;
    
    var loc_x = x; 
    for(var s = 0; s < states_grid[i].length; s++) {
      // grid plot in 0 and 1 array
      var grid_plot = states_grid[i][s];

      // if we have a plot in the grid
      if (grid_plot != 0) {
        // get the state
        var state = states[state_index];
        
        // lookup data for state
        for(var d = 0; d < data.length; d++) {
          if (data[d].state == state.abbr) {
            state.data = data[d];
          }
        }

        // ratio for fill on polygon
        var ratio = (state.data.perc_change - perc_change_min) / perc_change_diff;    
        
        // create the hex group
        var hexGroup = getHexGroup(svg, loc_x + loop_x , y, hex_rad, state, ratio, width, state.data);
      

        

        // have to reappend element on hover for stacking
        hexGroup.addEventListener("mouseenter", function () {
          var self = this;
          self.setAttribute("class", "hover");
          self.remove();
          svg.appendChild(self);

        });
        // clear class
        hexGroup.addEventListener("mouseleave", function () {
          this.setAttribute("class", "");
          
        });


        // append the hex to our svg
        svg.appendChild(hexGroup);
        // increase the state index reference
        state_index++;
      }

      // move our x plot to next hex position
      loc_x += hex_apo * 2; 
    }
    // move our y plot to next row position
    y += hex_di * 0.75; 
    // toggle offset per row
    offset = !offset;
  }

  // add svg to DOM
  document.body.appendChild(svg);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// run the initialization script
initializeMap();

var abbr;
 
// individual hex calculations
function getHexGroup(svg,x,y,r,state,ratio,width,data) {
  var svgNS  = svg.namespaceURI, // svgNS for creating svg elements
  		group	 = document.createElementNS(svgNS, "g"),
  		hex 	 = document.createElementNS(svgNS, "polygon"),
  		//abbr 	 = document.createElementNS(svgNS, "text"),
  		name 	 = document.createElementNS(svgNS, "text"),
      pi_six = Math.PI/6,
      cos_six = Math.cos(pi_six),
      sin_six = Math.sin(pi_six);

  abbr = document.createElementNS(svgNS, "text");

  // hexagon polygon points
  var hex_points = [
    [x, y - r].join(","),
    [x + cos_six * r, y - sin_six * r].join(","),
    [x + cos_six * r, y + sin_six * r].join(","),
    [x, y + r].join(","),
    [x - cos_six * r, y + sin_six * r].join(","),
    [x - cos_six * r, y - sin_six * r].join(",")
  ]
  
  // hexagon fill based on ratio

  //var fill = "hsl(180,60%," + ((1 - ratio) * 60 + 20) + "%)";
  if(ratio >= 0 && ratio < 0.15) {
    var fill = '#018571';
  } 

  else if(ratio > 0.16 && ratio < 0.29) {
    var fill = '#80cdc1';
  } 

  else if(ratio > 0.29 && ratio < 0.31) {
    var fill = '#999999';
  } 

  else if(ratio > 0.31 && ratio < 0.61) {
    var fill = '#dfc27d';
  } 

  else {
    var fill = '#a6611a';
  }
    
  hex.setAttribute("points", hex_points.join(" "));
  hex.setAttribute("fill", fill);
  
  abbr.setAttribute("class", "state-abbr");
  abbr.setAttribute("x", x);
  abbr.setAttribute("y", y);
  abbr.textContent = state.abbr;
  
  name.setAttribute("class", "state-name");
  name.setAttribute("x", x);
  name.setAttribute("y", y);
  name.textContent = state.name;
  
  // loop through data points
  var index = 1,
      // lineheight of data text
      line_height = 19,
      // starting y of data
      start_y = 60;
  

  var count = 0;

  for(var key in data) {

    var text = document.createElementNS(svgNS, "text");
    //var lineplot = document.createElementNS(svgNS, "plot");

    text.setAttribute("x", width / 2);

    // add line spacing to info once highlighted
    text.setAttribute("y", 1.2 * index * line_height + start_y);

    if(key != 'state') {

      if(data[key] == 0) {

        if(count == 0) {
          text.setAttribute("class", "data");
          text.textContent = "Data unavailable";
          count = 1;
        } 
      } 

    else {
      
      text.setAttribute("class", "data");


      if(keyToName(key) == "Affliction") {

        text.textContent = keyToName(key) + ": " + data[key] + "%";

      } 

      else if(keyToName(key) == "Perc Change") {

          if(data[key] > 0) {
            text.textContent = "Percentage Change" + ": +" + data[key] + "%";
          } else {
            text.textContent = "Percentage Change" + ": " + data[key] + "%";
          }

        
      } else {

          if(data[key] > 0) {
            text.textContent = keyToName(key) + ": +" + numberWithCommas(data[key]);
          } else {
            text.textContent = keyToName(key) + ": " + numberWithCommas(data[key]);
          }
      }

    }
      
      //key is state
    } else {

      // add state name to above text
      // add any important info for specific states
      text.setAttribute("class", "data title");

      
      //lineplot.textContent(makeLineGraph(state.abbr));

      if(state.name == "Illinois") {
        text.textContent = state.name;
      } else {
      text.textContent = state.name;
      }
    }
    group.appendChild(text);
    index++;
  }
  
  group.appendChild(hex);  
  group.appendChild(abbr);  
  group.appendChild(name);  
  
  return group;
}

function keyToName(str) {
  return str.replace(/_/g,' ')
    .replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function usStateMatrix() {
  return [
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,1,1,0],
    [0,1,1,1,1,1,0,1,0,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [1,0,0,0,1,0,0,1,0,0,0,0]
  ]
}

function usStateData() {
  return {
    states: [
      { abbr: "AK", name: "Alaska" },
      { abbr: "ME", name: "Maine"},

      { abbr: "VT", name: "Vermont" },
      { abbr: "NH", name: "New Hampshire"},

      { abbr: "WA", name: "Washington" },
      { abbr: "MT", name: "Montana" },
      { abbr: "ND", name: "North Dakota" },
      { abbr: "MN", name: "Minnesota" },
      { abbr: "WI", name: "Wisconsin" },
      { abbr: "MI", name: "Michigan" },
      { abbr: "NY", name: "New York" },
      { abbr: "MA", name: "Massachusetts" },
      { abbr: "RI", name: "Rhode Island"},

      { abbr: "ID", name: "Idaho" },
      { abbr: "WY", name: "Wyoming" },
      { abbr: "SD", name: "South Dakota" },
      { abbr: "IA", name: "Iowa" },
      { abbr: "IL", name: "Illinois" },
      { abbr: "IN", name: "Indiana" },
      { abbr: "OH", name: "Ohio" },
      { abbr: "PA", name: "Pennsylvania" },
      { abbr: "NJ", name: "New Jersey" },
      { abbr: "CT", name: "Connecticut"},

      { abbr: "OR", name: "Oregon" },
      { abbr: "NV", name: "Nevada" },
      { abbr: "CO", name: "Colorado" },
      { abbr: "NE", name: "Nebraska" },
      { abbr: "MO", name: "Missouri" },
      { abbr: "KY", name: "Kentucky" },
      { abbr: "WV", name: "West Virgina" },
      { abbr: "VA", name: "Virginia" },
      { abbr: "MD", name: "Maryland" },
      { abbr: "DE", name: "Delaware"},

      { abbr: "CA", name: "California" },
      { abbr: "UT", name: "Utah" },
      { abbr: "NM", name: "New Mexico" },
      { abbr: "KS", name: "Kansas" },
      { abbr: "AR", name: "Arkansas" },
      { abbr: "TN", name: "Tennessee" },
      { abbr: "NC", name: "North Carolina" },
      { abbr: "SC", name: "South Carolina" },
      { abbr: "DC", name: "District of Columbia"},

      { abbr: "AZ", name: "Arizona" },
      { abbr: "OK", name: "Oklahoma" },
      { abbr: "LA", name: "Louisiana" },
      { abbr: "MS", name: "Mississippi" },
      { abbr: "AL", name: "Alabama" },
      { abbr: "GA", name: "Georgia"},

      { abbr: "HI", name: "Hawaii" },
      { abbr: "TX", name: "Texas" },
      { abbr: "FL", name: "Florida" }
    ],

    data: [
      { state: "AL", perc_change: 7.14, colony_change: 500, affliction: 3.94},
      { state: "AK", perc_change: 0, colony_change: 0, affliction: 0},
      { state: "AZ", perc_change: -14.29, colony_change: -5000, affliction: 8.92},
      { state: "AR", perc_change: 116.67, colony_change: 14000, affliction: 8.12},
      { state: "CA", perc_change: -20.83, colony_change: -300000, affliction: 10.92},
      { state: "CO", perc_change: 71.43, colony_change: 2500, affliction: 4.22},
      { state: "CT", perc_change: -30.77, colony_change: -1200, affliction: 8.22},
      { state: "DE", perc_change: 0, colony_change: 0, affliction: 0},
      { state: "DC", perc_change: 0, colony_change: 0, affliction: 0},
      { state: "FL", perc_change: -19.67, colony_change: -60000, affliction: 9.1},
      { state: "GA", perc_change: -3.85, colony_change: -4000, affliction: 6.4},
      { state: "HI", perc_change: 42.86, colony_change: 4500, affliction: 1.7},
      { state: "ID", perc_change: 11.11, colony_change: 9000, affliction: 6.62},
      { state: "IL", perc_change: 16.67, colony_change: 1000, affliction: 4.86},
      { state: "IN", perc_change: -27.78, colony_change: -2500, affliction: 7.1},
      { state: "IA", perc_change: 32, colony_change: 4000, affliction: 17.1},
      { state: "KS", perc_change: 2.17, colony_change: 100, affliction: 12.86},
      { state: "KY", perc_change: -6.67, colony_change: -500, affliction: 11.9},
      { state: "LA", perc_change: 33.33, colony_change: 17000, affliction: 4.68},
      { state: "ME", perc_change: -29.03, colony_change: -900, affliction: 2.3},
      { state: "MD", perc_change: -13.33, colony_change: -1000, affliction: 8.18},
      { state: "MA", perc_change: 3.45, colony_change: 100, affliction: 4.04},
      { state: "MI", perc_change: 51.52, colony_change: 8500, affliction: 6.18},
      { state: "MN", perc_change: 32.14, colony_change: 9000, affliction: 5.92},
      { state: "MS", perc_change: -29.41, colony_change: -10000, affliction: 1.64},
      { state: "MO", perc_change: -4.17, colony_change: -500, affliction: 3.94},
      { state: "MT", perc_change: 82.35, colony_change: 7000, affliction: 2.74},
      { state: "NE", perc_change: 5, colony_change: 500, affliction: 1.64},
      { state: "NV", perc_change: 0, colony_change: 0, affliction: 0},
      { state: "NH", perc_change: 0, colony_change: 0, affliction: 0},
      { state: "NJ", perc_change: 41.67, colony_change: 2500, affliction: 4.64},
      { state: "NM", perc_change: -14.29, colony_change: -1000, affliction: 11.86},
      { state: "NY", perc_change: 14.81, colony_change: 4000, affliction: 6.88},
      { state: "NC", perc_change: -22.92, colony_change: -5500, affliction: 5.42},
      { state: "ND", perc_change: 43.86, colony_change: 25000, affliction: 2.98},
      { state: "OH", perc_change: -11.11, colony_change: -2000, affliction: 11.06},
      { state: "OK", perc_change: -36.84, colony_change: -3500, affliction: 2.68},
      { state: "OR", perc_change: -9.09, colony_change: -7000, affliction: 3.26},
      { state: "PA", perc_change: -10.71, colony_change: -1500, affliction: 7.6},
      { state: "RI", perc_change: 0, colony_change: 0, affliction: 0},
      { state: "SC", perc_change: -2.94, colony_change: -500, affliction: 4.42},
      { state: "SD", perc_change: -40, colony_change: -20000, affliction: 1.46},
      { state: "TN", perc_change: -5.26, colony_change: -500, affliction: 7},
      { state: "TX", perc_change: 25.65, colony_change: 49000, affliction: 4.12},
      { state: "UT", perc_change: 100, colony_change: 6000, affliction: 3.7},
      { state: "VT", perc_change: 0, colony_change: 0, affliction: 0},
      { state: "VA", perc_change: -18.75, colony_change: -1500, affliction: 5.42},
      { state: "WA", perc_change: 50, colony_change: 26000, affliction: 3.54},
      { state: "WV", perc_change: 38.3, colony_change: 1800, affliction: 7.46},
      { state: "WI", perc_change: 33.33, colony_change: 5500, affliction: 10.3},
      { state: "WY", perc_change: -50.91, colony_change: -2800, affliction: 4.66}
    ]

  }
}

function makeLineGraph (selectedState) {

    // Set the dimensions of the canvas / graph
    var margin = {top: 50, right: 20, bottom: 50, left: 80},
        width = 600 - margin.left - margin.right,
        height = 330 - margin.top - margin.bottom,
        padding = 100; // space around the chart, not including labels

    // Parse the date / time
    //var parseDate = d3.time.format("%d-%b-%y").parse;

    // Set the ranges
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });
        
    // Adds the svg canvas
    var svg = d3.select("body")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ -55 +","+(height/2)+")rotate(-90)") 
            .style("font-size", "13px")
            .style("font-family", "optima")
            .text("Number of Bee Colonies");

    svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (width/2) +","+(300-(padding/3))+")") 
            .style("font-size", "13px")
            .style("font-family", "optima")
            .text("Time Period (Q1 2015 to Q1 2016)");

     svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 1.8))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px")
        .style("font-family", "optima")
        //.style("font-weight", "bold")
        .text("Bee Colony Population Over Time: " + selectedState);

    // Get the data
    d3.csv("lineplotdata.csv", function(error, data) {

        data.forEach(function(d) {

            d["state"] = d["state"];
            d.date = +d.date;
            d.close = +d.close;
            
        });

        // function to only get desired state to plot
        function isState(x) {
            return x.state == selectedState;
        }

        // get subset of data
        data = data.filter(isState);

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "yaxis")
            .call(yAxis);

    });
}
