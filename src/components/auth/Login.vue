<template>
  <div class="login container">
    <form class="card-panel" @submit.prevent="login">
      <h2 class="center teal-text">Login</h2>
      <div class="input-field">
        <input id="email" type="email" v-model="email">
        <label for="email">Email</label>
      </div>
      <div class="input-field">
        <input id="password" type="password" v-model="password">
        <label for="password">Password</label>
      </div>
      <p v-if="feedback" class="red-text center">{{ feedback }}</p>
      <div class="field center">
        <button class="btn deep-blue">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        this.feedback = null;
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            //console.log(user)
            this.$router.push({ name: "home" });
          })
          .catch(err => {
            this.feedback = err.message;
          });
      } else {
        this.feedback = "Please fill in both fields";
      }
    }
  }
};
</script>

<style>
.login {
  max-width: 400px !important;
  margin-top: 60px !important;
}
.login h2 {
  font-size: 2.4em !important;
}
.login .field {
  margin-bottom: 16px !important;
}
</style>
<style scoped src="@/assets/materialize.min.css">
</style>