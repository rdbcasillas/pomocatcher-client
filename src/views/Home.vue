<template>
	<div>
		<form @submit.prevent="addPomo" class="mb-3">
			<fieldset>
				<div class="row">
					<div class="col-4">
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
					<div class="col-6">
						<input type="number" v-model="pomo.pomocount" id="pomocount" class="form-control pomonum" placeholder="How many pomos?" />
						<input type="number" class="form-control seconds" placeholder="Enter pomo length in minutes" />
					</div>
				</div>
				<button id="submitdata" type="submit" class="btn btn-primary hidden">Submit</button>
			</fieldset>
		</form>
		<div class="col-3">
			<button class="btn btn-primary startimer">
			Start Timer
			</button>
			<button class="btn btn-primary restart hidden">
			Restart
			</button>
		</div>
		<div class="row">
			<div class="col-3">
				<div id="countdown"></div>
			</div>
			<div class="col-3">
				<div id="countdown2"></div>
			</div>
		</div>
		<div class="row">
			<div class="col-4">
				<div class="container">
				</div>
			</div>
			<div class="col-4">
				<div class="container2">
				</div>
			</div>
			<div class="col-4">
				<div id="chart">
				</div>
			</div>
		</div>
		<!-- <pomolist v-for="(pomo, index) in latestPomos" :key="pomo._id" v-bind:pomo="pomo"/> -->
		<div class="card text-white bg-success mb-3" style="max-width: 20rem;" v-for="(pomo, index) in latestPomos" :key="pomo._id" v-bind:pomo="pomo">
			<!-- Modal -->
			<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 style="color:black" class="modal-title" id="exampleModalLabel">{{ pomo.username }}</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
						</div>
						<div style="color:black" class="modal-body">
							Update Pomo count!
							<textarea v-model="pomo.pomocount" class="form-control" id="pomocount" rows="1"></textarea> Add or Update comment!
							<textarea v-model="pomo.comment" class="form-control" id="comment" rows="2"></textarea>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
							<button @click="updatePomo(pomo)" data-dismiss="modal" type="button" class="btn btn-primary">Save changes</button>
						</div>
					</div>
				</div>
			</div>
			<!-- Modal Ends -->
			<div class="card-header"> {{ pomo.username }}</div>
			<div class="card-header"> Pomo Count: {{ pomo.pomocount }}</div>
			<button type="button" class="close" aria-label="Close"></button>
			<div class="card-body">
				<p class="card-text"> {{ pomo.comment }}</p>
				<p class="card-text"> {{ pomo.created }}</p>
			</div>
			<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
					Edit Pomo
				</button>
			<button @click="removePomo(pomo, index)" type="button" class="btn btn-danger">Remove</button>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
// <!--import pomolist from '@/components/pomolist.vue'; -->
import * as d3 from 'd3';
import * as c3 from 'c3';
import { barchartBuilder } from '@/pomograph.js';
import { linechartBuilder } from '@/pomolinechart.js';
console.log(c3);

const API = 'http://localhost:9999/pomotimer';

export default {
  name: 'home',
  data: () => ({
    pomos: [],
    pomo: {
      username: '',
      comment: '',
    },
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
          .key(function(d) {
            return d.created;
          })
          .entries(this.pomos);
        let d3parse = d3.isoParse;
        let dates = groupdata.map(function(d) {
          return d3parse(d.key);
        });

        let pomolist = groupdata.map(function(d) {
          return d.values;
        });
        let variables = {};
        let vararray = [];
        for (let i = 0; i <= 3; i++) {
          variables['data' + i] = pomolist.map(function(d) {
            if (d[i]) {
              return Number(d[i].pomocount);
            } else {
              return 0;
            }
          });
          variables['data' + i] = ['session' + (i + 1)].concat(variables['data' + i]);
          vararray.push(variables['data' + i]);
        }
        let datearr = ['x'].concat(dates);
        let fullarray = [datearr].concat(vararray);
        var chart = c3.generate({
          bindto: '#chart',
          data: {
            x: 'x',
            columns: fullarray,
            type: 'bar',
            groups: [['session1', 'session2', 'session3', 'session4', 'session5']],
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%Y/%m/%d',
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
        });

        let barchart = new barchartBuilder();
        barchart.createChart(this.pomos);
        let linechart = new linechartBuilder();
        linechart.createChart(this.pomos);
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
