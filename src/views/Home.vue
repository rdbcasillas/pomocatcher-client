<template>
	<div>
		<form @submit.prevent="addPomo" class="mb-3">
			<fieldset>
				<div class="row">
					<div class="col-2">
						<div class="form-group">
							<input v-model="pomo.username" type="text" class="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter username">
						</div>
					</div>
					<div class="col-4">
						<div class="form-group">
							<textarea v-model="pomo.comment" class="form-control" id="comment" rows="1" placeholder="What are you working on?"></textarea>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-2">
						<input type="number" v-model="pomo.pomocount" id="pomocount" class="form-control pomonum" placeholder="How many pomos?" />
						<input type="number" v-model="pomo.pomotime" class="form-control seconds" placeholder="Enter pomo length in minut" />
					</div>
				</div>
				<button id="submitdata" type="submit" class="btn btn-primary hidden">Submit</button>
			</fieldset>
		</form>
		<div class="row">
		<div class="col-1">
			<button class="btn btn-primary startimer">
			Start Timer
			</button>
			<button class="btn btn-primary restart hidden">
			Restart
			</button>
		</div>
			<div id="countdiv1" class="col-2">
				<div id="countdown"></div>
			</div>
			<div id="countdiv2" class="col-2 hidden">
				<div id="countdown2"></div>
			</div>
			<div class="col-1">
				<h2 id="pomocounter"></h2>
			</div>
		</div>
		<br>
		<div class="row">
			<div class="col-6">
				<div ref="chart">
				</div>
			</div>
		</div>
		<!-- <pomolist v-for="(pomo, index) in latestPomos" :key="pomo._id" v-bind:pomo="pomo"/> -->
		<br>
		<div class="flex-container">
		<div class="pomocard" v-for="(pomo, index) in latestPomos" :key="pomo._id" v-bind:pomo="pomo">
		<div class="card border-success mb-3" style="max-width: 10rem;" >
			<div class="card-header">  {{ pomo.created }}</div>
			<div class="card-body">
				<p class="card-text"> {{ pomo.comment }}</p>
				<p class="card-text"> {{ pomo.pomocount }}</p>
			</div>
			<button @click="removePomo(pomo, index)" type="button" class="btn btn-danger">Remove</button>
		</div>
		</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
// <!--import pomolist from '@/components/pomolist.vue'; -->
import * as d3 from 'd3';
import * as c3 from 'c3';
//import { barchartBuilder } from '@/pomograph.js';
//import { linechartBuilder } from '@/pomolinechart.js';

const API = 'http://localhost:9999/pomotimer';

export default {
  name: 'home',
  data: () => ({
    pomos: [],
    pomo: {
      username: '',
      comment: '',
      pomotime: 30,
    },
    fullarray: [],
  }),
  computed: {
    latestPomos() {
      return this.pomos.slice().reverse();
    },
  },
  mounted() {
    fetch(API)
      .then(response => response.json())
      .then(result => {
        this.pomos = result;
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          Edit Pomo
        </button>;
        let groupdata = d3
          .nest()
          .key(d => d.created)
          .entries(this.pomos);
        const d3parse = d3.isoParse;
        let dates = groupdata.map(d => d3parse(d.key));
        let pomolist = groupdata.map(d => d.values);

        // pomolist.forEach(function(pomo) {
        //   this.count += +d.pomocount;
        // });
        let maxlen = 0;
        pomolist.forEach(function(d) {
          let currlen = d.length;
          if (currlen > maxlen) {
            maxlen = currlen;
          }
        });
        console.log(this.latestPomos);
        //this.mystr = 'timothy';
        let variables = {};
        let vararray = [];
        for (let i = 0; i <= maxlen - 1; i++) {
          variables[`data${i}`] = pomolist.map(d => {
            if (d[i]) {
              return Number(d[i].pomocount);
            }
            return 0;
          });
          variables[`data${i}`] = [`session${i + 1}`].concat(variables[`data${i}`]);
          vararray.push(variables[`data${i}`]);
        }
        let datearr = ['x'].concat(dates);
        this.fullarray = [datearr].concat(vararray);
        const chart = c3.generate({
          bindto: this.$refs.chart,
          data: {
            x: 'x',
            columns: this.fullarray,
            type: 'bar',
            groups: [['session1', 'session2', 'session3', 'session4']],
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%m/%d',
              },
              label: {
                text: 'Date',
                position: 'outer-center',
              },
            },
            y: {
              tick: {
                fit: false,
                values: [1, 2, 3, 4, 5, 6, 7, 8],
              },
              label: {
                text: 'Number of pomos',
                position: 'outer-center',
              },
            },
          },
          grid: {
            y: {
              lines: [
                {
                  value: 0,
                },
              ],
            },
          },
          legend: {
            position: 'right',
          },
        });

        //const barchart = new barchartBuilder();
        //barchart.createChart(this.pomos);
        //const linechart = new linechartBuilder();
        //linechart.createChart(this.pomos);
      });
  },
  components: {
    // pomolist,
  },
  methods: {
    addPomo() {
      fetch(API, {
        method: 'POST',
        body: JSON.stringify(this.pomo),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {
          this.pomos.push(result);
        });
    },
    removePomo(pomo, key) {
      const actualkey = this.pomos.length - 1 - key;
      this.pomos.splice(actualkey, 1);
      fetch(API, {
        method: 'DELETE',
        body: JSON.stringify(pomo),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {
          console.log(result);
        });
    },
    updatePomo(pomo) {
      console.log(pomo);
      fetch(API, {
        method: 'PUT',
        body: JSON.stringify(pomo),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {
          console.log(result);
        });
    },
  },
};
</script>
