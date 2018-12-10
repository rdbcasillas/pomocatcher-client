import * as d3 from 'd3';
const legendcolor = require("d3-svg-legend")

let svg, graph, pie, legendGroup, scale, legend, paths, arcPath;

const dims = {
  width: 300,
  height: 300,
  radius: 100
};
const cent = {
  x: (dims.width / 2) + 5,
  y: (dims.height / 2) + 5
}


svg = d3.select('.piesvg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150);

function piechartBuilder() {

  this.createChart = function (data) {
    svg = d3.select('.piesvg')
      .attr('width', dims.width + 150)
      .attr('height', dims.height + 150);

    graph = svg.selectAll('g')
      .data([1])
      .enter()
      .append('g')
      .attr('transform', `translate(${cent.x}, ${cent.y})`)
      .attr('class', 'maing');

    graph.exit().remove();
    pie = d3.pie()
      .sort(null)
      .value(d => d.cost);

    arcPath = d3.arc()
      .outerRadius(dims.radius)
      .innerRadius(dims.radius / 2)

    legendGroup = svg.selectAll('g.legendg')
      .data([1])
      .enter()
      .append('g')
      .attr('transform', `translate(${dims.width + 40}, 50)`)
      .attr('class', 'legendg')

    legendGroup.exit().remove();
    scale = d3.scaleOrdinal(d3.schemePaired);
    legend = legendcolor.legendColor()
      .shape('circle')
      .shapeRadius(5)
      .scale(scale);

    this.update(data)
  }

  this.update = function (data) {
    let categs = data.map(d => d.name);
    scale.domain(categs);

    legendGroup.call(legend);
    legendGroup.selectAll('text')
      .attr('x', 12)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .style('text-align', 'left')

    paths = graph.selectAll('path')
      .data(pie(data));

    paths.exit()
      .transition().duration(500)
      .attrTween('d', arcTweenExit)
      .remove();

    paths.attr('d', arcPath)
      .transition().duration(500)
      .attrTween('d', arcTweenUpdate);

    paths.enter()
      .append('path')
      .attr('class', 'arc')
      .attr('stroke', 'white')
      .attr('stroke-width', '3px')
      .attr('fill', d => scale(d.data.name))
      .each(function (d) {
        this._current = d
      })
      .transition().duration(500)
      .attrTween('d', arcTweenEnter);
  }


  //console.log(data);

  const arcTweenEnter = (d) => {
    var i = d3.interpolate(d.endAngle, d.startAngle);

    return function (t) {
      d.startAngle = i(t);
      return arcPath(d);
    }
  }
  const arcTweenExit = (d) => {
    var i = d3.interpolate(d.startAngle, d.endAngle);

    return function (t) {
      d.startAngle = i(t);
      return arcPath(d);
    }
  };

  function arcTweenUpdate(d) {
    var i = d3.interpolate(this._current, d)
    this._current = d;

    return function (t) {
      return arcPath(i(t));
    }
  }
}
export {
  piechartBuilder
};