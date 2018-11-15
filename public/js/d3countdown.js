const pomoend = document.getElementById('pomoend');
const breakend = document.getElementById('breakend');
let elapsedPomos = 0,
  countmins,
  countsecs,
  pauseme,
  fields,
  field,
  path,
  label,
  arc,
  totalpomos,
  width = 200,
  height = 200,
  status = "pomo"

let svg = d3v3.select("#countdown").append("svg");

function createChart() {
  svg
    .attr("width", width)
    .attr("height", height);
  totalpomos = Number($('input#pomocount').val());
  countmins = Number($('input.seconds').val());
  breakmins = 5;
  countsecs = countmins * 60;
  pauseme = false;
  fields = [{
    value: countsecs,
    size: countsecs,
    label: "m",
    update: function (countsecs) {
      return countsecs;
    }
  }];

  arc = d3v3.svg.arc()
    .innerRadius(width / 2.5 - 20)
    .outerRadius(width / 2.5 - 5)
    .startAngle(0)
    .endAngle(function (d) {
      return (d.value / d.size) * 2 * Math.PI;
    });

  createClock(fields);
}

function createClock(fields) {
  field = svg.selectAll(".field")
    .data(fields)
    .enter().append("g")
    .attr("transform", function (d, i) {
      return "translate(80,100)";
    })
    .attr("class", "field")
    .on("click", function (d) {
      console.log("clicked!");
      if (!pauseme) {
        pauseme = true;
      } else {
        pauseme = false;
        setTimeout(function () {
          update(field, path, label);
        }, 1000);
      }
    });
  field.append("path")
    .attr("class", "path path--background")
    .attr("d", arc);

  if (status === "pomo") {
    d3v3.select(".break--foreground").classed("path--foreground", true);
    d3v3.select(".break--foreground").classed("break--foreground", false);
    path = field.append("path")
      .attr("class", "path path--foreground")
  } else {
    path = field.append("path")
      .attr("class", "break--foreground")
    d3v3.select(".path--foreground").classed("break--foreground", true);
    d3v3.select(".path--foreground").classed("path--foreground", false);
    //    path = field.append("path")
    //      .attr("class", "path break--foreground")
  }

  label = field.append("text")
    .attr("class", "label")
    .attr("dy", ".35em");
}



d3v3.select(".startimer").on("click", (d) => {
  createChart();
  update(field, path, label);
});

function getExactTime(seconds) {
  mins = Math.floor(seconds / 60);
  secs = seconds % 60
  return [mins, secs];
}

function update(field, path, label) {
  let now = new Date();
  countsecs--;
  if (countsecs < 0) {
    if (totalpomos > elapsedPomos) {
      if (status === "pomo") {
        pomoend.play();
        elapsedPomos++;
        status = "break";
        countsecs = breakmins * 60;
        fields[0].value = countsecs
        fields[0].size = countsecs
        createClock(fields);
        update(field, path, label);
      } else {
        status = "pomo";
        breakend.play();
        countsecs = countmins * 60;
        fields[0].value = countsecs;
        fields[0].size = countsecs;
        createClock(fields);
        update(field, path, label);
      }
    } else {
      $('#submitdata').click();
      console.log("session finished!");
      location.reload(true);
    }
  } else {
    field
      .each(function (d) {
        d.previous = d.value, d.value = d.update(countsecs);
      });

    path.transition()
      .attrTween("d", arcTween);

    label
      .text(function (d) {
        if (countsecs < 60) {
          d3v3.select("#headlabel").html(countsecs + "s");
          return countsecs + "s";
        } else {
          timevalues = getExactTime(countsecs);
          minutes = timevalues[0];
          seconds = (timevalues[1] >= 10 ? timevalues[1] : "0" + timevalues[1]);
          d3v3.select("#headlabel").html(minutes + " : " + seconds);
          return minutes + " : " + seconds;
        }
      });
    if (!pauseme) {
      setTimeout(function () {
        update(field, path, label);
      }, 1000 - (now % 1000));
    }
  }

};

function arcTween(b) {
  var i = d3v3.interpolate(b, {
    value: b.previous - 1
  });
  return function (t) {
    return arc(i(t));
  };
}