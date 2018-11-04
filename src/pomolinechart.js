import * as d3 from 'd3';

function linechartBuilder() {
  let margin = {
      top: 20, right: 20, bottom: 70, left: 50,
    },
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // parse the date / time
  const parseDate = d3.isoParse;

  // set the ranges
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // define the line
  const valueline = d3.line()
    .x(d => x(d.created))
    .y(d => y(d.pomocount));

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg2 = d3.select('.container2').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    );

  this.createChart = function (pomosdata) {
    pomosdata.forEach((d) => {
      d.created = parseDate(d.created);
      d.pomocount = +d.pomocount;
    });

    // Scale the range of the pomosdata
    x.domain(d3.extent(pomosdata, d => d.created));
    y.domain([0, d3.max(pomosdata, d => d.pomocount)]);

    // Add the valueline path.
    svg2.append('path')
      .data([pomosdata])
      .attr('class', 'line')
      .attr('d', valueline);

    // Add the X Axis
    svg2.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%d-%b-%y')))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)');

    // Add the Y Axis
    svg2.append('g')
      .call(d3.axisLeft(y));
  };
}

export { linechartBuilder };
