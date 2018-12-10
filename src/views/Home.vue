<template>
  <div style="margin-top:10px">
    <div class="row">
      <div class="col-6">
        <form class="mb-3" onkeypress="return event.keyCode != 13;">
          <fieldset>
            <div class="row textrow">
              <div class="col-7">
                <div class="form-group">
                  <textarea
                    v-model="pomo.comment"
                    class="form-control"
                    id="comment"
                    rows="2"
                    placeholder="What are you working on?"
                  ></textarea>
                </div>
              </div>
              <div class="col-4">
                <input
                  v-model="pomo.tag"
                  class="form-control"
                  id="tags"
                  placeholder="Which project?"
                >
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-7">
                <h6 style="font-weight:bolder">Pick study/break time ratio</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-10">
                <div id="pomotimediv" class="pomodiv">
                  <label class="blue">
                    <input type="radio" v-model="pomo.pomotime" class="form-control" value=".1">
                    <span>25/5</span>
                  </label>
                  <label class="blue">
                    <input type="radio" v-model="pomo.pomotime" class="form-control" value="32">
                    <span>32/8</span>
                  </label>
                  <label class="blue">
                    <input type="radio" v-model="pomo.pomotime" class="form-control" value="40">
                    <span>40/10</span>
                  </label>
                  <label class="blue">
                    <input type="radio" v-model="pomo.pomotime" class="form-control" value="50">
                    <span>50/10</span>
                  </label>
                </div>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-7">
                <h6 style="font-weight:bolder">Pick number of pomos</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-10">
                <div id="pomocountdiv" class="pomodiv">
                  <label class="blue">
                    <input type="radio" v-model="pomo.pomocount" class="form-control" value="1">
                    <span>1</span>
                  </label>
                  <label class="blue">
                    <input type="radio" v-model="pomo.pomocount" class="form-control" value="2">
                    <span>2</span>
                  </label>
                  <label class="blue">
                    <input type="radio" v-model="pomo.pomocount" class="form-control" value="3">
                    <span>3</span>
                  </label>
                  <label class="blue">
                    <input type="radio" v-model="pomo.pomocount" class="form-control" value="4">
                    <span>4</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="row submitrow">
              <button
                id="submitdata"
                type="submit"
                @click="addPomo()"
                class="btn btn-primary hidden"
              >Submit</button>
            </div>
          </fieldset>
        </form>
        <div class="col-7" style="text-align:center">
          <button @click="beginTimer()" class="btn btn-primary startimer">Start Timer</button>
          <button class="btn btn-primary restart hidden">Restart</button>
        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div id="countdiv1" class="col-5">
            <div id="countdown" style="margin-top:100px"></div>
          </div>
          <div class="col-1">
            <h2 id="pomocounter"></h2>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-6 d3chart">
        <div id="chart"></div>
      </div>
      <div class="col-3 d3chart">
        <div id="calendar">
          <svg class="calsvg"></svg>
        </div>
      </div>
      <div class="col-3 d3chart">
        <div id="pie"></div>
      </div>
    </div>
    <br>
    <div class="flex-container">
      <div
        class="card border-success mb-3"
        style="max-width: 10rem;"
        v-for="(pomo, index) in dailyPomos"
        :key="pomo.date"
        v-bind:pomo="pomo"
      >
        <div class="card-header">
          {{ pomo.date }}
          <span class="highpomo" v-if="pomo.pomocount>=5">{{pomo.pomocount}}</span>
          <span class="lowpomo" v-else>{{pomo.pomocount}}</span>
        </div>
        <div class="card-body">
          <ul>
            <strong>Worked On:</strong>
            <li
              class="tasktext"
              v-for="(comment) in pomo.comments"
              v-bind:key="comment"
            >{{ comment }}</li>
          </ul>
        </div>
        <!-- <button @click="removePomo(pomo, index)" type="submit" class="btn btn-danger">Remove</button> -->
      </div>
    </div>
  </div>
</template>

<style>
.textrow {
  margin-left: 20px;
  margin-right: 150px;
}
div.col-10 {
  margin: auto;
}
#comment {
  width: auto;
}
#tags {
  height: 33px;
  font-size: medium;
}
fieldset {
  text-align: center;
}
#calendar {
  display: inline-block;
  position: relative;
  width: 100%;
  vertical-align: top;
}
.calsvg {
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 0;
}
</style>

<script>
// @ is an alias to /src
// <!--import pomolist from '@/components/pomolist.vue'; -->
import * as d3 from "d3";
import * as c3 from "c3";
import db from "@/firebase/init";
import { linechartBuilder } from "@/scripts/pomolinechart.js";
import { clockBuilder } from "@/scripts/d3countdown.js";
import { piechartBuilder } from "@/scripts/pomograph.js";
import firebase from "firebase";

const API = "http://localhost:9999/pomotimer";
const temparr = [];
const linechart = new linechartBuilder();
const piechart = new piechartBuilder();
const clockChart = new clockBuilder();
export default {
  name: "home",
  data: () => ({
    pomos: [],
    pomo: {
      created: new Date().toString(),
      comment: "",
      pomocount: 1,
      pomotime: 32,
      tag: "",
      userid: null
    },
    //fullarray: [],
    mydata: [],
    user: null
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
      return temparr;
    }
  },
  created() {
    let ref = db.collection("users");

    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.user = doc.data();
          this.user.id = doc.id;
        });
      });
  },
  mounted() {
    const form = document.querySelector("form");
    form.addEventListener("submit", e => {
      e.preventDefault();
    });

    let currentid;
    let ref = db.collection("users");
    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          currentid = doc.id;
          db.collection("pomos")
            .where("userid", "==", currentid)
            .onSnapshot(res => {
              res.docChanges().forEach(change => {
                const doc = { ...change.doc.data(), id: change.doc.id };
                if (change.type == "added") {
                  this.mydata.push(doc);
                }
                if (change.type == "removed") {
                  this.mydata = this.mydata.filter(item => item.id !== doc.id);
                }
              });
              this.update();
            });
        });
      });
    this.chart = c3.generate({
      bindto: "#chart",
      title: {
        text: "Pomo sessions over time"
      },
      data: {
        x: "x",
        columns: [],
        type: "bar",
        groups: [],
        order: null
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: "%m/%d"
          },
          label: {
            text: "Date",
            position: "outer-center"
          }
        },
        y: {
          tick: {
            fit: true,
            values: [2, 4, 6, 8, 10, 12]
          },
          label: {
            text: "Number of pomos",
            position: "outer-center"
          }
        }
      },
      grid: {
        y: {
          lines: [
            {
              value: 4
            }
          ]
        }
      },
      leged: {
        position: "right"
      }
    });

    this.piechart = c3.generate({
      bindto: "#pie",
      data: {
        columns: [],
        type: "donut",
        onclick: function(d, i) {
          console.log("onclick", d, i);
        }
      },
      donut: {
        title: "% Pomo across goals"
      },
      legend: {
        position: "right"
      },
      color: {
        pattern: [
          "maroon",
          "steelblue",
          "#ff7f0e",
          "#ffbb78",
          "#2ca02c",
          "#98df8a",
          "#d62728",
          "#ff9896",
          "#9467bd",
          "#c5b0d5",
          "#8c564b",
          "#c49c94",
          "#e377c2",
          "#f7b6d2",
          "#7f7f7f",
          "#c7c7c7",
          "#bcbd22",
          "#dbdb8d",
          "#17becf",
          "#9edae5"
        ]
      }
    });
  },
  components: {},
  methods: {
    update() {
      const tagarray = [];
      let tags = [];
      this.mydata.forEach(d => {
        d.created = new Date(d["created"]).toLocaleDateString();
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
      this.pomos.forEach(d => {
        tags.push(d.tag);
      });

      let tagcount = _.countBy(tags);

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
        variables[`data${i}`] = [`session${i + 1}`].concat(
          variables[`data${i}`]
        );
        vararray.push(variables[`data${i}`]);
      }
      const datearr = ["x"].concat(dates);
      const fullarray = [datearr].concat(vararray);

      let pomogroup = [];
      for (let i = 1; i < fullarray.length; i++) {
        pomogroup.push("session" + i);
      }
      for (let key of Object.keys(tagcount)) {
        let temparr = [];
        temparr.push(key);
        temparr.push(tagcount[key]);
        tagarray.push(temparr);
      }

      this.chart.load({
        columns: fullarray
      });

      this.chart.groups([pomogroup]);
      this.piechart.flow({
        columns: tagarray,
        duration: 500
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
      console.log();
      let myprojects = [];
      this.pomos.forEach(d => {
        if (!_.includes(myprojects, d.tag)) {
          myprojects.push(d.tag);
        }
      });

      let options = {
        data: myprojects,
        list: {
          match: {
            enabled: true
          }
        }
      };

      $("#tags").easyAutocomplete(options);

      // for (let key of Object.keys(tagcount)) {
      //   let tempobj = { name: key, cost: tagcount[key] };
      //   tagarray.push(tempobj);
      // }
      linechart.createChart(temparr);
      //piechart.createChart(tagarray);
    },
    beginTimer() {
      clockChart.createChart();
    },
    addPomo() {
      this.pomo.userid = this.user.id;
      db.collection("pomos")
        .add(this.pomo)
        .then(function(docRef) {
          console.log("Document successfully written with ID " + docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    },
    removePomo(pomo, key) {
      const actualkey = this.pomos.length - 1 - key;
      this.pomos.splice(actualkey, 1);
      fetch(API, {
        method: "DELETE",
        body: JSON.stringify(pomo),
        headers: {
          "content-type": "application/json"
        }
      })
        .then(response => response.json())
        .then(result => {});
    },
    updatePomo(pomo) {
      fetch(API, {
        method: "PUT",
        body: JSON.stringify(pomo),
        headers: {
          "content-type": "application/json"
        }
      })
        .then(response => response.json())
        .then(result => {});
    },
    getCategory() {}
  }
};
</script>
