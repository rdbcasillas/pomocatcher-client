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
        <mypomo msg="Pomo list"/>
        <div class="card text-white bg-success mb-3" v-for="(pomo, index) in latestPomos" 
                                                     :key="pomo._id" style="max-width: 20rem;">
            <div class="card-header"> {{ pomo.username }}</div>
            <button @click="removePomo(pomo, index)" type="button" class="btn btn-danger">Remove</button>
            <div class="card-body">
                <h4 class="card-title"> Total pomos: {{ pomo.pomocount }}</h4>
                <p class="card-text"> {{ pomo.comment }}</p>
                <p class="card-text"> {{ pomo.created }}</p>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import mypomo from '@/components/mypomo.vue';

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
            });
    },
    components: {
        mypomo,
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
            let actualkey = this.pomos.length - 1 - key;
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
    },
};
</script>
