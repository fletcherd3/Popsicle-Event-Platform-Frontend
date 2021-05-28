<template>
  <div id="app">
    <NavBar :isAuthenticated="isAuthenticated" @logout="logout" class="mb-5"/>
    <router-view :isAuthenticated="isAuthenticated" :userId="userId" @login="login" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";

export default {
  name: 'App',
  components: {
    NavBar
  },
  data() {
    return {
      token: localStorage.getItem('token'),
      userId: parseInt(localStorage.getItem('id'), 10),
      isAuthenticated: localStorage.getItem('token') != null
    }
  },
  methods: {
    login(token, id) {
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      this.token = token;
      this.userId = id;
      this.isAuthenticated = true;
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      this.userId = null;
      this.token = null;
      this.isAuthenticated = false;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
.logo {
  width: 50%;
}
.btn {
  margin-top: 100px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #007bff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>