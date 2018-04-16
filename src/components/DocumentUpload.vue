<template>
  <div>
    <form v-on:submit.prevent="upload" class="docForm" enctype="multipart/form-data">
      <picture-input
        ref="pictureInput"
        :width="500"
        :removable="true"
        removeButtonClass="ui red button"
        :height="500"
        accept="image/jpeg, image/png, image/gif"
        buttonClass="ui button primary"
        :customStrings="{
        upload: '<h1>Upload it!</h1>',
        drag: 'Drag and drop your document here'}">
        </picture-input>
      <textarea v-model="title" placeholder="Untitled"/><br/>
      <textarea v-model="doctype" placeholder="e.g. journal, census, will"/><br/>
      <textarea v-model="comments" placeholder="Comments"/><br/>
      <div class="buttonWrap">
        <button class="primary" v-on:click="cancel()">Cancel</button>
        <button class="primary" type="submit">Upload</button>
      </div>
    </form>
  </div>
</template>

<script>
import moment from 'moment';
import PictureInput from 'vue-picture-input';

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  name: 'DocumentUpload',
  data () {
    return {
      title: '',
      doctype: '',
      comments: '',
      valid: true,
      uploadedFile: [],
    }
  },
  components: {
    PictureInput
  },
  created: function() {
  },
  computed: {
  },
  methods: {
    upload: function() {
      if (this.title === "") {
        //this.valid = false;
      }
      if (this.$refs.pictureInput.image) {
        console.log('Picture loaded.')
      }
      if (this.valid) {
        let formData = new FormData();
        formData.append('file', this.$refs.pictureInput.file);
        formData.append('title', this.title);
        formData.append('doctype', this.doctype);
        formData.append('comments', this.comments);
        this.$store.dispatch('addDoc',formData).then(document => {
          this.title = "";
          this.doctype = "";
          this.comments = "";
        });
      }else {
        this.title = "";
        this.doctype = "";
        this.comments = "";
      }
      this.$router.push({ path: '/'});
    },
    cancel: function() {
      this.valid = false;
    },
  },
}
</script>

<style scoped>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}

.docs {
  width: 600px;
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
