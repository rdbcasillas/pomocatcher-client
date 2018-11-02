import * as d3 from 'd3';

function barchartBuilder() {
    let margin = {
            top: 20,
            right: 20,
            bottom: 70,
            left: 40
        },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    let parseDate = d3.timeParse("%m/%d/%Y");

    let x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
    let y = d3.scaleLinear().range([height, 0]);
    let xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat("%d-%b-%y"));
    let yAxis = d3.axisLeft()
        .scale(y)
        .ticks(5);

    this.createChart = function (pomosdata) {
        pomosdata.forEach(function (d) {
            d.created = parseDate(d.created);
            d.pomocount = +d.pomocount;
        });

        console.log(pomosdata);


        var svg = d3.select(".container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        x.domain(pomosdata.map(function (d) {
            return d.created;
        }));
        y.domain([0, d3.max(pomosdata, function (d) {
            return +d.pomocount;
        })]);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value");
        svg.selectAll("bar")
            .data(pomosdata)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function (d) {
                return x(d.created);
            })
            .attr("width", x.bandwidth())
            .attr("y", function (d) {
                return y(d.pomocount);
            })
            .attr("height", function (d) {
                return height - y(d.pomocount);
            });
    };
}
export {
    barchartBuilder
};