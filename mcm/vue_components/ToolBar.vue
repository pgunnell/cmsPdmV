<template>
  <v-layout>
    <v-navigation-drawer fixed hide-overlay v-model="drawer" enable-resize-watcher app>
      <v-list dense>
        <v-list-tile v-for="item in menus" :key="item.$index" :href="item.link" target="_self">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- TO-DO: open modal -->
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>mail_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Support</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- TO-DO: open modal -->
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>help</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Help</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="green" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat :href="usernameUrl" target="_blank" color="white">
        <span >{{$store.getters.userpair}}</span>
      </v-btn>
      <!-- TO-DO: make badge hover mouse to clickable mouse -->
      <!-- <notifications v-bind:drawer="notification_drawer"></notifications> -->
    </v-toolbar>
  </v-layout>
</template>

<script>
  import Notifications from './Notifications.vue'
  export default {
    name: 'navbar',
    data () {
      return {
        drawer: false,
        notification_drawer: false,
        menus: [
        {
          name: "Home",
          icon: "home",
          link: API_URL,
        },
        {
          name: "Campaigns",
          icon: "book",
          link: API_URL+"campaigns",
        },
        {
          name: "Chained campaigns",
          icon: "format_align_right",
          link: API_URL+"chained_campaigns",
        },
        {
          name: "Requests",
          icon: "folder",
          link: API_URL+"requests",
        },
        {
          name: "Chained requests",
          icon: "folder_shared",
          link: API_URL+"chained_requests",
        },
        {
          name: "Batches",
          icon: "local_offer",
          link: API_URL+"batches",
        },
        {
          name: "MccMs",
          icon: "assignment",
          link: API_URL+"mccms",
        },
        {
          name: "Invalidations",
          icon: "error",
          link: API_URL+"invalidations",
        },
        {
          name: "Dashboard",
          icon: "dashboard",
          link: API_URL+"dashboard",
        },
        {
          name: "DB",
          icon: "star",
          link: "https://cms-pdmv.cern.ch/mcm/admin/_utils/",
        },
        {
          name: "Flows",
          icon: "device_hub",
          link: API_URL+"flows",
        },
        {
          name: "Priority",
          icon: "fingerprint",
          link: API_URL+"priority_change",
        },
        {
          name: "Users",
          icon: "person",
          link: API_URL+"users",
        },
        {
          name: "Settings",
          icon: "settings",
          link: API_URL+"settings",
        },
        {
          name: "pMp",
          icon: "local_movies",
          link: "https://cms-pdmv.cern.ch/pmp",
        }
        ],
      }
    },
    props: ['title'],
    components: {
      notifications: Notifications,
    },
    computed: {
      usernameUrl() {
        console.log("x", this.$store.state.username)
        return 'https://cms-pdmv.cern.ch/mcm/users?username=' + this.$store.state.username
      },
      json() {
        return JSON.stringify(this.$store.state.data)
      },
    },
    methods: {
    debugOut: function (message) {
      alert(message)
    },
  }
  }
</script>