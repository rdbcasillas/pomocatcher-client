import * as d3 from 'd3';

function linechartBuilder() {
  const weekday = 'monday';
  let width = 300,
    cellSize = Math.floor(window.innerWidth / 230),
    //cellSize = 8,
    height = cellSize * 18;

  console.log(cellSize)

  function pathMonth(t) {
    let cellSize1 = cellSize + 3
    const n = weekday === 'weekday' ? 5 : 7;
    const d = Math.max(0, Math.min(n, countDay(t)));
    const w = timeWeek.count(d3.timeYear(t), t);
    return `${d === 0 ? `M${w * cellSize1},0`
      : d === n ? `M${(w + 1) * cellSize1},0`
        : `M${(w + 1) * cellSize1},0V${d * cellSize1}H${w * cellSize1}`}V${n * cellSize1}`;
  }
  const formatDate = d3.timeFormat('%x');
  const formatDay = d => 'SMTWTFS' [d.getDay()];
  const formatMonth = d3.timeFormat('%b');

  const color = d3.scaleSequential(d3.interpolateBlues).domain([-1, 14]);

  let countDay = weekday === 'sunday' ? d => d.getDay() : d => (d.getDay() + 6) % 7;

  let timeWeek = weekday === 'sunday' ? d3.timeSunday : d3.timeMonday;

  // const svg = d3.select('#calendar')
  //   .append('svg')
  //   .attr('class', 'calsvg')

  this.createChart = function (data) {
    data.forEach((d) => {
      d.date = new Date(d.date);
      d.value = +d.pomocount;
    });
    // let maxpomo = d3.max(data, function (d) {
    //   return +d.pomocount;
    // });
    // let minpomo = d3.min(data, function (d) {
    //   return +d.pomocount;
    // });
    // console.log(maxpomo, minpomo)
    // color.domain([3, maxpomo]);
    let fontsize = cellSize * 2 + "px sans serif";
    const years = d3.nest()
      .key(d => d.date.getFullYear())
      .entries(data)
      .reverse();


    const svg = d3.select('.calsvg')
      //.attr('width', width)
      .attr('height', height * years.length)
      .style('width', '100%')
      .style('height', 'auto')
      .style('font', fontsize)

    const year = svg.selectAll('g')
      .data(years)

    let yearEnter = year
      .enter()
      .append('g')
      .merge(year)
      .attr('transform', (d, i) => `translate(40,${height * i + cellSize * 2.5})`);

    yearEnter.append('text');
    yearEnter.append('g').attr('class', 'days');
    yearEnter.append('g').attr('class', 'cells');
    yearEnter.append('g').attr('class', 'months');

    year.merge(yearEnter)
      .select('text')
      .attr('x', -5)
      .attr('y', -5)
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text(d => d.key);

    year.merge(yearEnter)
      .select('.days')
      .attr('text-anchor', 'end')
      .selectAll('text')
      .data((weekday === 'weekday' ? d3.range(2, 7) : d3.range(7)).map(i => new Date(1995, 0, i)))
      .enter()
      .append('text')
      .attr('x', -5)
      .attr('y', d => (countDay(d) + 0.5) * (cellSize + 4))
      .attr('dy', '0.31em')
      .text(formatDay);

    year.merge(yearEnter)
      .select('.cells')
      .selectAll('rect')
      .data(d => d.values)
      .enter()
      .append('rect')
      .attr('width', cellSize)
      .attr('height', cellSize + 2)
      .attr('x', d => timeWeek.count(d3.timeYear(d.date), d.date) * cellSize - 20)
      .attr('y', d => countDay(d.date) * (cellSize + 4) + 0.5)
      .attr('fill', d => color(d.value))
      .style('stroke-width', '1px')
      .style('stroke', 'black')
      .append('title')
      .text(d => `${formatDate(d.date)}: ${d.value} pomos`);

    const month =
      year.merge(yearEnter)
      .select('.months')
      .selectAll('g')
      .data(d => d3.timeMonths(d3.timeMonth(d.values[0].date), d.values[d.values.length - 1].date))
      .enter()
      .append('g');

    month.filter((d, i) => i).append('path')
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('d', pathMonth);

    month.append('text')
      .attr('x', d => timeWeek.count(d3.timeYear(d), timeWeek.ceil(d)) * cellSize - 25)
      .attr('y', -5)
      .text(formatMonth);
  };
}

export {
  linechartBuilder
};