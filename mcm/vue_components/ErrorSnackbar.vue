<template>

  <v-card id="error_display">
    <v-snackbar
      :timeout="6000"
      :multi-line="true"
      v-model="snackbar"
    >
      {{ getText() }}
      <v-btn flat color="pink" @click.native="closeBar();">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>

  export default {
    name: 'errorsnack',
    methods: {
      getText(){
        return this.$store.getters.error_message + " \nReturn code: "+ this.$store.getters.error_code;
      },
      closeBar(){
        console.log("change1 error modal display to: ", false);
        this.$store.dispatch("SWITCH_ERROR_DISPLAY", false);
      },
    },
    computed:{
      snackbar: {
        get () {
          console.log("getting new value");
          return this.$store.state.show_error
        },
        set (value) {
        }
      },
    },
  }
</script>