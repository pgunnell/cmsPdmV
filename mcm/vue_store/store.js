import Vue from 'vue'
import Vuex from 'vuex'
import {router} from '../vue_components/settings.js'

Vue.use(Vuex);


// TO-DO:
//  do we put a single store for all pages?
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export default new Vuex.Store({
  state: {
    username: "guest",
    role: "user",
    display_data: [],
    total_rows: 0,
    offset: 0,
    // curr_page: 0,
    shown: 1, //for now the default selection should be left as it is
    search_params: { page: 0},
    notifications: { unseen: 0},
    detail_notifications: { All: {"notifications":[]}},
    notifications_modal: { display: false, category: "All", index: 0},
    show_error: false,
    error_data: { message: '', code: 100},
    columns: [
          { text: 'Prepid', value: 'prepid', sortable: false, align: 'center' },
          { text: 'Actions', value: '', sortable: false, align: 'center' },
          { text: 'Value', value: 'value', sortable: false, align: 'center' },
          { text: 'Notes', value: 'notes', sortable: false, align: 'center' },
    ]
  },

  getters: {
    userpair(state) {
      return state.username + ":" + state.role;
    },
    display_data(state){
      return state.display_data;
    },
    data_columns(state){
      let local_columns = [];
      let return_columns = [];
      // TO-DO: add default columns!
      if (state.display_data.length == 0){
        return state.columns;
      }
      Object.keys(state.display_data[0]["doc"]).forEach(function (key){
        if (key.charAt(0) != "_"){
          local_columns.push(key);
        }
      });
      if (local_columns.length != state.columns.length-1)
      {
        return_columns = Object.assign([], state.columns);
        Object.keys(local_columns).forEach(function (key){
          // construct the nicely displayed name
          let column_name = key.charAt(0).toUpperCase().replace(/_/g, " ");
          return_columns.push(
            { text: column_name, value: key, sortable: false }
            );
          });
        return return_columns;
      }
      else
      {
        return state.columns;
      }

    },
    data_length(state){
      return state.display_data.length;
    },
    resultspair(state){
      var curr_display = state.offset + state.display_data.length;
      return "From " + state.offset + " to " +  curr_display + " of total " + state.total_rows;
    },
    search_params(state){
      return state.search_params;
    },
    curr_page(state){
      return state.search_params.page;
    },
    unseen_notifications(state){
      if (state.notifications.unseen < 100) {
        return state.notifications.unseen;
      }else{
        return "99+";
      }
    },
    list_notifications(state){
      var clone = Object.assign({}, state.notifications);
      delete clone.unseen;
      return clone;
    },
    detailed_notifications(state){
      return state.detail_notifications;
    },
    open_modal(state){
      return state.notifications_modal.display;
    },
    modal_detail(state){
      return state.notifications_modal;
    },
    single_notification(state){
      console.log("notification single", state.detail_notifications[state.notifications_modal.category][
          "notifications"][state.notifications_modal.index]);
      return state.detail_notifications[state.notifications_modal.category][
          "notifications"][state.notifications_modal.index];
    },
    error_message(state){
      return state.error_data['message'];
    },
    error_code(state){
      return state.error_data['code'];
    },
    show_error_info(state){
      return state.show_error;
    },
  },

  mutations: {
    put_role(state, obj){
      state.username = obj["username"];
      state.role = obj["role"];
    },
    put_data(state, obj){
      // TO-DO: do we set the offset?
      console.log("putting data", obj);
      state.total_rows = obj["total_rows"];
      state.display_data = obj["rows"];
      if (state.search_params.page < 0){
        state.offset = 0
      }
      else
      {
        state.offset = obj["offset"] || state.search_params.page * state.total_rows;
      }
    },
    put_url_params (state, query){
      var NON_PARSABLE = ["shown"];
      state.shown = Number(query["shown"]) || 1; //TO-DO: leave it as it is now...

      // TO-DO: nicier way to iterate object?
      Object.keys(query).forEach(function(key) {
        // exclude 'page' and 'shown' from parsable URL
        if (NON_PARSABLE.indexOf(key) == -1){
          console.log("putting into search params");
          state.search_params[key] = query[key];
        }
      });

    },
    put_notifications(state, data){
      state.notifications = data;
      Object.keys(data).forEach(function(key){
        if (key != "unseen"){
          state.detail_notifications[key] = {"notifications": []};
        }
      });
    },
    page_change (state, page){
      console.log("page change. page:", page)
      state.search_params.page = Number(state.search_params.page) + page;
      console.log("current page:", state.search_params.page)
    },
    add_listnotifications (state, data){
      if (data.page == 0){
        state.detail_notifications[data.type]["notifications"] = [];
        state.detail_notifications[data.type]["notifications"] = data.data.notifications;
      }else{
        state.detail_notifications[data.type]["notifications"] = [...state.detail_notifications[data.type]["notifications"],
            ...data.data.notifications];
      }

      state.detail_notifications[data.type]["more_to_fetch"] = data.page;
      state.detail_notifications[data.type]["more_to_fetch"] = true;
      state.detail_notifications[data.type]["page"] = data.page;

      if (data.data.notifications.length < 10){
        state.detail_notifications[data.type]["more_to_fetch"] = false;
      }

      state.detail_notifications = Object.assign({}, state.detail_notifications);
    },
    change_notification_modal(state, data){
      console.log("change notification modal", data);
      Object.assign(state.notifications_modal, data);
    },
    show_error(state, data){
      state.show_error = data;
    },
    put_error_message(state, msg){
      state.error_data['message'] = msg['message'];
      state.error_data['code'] = msg['status'];
    },
  },

  actions: {
    'LOG': function ({}, msg) {
      console.log("debug", msg)
    },
    'API_REQUEST': function ({}, url) {
      return fetch(API_URL+url, {credentials: 'same-origin'})
    },
    'DISPLAY_ERROR': function ({commit}, err) {
      console.log("will display error");
      commit('put_error_message', err);
      commit('show_error', true);
    },
    'FETCH_ROLES': async function ({ commit, dispatch }) {
      console.log("fetching")
      try {
        var response = await dispatch('API_REQUEST', "restapi/users/get_role")
        var data = await response.json()

        commit("put_role", data)
        // dispatch("LOG", "hai")
      } catch (e) {
        dispatch("LOG", "hai")
        dispatch("LOG", e)
      }
    },
    'FETCH_DATA': async function({ commit, dispatch, state }){
      try {
        // TO-DO: do we move the search_dict conversion to URL string somewhere else?
        var opt_params = Object.entries(state.search_params).
          map(([k, v]) =>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).
          join('&');

        var response = await dispatch('API_REQUEST',
            "search?db_name=settings&get_raw&" + opt_params);

        var data = await response.json();

        commit("put_data", data);
        dispatch("LOG", "fetched and put data")
      } catch (e) {
        dispatch("DISPLAY_ERROR", e)
      }
    },
    'CHECK_NOTIFICATIONS': async function({commit, dispatch}){
      //fetch the number of notifications for each of category
      console.log("will fetch notifications")
      var response = await dispatch('API_REQUEST', "restapi/notifications/check");
      var data = await response.json();
      dispatch("LOG", data);
      // TO-DO: parse errors!

      commit("put_notifications", data);

    },
    'FETCH_NOTIFICATIONS': async function({commit, dispatch}, in_data){
      //fetch the number of notifications for each of category
      try {
        var response = await dispatch('API_REQUEST',
            "restapi/notifications/fetch?page=" + in_data.page + "&group=" + in_data.type);

        var data = await response.json();
        if (response.status == 200)
        {
          commit("add_listnotifications", {data: data, type: in_data.type, page: in_data.page});
        } else
        {
          dispatch("DISPLAY_ERROR", data);
        }
      //   dispatch("LOG", "fffffffsssss");
      //   dispatch("LOG", data);
      // // TO-DO: parse errors!

      } catch (e) {
        dispatch("LOG", e);
      }
    },
    'PARSE_URL': function ({ commit, dispatch}, query) {
      commit("put_url_params", query);
    },
    'CHANGE_PAGE': function({ commit, dispatch}, page){
      commit("page_change", page);
      // TO-DO: do we really refetch whole data?
      dispatch("FETCH_DATA");
    },
    'OPEN_NOTIFICATION_DIALOG': function({commit}, data){
      console.log("modal open change", data)
      commit("change_notification_modal", data);
    },
    'CLOSE_NOTIFICATION_DIALOG': async function({commit, state}){
      let read_notification_id = state.detail_notifications[state.notifications_modal.category][
        "notifications"][state.notifications_modal.index]["_id"];

      let data = {notification_id: read_notification_id}
      var res = await fetch(API_URL + "restapi/notifications/seen" , {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      });

      // var res2 = await res2.json();
      // console.log("result after marking notification as seen", res2);
      commit("change_notification_modal", {display:false});
    },
    'SWITCH_ERROR_DISPLAY': function({commit}, data){
      commit("show_error", false);
    },
  }
});