<template>
  <div class="text-center">
    <loading
      :active.sync="busy"
      :can-cancel="true"
      :background-color="'#6e387c'"
      :color="'#fff'"
      loader="bars"
      :is-full-page="fullPage"
    ></loading>
  </div>
</template>



    <script>
// Import component
import Loading from "vue-loading-overlay"
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css"

export default {
  data() {
    return {
      fullPage: true
    }
  },
  components: {
    Loading
  },
  computed: {
    busy() {
      return this.$store.getters.busy
    }
  }
}
</script>
