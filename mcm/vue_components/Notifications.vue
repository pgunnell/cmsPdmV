<template>
  <span class="text-xs-center">
    <a @click="show_notifications = ! show_notifications" href="#">
      <v-badge overlap>
        <span slot="badge">{{$store.getters.unseen_notifications}}</span>
        <!-- <v-icon slot="badge">notifications</v-icon> -->
        <v-icon class="white--text">notifications</v-icon>
      </v-badge>
    </a>
    <v-menu
      absolute
      v-model="show_notifications"
      min-width=320
      max-width=320
      :absolute=true
      :nudge-bottom=60
      :nudge-right=1700
      :close-on-click="false"
      :close-on-content-click="false"
    >
        <v-card>
          <v-toolbar class="teal" dark>
          <v-text-field
            prepend-icon="search"
            placeholder="Search">
          </v-text-field>
        </v-toolbar>
          <v-list>
            <v-list-group v-for="value, item in notification_list" :key="item.$index">
              <v-list-tile slot="item" @click="fetchDetailNotifications(item)">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item }}({{value}})</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile v-for="(subItem, index) in notification_detailed[item]['notifications']" :key="subItem.$index" @click="openDetailModal(item, index)">
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ subItem.seen }}{{ subItem.title }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-layout row justify-center v-if="notification_detailed[item].more_to_fetch">
                <v-btn flat icon @click="fetchMoreNotifications(item)">
                    <v-icon small>keyboard_arrow_down</v-icon>
                </v-btn>
              </v-layout>
            </v-list-group>
          </v-list>
        </v-card>
    </v-menu>
    <v-layout row justify-center>
      <v-dialog v-model="modal_display" fullscreen transition="dialog-bottom-transition" :overlay=false>
        <v-card v-if="modal_data"> <!--if data exists. vue crashes with undefined data templates-->
          <v-toolbar dark color="primary">
            <v-btn icon @click.native="closeDetailModal(false)" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{modal_data.title}}</v-toolbar-title>
          </v-toolbar>
          <v-list three-line subheader>
            {{modal_data}}
            <pre>{{modal_data.message}}</pre>
            }
          </v-list>
        </v-card>
      </v-dialog>
    </v-layout>
  </span>
</template>

<script>
  export default {
    name: 'notifications',
    data() {
      return {
        index: 0,
        show_notifications : false
        // dialog: false,
      }
    },
    props: ['drawer'],
    methods: {},
    computed: {
      notification_list() {
        return this.$store.getters.list_notifications;
      },
      notification_detailed(){
        console.log("returning detailed info", this.$store.getters.detailed_notifications);
        return this.$store.getters.detailed_notifications;
      },
      modal_display(){
        return this.$store.getters.open_modal;
      },
      modal_data(){
        return this.$store.getters.single_notification;
      },
    },
    methods: {
    fetchDetailNotifications: function (type) {
      this.$store.dispatch("FETCH_NOTIFICATIONS", {"type": type, "page":0});
    },
    openDetailModal: function(category, index){
      this.$store.dispatch("OPEN_NOTIFICATION_DIALOG", {display: true, category: category, index: index});
      // dialog = true;
    },
    closeDetailModal: function(category, index){
      this.$store.dispatch("CLOSE_NOTIFICATION_DIALOG");
      // dialog = true;
    },
    fetchMoreNotifications: function(category){
      let notification_page = this.$store.getters.detailed_notifications[category]["page"];
      console.log("will fetch more notifications", category, notification_page+1);
      this.$store.dispatch("FETCH_NOTIFICATIONS", {"type": category, "page": notification_page+1});
    },
  }
  }
</script>
