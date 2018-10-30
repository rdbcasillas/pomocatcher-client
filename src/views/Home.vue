<template>
	<div>
		<button @click="togglePomoForm = !togglePomoForm" type="button" class="btn btn-outline-primary mt-3 mb-3">Toggle Pomo Info Form</button>
		<form v-if="togglePomoForm" @submit.prevent="addPomo" class="mb-3">
			<fieldset>
				<legend>Add pomo info</legend>
				<div class="form-group">
					<label for="username">Username</label>
					<input v-model="pomo.username" type="text" class="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter username">
				</div>
				<div class="form-group">
					<label for="pomocount">How many pomos</label>
					<select v-model="pomo.pomocount" class="form-control" id="pomocount">
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
					</select>
				</div>
				<div class="form-group">
					<label for="comment">Any comments/concerns on your effort?</label>
					<textarea v-model="pomo.comment" class="form-control" id="comment" rows="3"></textarea>
				</div>
				<button type="submit" class="btn btn-primary">Submit</button>
			</fieldset>
		</form>
		<div class="row">
			<div class="col-3">
			<input type="number" class="form-control pomonum" placeholder="How many pomos?"/>
			<input type="number" class="form-control seconds" placeholder="Enter pomo length in minutes"/>
			</div>
			<div class="col-3">
			<button class="btn btn-primary startimer">
			Start Timer
			</button>
			<button class="btn btn-primary restart hidden">
		 	Restart
			</button>
			</div>
			<div class="col-3">
			<div id="countdown"></div>
			</div>
			<div class="col-3">
			<div id="countdown2"></div>
			</div>
		</div>
		<!-- <pomolist v-for="(pomo, index) in latestPomos" :key="pomo._id" v-bind:pomo="pomo"/> -->
		<div class="card text-white bg-success mb-3" style="max-width: 20rem;"  v-for="(pomo, index) in latestPomos" :key="pomo._id" v-bind:pomo="pomo">
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
						<textarea v-model="pomo.pomocount" class="form-control" id="pomocount" rows="1"></textarea>
					 	Add or Update comment!
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
	</div>

</template>

<script>
// @ is an alias to /src
// <!--import pomolist from '@/components/pomolist.vue'; -->

const API = 'http://localhost:9999/pomotimer';

export default {
  name: 'home',
  data: () => ({
    togglePomoForm: false,
    pomos: [],
    pomo: {
      username: 'Anonymous',
      pomocount: 1,
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
      .then((result) => {
        this.pomos = result;
			<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
				Edit Pomo
			</button>;
      });
  },
  components: {
    // pomolist,
  },
  methods: {
    addPomo() {
      console.log(this.pomo);
      fetch(API, {
        method: 'POST',
        body: JSON.stringify(this.pomo),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then((result) => {
          this.togglePomoForm = false;
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
        .then((result) => {
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
        .then((result) => {
          console.log(result);
        });
    },
  },
};
</script>
