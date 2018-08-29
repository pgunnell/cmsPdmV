<template>
  <span>
    <v-tooltip top>
      <v-btn slot="activator" small flat  @click.stop="previous()" :disabled="prevDisabled()" color="white">{{getText()}}</v-btn>
      <span>Top tooltip1</span>
    </v-tooltip>
    <v-tooltip top>
      <v-btn slot="activator" small flat color="white">{{$store.getters.curr_page}}</v-btn>
      <span>Top tooltip2</span>
    </v-tooltip>
    <v-tooltip top>
      <v-btn slot="activator" small flat  @click.stop="next()" :disabled="nextDisabled()" color="white">Next</v-btn>
      <span>Top tooltip2</span>
    </v-tooltip>
  </span>
</template>

<script>
  export default {
    name: 'pagination',
    methods: {
      prevDisabled() {
        return this.$store.getters.curr_page <= -1;
      },
      nextDisabled() {
        return this.$store.getters.data_length == 0;
      },
      getText(){
        return (this.$store.getters.curr_page > 0) ? "Prev" : "All";
      },
      next() {
        console.log("next event");
        this.$store.dispatch("CHANGE_PAGE", 1).then(() =>{
          console.log("resolving promise", this.$store.getters.curr_page);
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
        this.$store.dispatch("CHANGE_PAGE", -1).then(() => {
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
