$(function () {
  var GraphView = Backbone.View.extend({
    el: $('#graph-manager'),

    initialize: function() {
      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.render);
    },

    onChange: function () {
      this.render;
    },

    render: function () {
      $('.chart').empty();
      var list = this.collection.toJSON();
      var data = [];
      var labels = [];
      
      list.forEach(function (entry) {
            data.push(entry.yvalue);
            labels.push(entry.xlabel);
      })

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      var svg = d3.select('.chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      x.domain(data.map(function(d) { 
        return d; 
      }));

      y.domain([0, d3.max(data, function(d) { 
        return d; 
      })]);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Y Value');

      svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { 
          return x(d); 
        })
        .attr('width', x.rangeBand())
        .attr('y', function(d) { 
          return y(d); 
        })
        .attr('height', function(d) { 
          return height - y(d); 
        });
    }

  });
window.graphView = new GraphView({collection: window.entryCollection});
});
