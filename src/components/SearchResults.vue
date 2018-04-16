<template>
  <div class="docs">
    <h1>Search Results</h1>
    <p>Searched for {{keywords}}</p>
    <doc-list v-bind:doclist="doclist"/>
  </div>
</template>

<script>
 import DocList from './DocList';
 export default {
   name: 'SearchResults',
   components: { DocList },
   created: function() {
     this.$store.dispatch('doSearch',this.$route.query.keywords);
   },
   computed: {
     keywords: function() {
       return this.$route.query.keywords;
     }
   },
   watch: {
     '$route.query.keywords'() {
       this.$store.dispatch('doSearch',this.$route.query.keywords);
     }
   },
 }
</script>
