<template>
  <div class="docs">
    <div class="left">
      <div class="buttonWrap">
        <button class="primary" v-on:click="upload()">Upload Document</button>
      </div>
      <doc-list v-bind:doclist="docs"/>
    </div>
    <div class="right">
      <view-doc v-bind:isChild="true"/>
    </div>
  </div>
</template>

<script>
import DocList from './DocList';
import ViewDoc from './ViewDoc';
import moment from 'moment';
export default {
  name: 'UserPage',
  components: { DocList, ViewDoc },
  data () {
    return {
      title: '',
      doctype: '',
      comments: '',
    }
  },
  created: function() {
    this.$store.dispatch('getUserDocs');
  },
  computed: {
    docs: function() {
      return this.$store.getters.userdocs;
    },
  },
  methods: {
    upload: function() {
      this.$store.commit('setViewDoc',  '');
      this.$router.push({ path: '/docload'});
    },
  }
}
</script>

<style scoped>
.docs {
  display: grid;
	grid-template-columns: 1fr 1fr;
}

.left {
  width: 60%;
}

.right {
  display: inline-block;
  width: 40%;
}

.docForm {
  background: #eee;
  padding: 10px;
  margin-bottom: 10px;
}
.buttonWrap {
  width: 100%;
  display: flex;
}
button {
  margin-left: auto;
  height: 2em;
  font-size: 0.9em;
}
textarea {
  width: 100%;
  height: 5em;
  padding: 2px;
  margin-bottom: 5px;
  resize: none;
  box-sizing: border-box;
}
.item {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}
.tweet {
  margin-top: 0px;
}
.idline {
  margin-bottom: 0px;
}
.user {
  font-weight: bold;
  margin-right: 10px;
}
.handle {
  margin-right: 10px;
  color: #666;
}
.time {
  float: right;
  color: #666;
}
</style>
