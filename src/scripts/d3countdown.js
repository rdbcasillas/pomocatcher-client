import * as d3 from 'd3';

function clockBuilder() {

  const pomoend = document.getElementById('pomoend');
  const breakend = document.getElementById('breakend');
  let elapsedPomos = 0,
    pomocounter,
    countmins,
    countsecs,
    pauseme,
    fields,
    field,
    path,
    label,
    label2,
    arc,
    totalpomos,
    width = 300,
    height = 300,
    status = 'pomo';
  let breakmins;
  let svg;
  const timeObj = {
    .1: .1,
    32: 8,
    40: 10,
    50: 10,
  };

  this.createChart = function () {
    svg = d3.select('#countdown').append('svg');
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'svgclock');

    const selected2 = $("#pomocountdiv input[type='radio']:checked");
    if (selected2.length > 0) {
      totalpomos = Number(selected2.val());
    }
    const selected = $("#pomotimediv input[type='radio']:checked");
    if (selected.length > 0) {
      countmins = Number(selected.val());
    }
    pomocounter = elapsedPomos + "/" + totalpomos;
    breakmins = timeObj[countmins];
    countsecs = countmins * 60;
    pauseme = false;
    fields = [{
      value: countsecs,
      size: countsecs,
      label: 'm',
      update(countsecs) {
        return countsecs;
      },
    }];

    arc = d3v3.svg.arc()
      .innerRadius(width / 3 - 20)
      .outerRadius(width / 3 - 5)
      .startAngle(0)
      .endAngle(d => (d.value / d.size) * 2 * Math.PI);

    createClock(fields);
  }

  function createClock(fields) {
    field = svg.selectAll('.field')
      .data(fields)
      .enter().append('g')
      .attr('transform', (d, i) => 'translate(120,100)')
      .attr('class', 'field')
      .on('click', (d) => {
        console.log('clicked!');
        if (!pauseme) {
          pauseme = true;
        } else {
          pauseme = false;
          setTimeout(() => {
            update(field, path, label);
          }, 1000);
        }
      });
    field.append('path')
      .attr('class', 'path path--background')
      .attr('d', arc);

    if (status === 'pomo') {
      d3v3.select('.break--foreground').classed('path--foreground', true);
      d3v3.select('.break--foreground').classed('break--foreground', false);
      path = field.append('path')
        .attr('class', 'path path--foreground');
    } else {
      path = field.append('path')
        .attr('class', 'break--foreground');
      d3v3.select('.path--foreground').classed('break--foreground', true);
      d3v3.select('.path--foreground').classed('path--foreground', false);
    }

    label = field.append('text')
      .attr('class', 'label')
      .attr('dy', '.35em');

    label2 = field.append('text')
      .attr('class', 'label2')
      .attr('dy', '2.85em')
      .style('font-size', '12px')
      .text(elapsedPomos + " / " + totalpomos);

    if (elapsedPomos == 0) {

      update(field, path, label);

    }
  }


  // d3v3.select('.startimer').on('click', (d) => {
  //   console.log("timer was cclicked");
  //   createChart();
  //   update(field, path, label);
  // });

  function getExactTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return [mins, secs];
  }

  function update(field, path, label) {
    const now = new Date();
    countsecs--;
    if (countsecs < 0) {
      if (totalpomos > elapsedPomos) {
        if (status === 'pomo') {
          elapsedPomos++;
          d3v3.select('.label2')
            .text(elapsedPomos + " / " + totalpomos);
          pomoend.play();
          status = 'break';
          countsecs = breakmins * 60;
          fields[0].value = countsecs;
          fields[0].size = countsecs;
          createClock(fields);
          update(field, path, label);
        } else {
          d3v3.select('.label2')
            .text(elapsedPomos + " / " + totalpomos);
          status = 'pomo';
          breakend.play();
          countsecs = countmins * 60;
          fields[0].value = countsecs;
          fields[0].size = countsecs;
          createClock(fields);
          update(field, path, label);
        }
      } else {
        $('#submitdata').click();
        d3v3.select('.svgclock').remove();
        elapsedPomos = 0;
        status = 'pomo'
        console.log('session finished!');
      }
    } else {
      field
        .each((d) => {
          d.previous = d.value, d.value = d.update(countsecs);
        });

      path.transition()
        .attrTween('d', arcTween);

      label
        .text((d) => {
          if (countsecs < 60) {
            d3v3.select('#headlabel').html(`${countsecs}s`);
            return `${countsecs}s`;
          }
          let timevalues = getExactTime(countsecs);
          let minutes = timevalues[0];
          let seconds = (timevalues[1] >= 10 ? timevalues[1] : `0${timevalues[1]}`);
          d3v3.select('#headlabel').html(`${minutes} : ${seconds}`);
          return `${minutes} : ${seconds}`;
        });
      if (!pauseme) {
        setTimeout(() => {
          update(field, path, label);
        }, 1000 - (now % 1000));
      }
    }
  }

  function arcTween(b) {
    const i = d3v3.interpolate(b, {
      value: b.previous - 1,
    });
    return function (t) {
      return arc(i(t));
    };
  }
};

export {
  clockBuilder
};