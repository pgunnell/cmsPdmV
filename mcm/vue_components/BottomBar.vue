<template>
  <v-footer class="green" app>
    <span class="white--text" style="padding-left: 24px;">Multiple selection</span>
    <v-spacer></v-spacer>
    <span class="white--text">{{$store.getters.resultspair}}</span>
    <error-display></error-display>
    <v-spacer></v-spacer>
    <span class="white--text">
      <pagination></pagination>
      <!-- <v-pagination :length="1" v-on:next="next" v-on:previous="previous"></v-pagination> -->
      <!-- TO-DO: should we do custom pagination with all in page -1? -->
    </span>
  </v-footer>
</template>

<script>
  import Pagination from './Pagination.vue'
  import ErrorSnack from './ErrorSnackbar.vue'

  export default {
    name: 'bottombar',
    components: {
      'pagination': Pagination,
      'error-display': ErrorSnack,
    },
    methods: {
      next() {
        console.log("next event");
        this.$store.dispatch("CHANGE_PAGE", 1).then(function(){
          if(!this.$store.getters.error){
            // TO-DO: do we check for errors?
            this.$router.push({ query: this.$store.getters.search_params });
          }else{
            console.log("error while getting");
          }
        })
      },
      previous() {
        console.log("previous event");
        this.$store.dispatch("CHANGE_PAGE", -1).then(function(){
          if(!this.$store.getters.error){
            // TO-DO: do we check for errors?
            console.log(this.$store.getters.curr_page);
            this.$router.push({ query: this.$store.getters.search_params });
          }else{
            console.log("error while getting");
          }
        })
      },
    },
  }
</script>