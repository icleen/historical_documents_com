<template>
  <div>
    <div v-for="item in doclist" class="item" v-on:click="showInfo(item)">
      <p class="docs"><b>Title:</b> {{item.title}}</p>
      <p class="docs"><b>Type:</b> {{item.doctype}}</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'DocList',
  props: ['doclist'],
  filters: {
    since: function(datetime) {
      moment.locale('en', {
        relativeTime: {
          future: 'in %s',
          past: '%s',
          s:  'seconds',
          ss: '%ss',
          m:  '1m',
          mm: '%dm',
          h:  'h',
          hh: '%dh',
          d:  'd',
          dd: '%dd',
          M:  ' month',
          MM: '%dM',
          y:  'a year',
          yy: '%dY'
        }
      });
      return moment(datetime).fromNow();
    },
  },
  methods: {
    showInfo: function(item) {
      this.$store.commit('setViewDoc',  item);
    },
  }
}
</script>

<style scoped>
 .item {
     border-bottom: 1px solid #ddd;
     padding: 10px;
 }
 .docs {
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
