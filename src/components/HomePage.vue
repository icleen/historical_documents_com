<template>
  <div>
    <div v-if="loggedIn">
      <user-page/>
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
 import WelcomePage from './WelcomePage';
 import UserPage from './UserPage';
 export default {
   name: 'HomePage',
   components: {WelcomePage, UserPage},
   computed: {
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
   },
 }
</script>

<style scoped>
</style>
