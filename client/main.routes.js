export default [
  {
    path: '/',
    name: 'home',
    component: '/client/home.vue',
  },
  {
    path: '/overview',
    name: 'overview',
    component: '/client/admin/overview.vue',
  },
  {
    path: '/player/:myNodeId',
    name: 'player',
    component: '/client/player/player.vue',
    props: true // https://router.vuejs.org/en/essentials/passing-props.html
  },
  {
    path: '/controls',
    name: 'controls',
    component: '/client/admin/controls.vue'
  },
  {
    path: '/data',
    name: 'dataDownload',
    component: '/client/admin/data-download.vue'
  }
];
