import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import { Meteor } from 'meteor/meteor';
import Vue from 'vue';

// Do we need to do this? The following link says no:
// https://www.npmjs.com/package/vue-meteor-tracker
import VueTracker from 'vue-meteor-tracker';
Vue.use(VueTracker);

import VueMeta from 'vue-meta';
Vue.use(VueMeta);

// Main app
import app from './network-vis.vue';

Meteor.startup(() => {
  new Vue({
    render: h => h(app),
  }).$mount('app');
});
