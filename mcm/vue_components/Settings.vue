<template>
  <v-app id="settings">
  <!-- <v-navigation-drawer app></v-navigation-drawer> -->
  <!-- <v-toolbar app></v-toolbar> -->
  <toolbar title="Settings"></toolbar>
  <main>
    <v-content>
      <v-data-table
        hide-actions
        :headers="tableHeaders"
        :items="tableData"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-top-left">
            <a :href="'settings.html?prepid=' + props.item.doc.prepid" rel="tooltip" title="View only itself">
              {{ props.item.doc.prepid }}
            </a>
          </td>
          <td class="text-xs-center"></td>
          <td class="text-xs-left">
            <span>{{ props.item.doc.value }}</span>
          </td>
          <td class="text-xs-left">{{ props.item.doc.notes }}</td>
        </template>
        <template slot="no-data">
          <v-alert :value="noData" color="error" icon="warning">
            Sorry, nothing to display here
          </v-alert>
        </template>
      </v-data-table>
    </v-content>
  </main>
  <bottombar></bottombar>
</v-app>
</template>

<script>
  import BottomBar from './BottomBar.vue'
  import TopBar from './ToolBar.vue'

  export default {
    name: 'app',
    components: {
      'bottombar': BottomBar,
      'toolbar': TopBar
    },
    created() {
      this.$store.dispatch("PARSE_URL", this.$route.query);
      // this.$router.push({query: Object.assign({}, this.$route.query, {"page":"0"})});
    },
    computed: {
      tableHeaders(){
        return this.$store.getters.data_columns;
      },
      tableData(){
        return this.$store.getters.display_data;
      },
      noData(){
        return this.$store.getters.display_data == 0;
      },
    },
  }
</script>