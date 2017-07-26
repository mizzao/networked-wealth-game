<template>
  <div class="container">
    <!-- Menu -->
    <app-menu></app-menu>

    <!-- Route content -->
    <router-view></router-view>
  </div>
</template>

<script>
  import AppMenu from '/imports/ui/AppMenu.vue';

  export default {
    components: {
      AppMenu
    }
  }
</script>
