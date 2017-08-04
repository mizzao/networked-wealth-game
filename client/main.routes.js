export default [
  {
    path: '/',
    name: 'home',
    component: '/client/home.vue',
  },
  {
    path: '/overview',
    name: 'overview',
    component: '/client/network-vis.vue',
  },
  {
    path: '/player/:id',
    name: 'player',
    component: '/client/player.vue'
  }
];
