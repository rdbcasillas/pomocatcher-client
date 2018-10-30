<template>
		<div class="card text-white bg-success mb-3" style="max-width: 20rem;">
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
					 	Add or Update comment!
						<textarea v-model="pomo.comment" class="form-control" id="comment" rows="3"></textarea>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
							<button @click="updatePomo(pomo)" data-dismiss="modal" type="button" class="btn btn-primary">Save changes</button>
						</div>
					</div>
				</div>
			</div>
			<div class="card-header"> {{ pomo.username }}</div>
			<button type="button" class="close" aria-label="Close"></button>
			<div class="card-body">
				<h4 class="card-title"> Total pomos: {{ pomo.pomocount }}</h4>
				<p class="card-text"> {{ pomo.comment }}</p>
				<p class="card-text"> {{ pomo.created }}</p>
			</div>
			<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
				Edit Pomo
			</button>
			<button @click="removePomo(pomo, index)" type="button" class="btn btn-danger">Remove</button>
		</div>
</template>

<script>
export default {
  name: 'pomolist',
  props: {
    pomo: Object,
  },
  methods: {
    removePomo,
  },
};
</script>

