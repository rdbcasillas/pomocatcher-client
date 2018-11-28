<template>
	<div>
		<form @submit.prevent="addPomo" class="mb-3">
			<fieldset>
				<div class="row">
				<div class="col-4">
						<div class="form-group">
							<textarea v-model="pomo.comment" class="form-control" id="comment" rows="3" placeholder="What are you working on?"></textarea>
						</div>
					</div>
				</div>
        <div class="row">
          <div class="col-3">
            <h6 style="font-weight:bolder">Pick study/break time ratio</h6>
          </div>
        </div>
				<div class="row">
					<div class="col-4">
            <div id="pomotimediv" class="pomodiv">
              <label class="blue"><input type="radio" v-model="pomo.pomotime" class="form-control" value="25"><span>25/5</span></label>
              <label class="blue"><input type="radio" v-model="pomo.pomotime" class="form-control" value="32"><span>32/8</span></label>
              <label class="blue"><input type="radio" v-model="pomo.pomotime" class="form-control" value="40"><span>40/10</span></label>
              <label class="blue"><input type="radio" v-model="pomo.pomotime" class="form-control" value="50"><span>50/10</span></label>
             </div>
					</div>
				</div>
        <hr>
        <div class="row">
          <div class="col-3">
            <h6 style="font-weight:bolder">Pick number of pomos</h6>
          </div>
        </div>
				<div class="row">
					<div class="col-4">
            <div id="pomocountdiv" class="pomodiv">
              <label class="blue"><input type="radio" v-model="pomo.pomocount" class="form-control" value="1"><span>1</span></label>
              <label class="blue"><input type="radio" v-model="pomo.pomocount" class="form-control" value="2"><span>2</span></label>
              <label class="blue"><input type="radio" v-model="pomo.pomocount" class="form-control" value="3"><span>3</span></label>
              <label class="blue"><input type="radio" v-model="pomo.pomocount" class="form-control" value="4"><span>4</span></label>
             </div>
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
			<button @click="addPomo()" class="btn btn-primary adddata">
			Add data
			</button>
			<button class="btn btn-primary restart hidden">
			Restart
			</button>
		</div>
			<div id="countdiv1" class="col-2">
				<div id="countdown"></div>
			</div>
			<div class="col-1">
				<h2 id="pomocounter"></h2>
			</div>
		</div>
		<br>
		<div class="row">
			<div class="col-6 d3chart">
				<div id="chart">
				</div>
			</div>
			<div class="col-6 d3chart">
				<div id="calendar">
          <svg class="calsvg">
          </svg>
				</div>
			</div>
		</div>
		<!-- <pomolist v-for="(pomo, index) in latestPomos" :key="pomo._id" v-bind:pomo="pomo"/> -->
		<br>
		<div class="flex-container">
		<div class="card border-success mb-3" style="max-width: 10rem;" v-for="(pomo, index) in dailyPomos" :key="pomo.date" v-bind:pomo="pomo">
			<div class="card-header">  {{ pomo.date }}
        <span class="highpomo" v-if="pomo.pomocount>=5">{{pomo.pomocount}}</span>
        <span class="lowpomo" v-else>{{pomo.pomocount}}</span>
        </div>
			<div class="card-body">
        <ul>
          <li v-for="(comment) in pomo.comments" v-bind:key="comment">{{ comment }}</li>
        </ul>
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
import { linechartBuilder } from '@/pomolinechart.js';

// const API = 'https://pomocatcher.herokuapp.com/pomotimer';
const API = 'http://localhost:9999/pomotimer';
//const mydata = [];
const temparr = [];
const linechart = new linechartBuilder();

export default {
  name: 'home',
  data: () => ({
    pomos: [],
    pomo: {
      created: new Date().toString(),
      comment: '',
      pomocount: 1,
      pomotime: 32,
    },
    fullarray: [],
    mydata: [],
  }),
  computed: {
    latestPomos() {
      return this.pomos.slice().reverse();
    },
    dailyPomos() {
      const temp = d3
        .nest()
        .key(d => d.created)
        .entries(this.pomos);
      const temparr = [];
      temp.forEach(d => {
        const tempobj = {};
        const values = d.values;
        tempobj.date = d.key;
        const totalcount = _.sumBy(values, o => +o.pomocount);
        const allcomms = _.keys(_.groupBy(values, o => o.comment));
        tempobj.pomocount = totalcount;
        tempobj.comments = allcomms;
        temparr.push(tempobj);
      });
      const reverse_tmparr = temparr.slice().reverse();
      return reverse_tmparr;
    },
  },
  mounted() {
    // db.collection('pomos')
    //   .get()
    //   .then(res => {
    //     let docs = res.docs;
    //     docs.forEach(doc => {
    //       mydata.push(doc.data());
    //       mydata.forEach(d => {
    //         d.created = new Date(d['created']).toLocaleDateString();
    //       });
    //     });
    //     this.update();
    //   });
    this.chart = c3.generate({
      bindto: '#chart',
      data: {
        x: 'x',
        columns: [],
        type: 'bar',
        groups: [['session1', 'session2', 'session3', 'session4']],
      },
      transition: {
        duration: 500,
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
      leged: {
        position: 'right',
      },
    });

    db.collection('pomos').onSnapshot(res => {
      res.docChanges().forEach(change => {
        const doc = { ...change.doc.data(), id: change.doc.id };
        console.log(doc);
        if (change.type == 'added') {
          this.mydata.push(doc);
          //this.yourdata.push(doc);
        }
        if (change.type == 'removed') {
          this.mydata = this.mydata.filter(item => item.id !== doc.id);
        }
      });
      this.update();
    });
  },
  components: {
    // pomolist,
  },
  methods: {
    update() {
      this.mydata.forEach(d => {
        d.created = new Date(d['created']).toLocaleDateString();
      });
      this.pomos = this.mydata;
      const groupdata = d3
        .nest()
        .key(d => d.created)
        .entries(this.pomos);
      const d3parse = d3.isoParse;
      const dates = groupdata.map(d => d3parse(d.key));
      const pomolist = groupdata.map(d => d.values);

      let maxlen = 0;
      pomolist.forEach(d => {
        const currlen = d.length;
        if (currlen > maxlen) {
          maxlen = currlen;
        }
      });
      const variables = {};
      const vararray = [];
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
      const datearr = ['x'].concat(dates);
      this.fullarray = [datearr].concat(vararray);
      console.log(chart);
      this.chart.load({
        columns: this.fullarray,
      });
      groupdata.forEach(d => {
        const tempobj = {};
        const values = d.values;
        tempobj.date = d.key;
        const totalcount = _.sumBy(values, o => +o.pomocount);
        const allcomms = _.keys(_.groupBy(values, o => o.comment));
        tempobj.pomocount = totalcount;
        tempobj.comments = allcomms;
        temparr.push(tempobj);
      });

      linechart.createChart(temparr);
    },
    addPomo() {
      db.collection('pomos')
        .add(this.pomo)
        .then(function(docRef) {
          console.log('Document successfully written with ID ' + docRef.id);
        })
        .catch(function(error) {
          console.error('Error adding document: ', error);
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
      fetch(API, {
        method: 'PUT',
        body: JSON.stringify(pomo),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {});
    },
  },
};
</script>
