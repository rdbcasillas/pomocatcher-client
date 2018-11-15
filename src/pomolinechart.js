import * as d3 from 'd3';

function linechartBuilder() {
  let weekday = "monday";
  let width = 200,
    cellSize = 13,
    height = cellSize * 9;

  function pathMonth(t) {
    let n = weekday === "weekday" ? 5 : 7;
    let d = Math.max(0, Math.min(n, countDay(t)));
    let w = timeWeek.count(d3.timeYear(t), t);
    return `${d === 0 ? `M${w * cellSize},0`
    : d === n ? `M${(w + 1) * cellSize},0`
    : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
  }
  let formatDate = d3.timeFormat("%x");
  let format = d3.format("+.2%");
  let formatDay = d => "SMTWTFS" [d.getDay()];
  let formatMonth = d3.timeFormat("%b");

  let color = d3.scaleSequential(d3.interpolateBlues).domain([0, 10])

  var formatPercent = d3.format(".1%");
  let countDay = weekday === "sunday" ? d => d.getDay() : d => (d.getDay() + 6) % 7;

  let timeWeek = weekday === "sunday" ? d3.timeSunday : d3.timeMonday;

  this.createChart = function (data) {
    data.forEach((d) => {
      d.date = new Date(d.date);
      d.value = +d.pomocount;
    });
    let years = d3.nest()
      .key(d => d.date.getFullYear())
      .entries(data)
      .reverse();

    let svg = d3.select("#calendar")
      .append("svg")
      .attr("width", width)
      .attr("height", height * years.length)
      .style("font", "12px sans-serif")
      .style("width", "100%")
      .style("height", "auto");

    let year = svg.selectAll("g")
      .data(years)
      .enter().append("g")
      .attr("transform", (d, i) => `translate(40,${height * i + cellSize * 1.5})`);

    year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(d => d.key);

    year.append("g")
      .attr("text-anchor", "end")
      .selectAll("text")
      .data((weekday === "weekday" ? d3.range(2, 7) : d3.range(7)).map(i => new Date(1995, 0, i)))
      .enter().append("text")
      .attr("x", -5)
      .attr("y", d => (countDay(d) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

    year.append("g")
      .selectAll("rect")
      .data(d => d.values)
      .enter().append("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize)
      .attr("x", d => timeWeek.count(d3.timeYear(d.date), d.date) * cellSize + 0.5)
      .attr("y", d => countDay(d.date) * cellSize + 0.5)
      .attr("fill", d => color(d.value))
      .append("title")
      .text(d => `${formatDate(d.date)}: ${d.value} pomos`);

    let month = year.append("g")
      .selectAll("g")
      .data(d => d3.timeMonths(d3.timeMonth(d.values[0].date), d.values[d.values.length - 1].date))
      .enter().append("g");

    month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);

    month.append("text")
      .attr("x", d => timeWeek.count(d3.timeYear(d), timeWeek.ceil(d)) * cellSize - 10)
      .attr("y", -5)
      .text(formatMonth);
  };
};

export {
  linechartBuilder
};