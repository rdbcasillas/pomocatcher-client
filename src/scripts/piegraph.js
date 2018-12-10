import * as d3 from 'd3';
const legendcolor = require("d3-svg-legend")

const dims = {
  width: 300,
  height: 300,
  radius: 150
};
const cent = {
  x: (dims.width / 2) + 5,
  y: (dims.height / 2) + 5
}

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150);

const graph = svg.append('g')
  .attr('transform', `translate(${cent.x}, ${cent.y})`);

const pie = d3.pie()
  .sort(null)
  .value(d => d.cost);


const scale = d3.scaleOrdinal(d3.schemeSet3);
const arcPath = d3.arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2)

const legendGroup = svg.append('g')
  .attr('transform', `translate(${dims.width + 40}, 10)`)

const legend = d3.legendColor()
  .shape('path', d3.symbol().type(d3.symbolCircle)())
  .shapePadding(10)
  .scale(scale);


function update(data) {

  let categs = data.map(d => d.name);
  scale.domain(categs);

  legendGroup.call(legend);
  legendGroup.selectAll('text').attr('fill', 'white');

  const paths = graph.selectAll('path')
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

// data via firestore

var data = []
db.collection('expenses').onSnapshot(res => {
  res.docChanges().forEach(change => {

    const doc = { ...change.doc.data(),
      'id': change.doc.id
    };
    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }

  })
  update(data);
})

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