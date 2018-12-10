<template>
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd;">
    <a class="navbar-brand" href="#">Pomify</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarTogglerDemo01"
      aria-controls="navbarTogglerDemo01"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
        <li v-if="!user" class="nav-item active">
          <router-link class="nav-link" :to="{ name: 'Signup' }">Signup</router-link>
        </li>
        <li v-if="!user" class="nav-item active">
          <router-link class="nav-link" :to="{ name: 'Login' }">Login</router-link>
        </li>
        <li class="nav-item" v-if="user">
          <a class="nav-link">{{ user.email }}</a>
        </li>
        <li class="nav-item" v-if="user">
          <a class="nav-link" @click="logout">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Navbar",
  data() {
    return {
      user: null
    };
  },
  created() {
    // let user = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    }
  },
  mounted() {}
};
</script>

<style>
.navbar-brand {
  font-size: 32px;
}
.nav-link {
  font-size: 16px;
}
</style>

