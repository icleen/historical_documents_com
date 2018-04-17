<template>
  <div class="viewdoc" v-show="doc !== ''">
    <img :src="getpath(doc.filepath)" />
    <p><b>Title:</b> {{doc.title}}</p>
    <p><b>Type:</b> {{doc.doctype}}</p>
    <p><b>Comments:</b> {{doc.comments}}</p>
    <button class="primary" v-on:click="edit()" v-show="isChild">View</button>
    <!--<div>
      <p><b>Title:</b> {{doc.title}}</p>
      <button class="primary" v-on:click="edit('title')">Edit</button>
    </div>
    <div>
      <p><b>Type:</b> {{doc.doctype}}</p>
      <button class="primary" v-on:click="edit('type')">Edit</button>
    </div>
    <div>
      <p><b>Comments:</b> {{doc.comments}}</p>
      <button class="primary" v-on:click="edit('comments')">Edit</button>
    </div> -->
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'ViewDoc',
  props: ['isChild'],
  computed: {
    doc: function() {
      return this.$store.getters.viewdoc;
    },
  },
  methods: {
    getpath: function(filepath) {
      return filepath;
    },
    edit: function() {
      this.$router.push({ path: '/docviewer' });
    },
  }
}
</script>

<style scoped>
.viewdoc {
  display: inline-block;
}
.viewdoc > img {
  width: 100%;
}
</style>
