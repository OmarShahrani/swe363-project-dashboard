<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">500</h1>
            <h4 class="pt-3">We have a problem!</h4>
            <p class="text-muted">
              {{ error_messages[id] }}
              <b-button class="btn-ghost-secondary" block :to="{name: 'Home'}">Home Page</b-button>
            </p>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page500",
  props: {
    id: {
      type: String,
      default: "not_available"
    }
  },
  computed: {
    error_messages() {
      return this.$store.getters.error_messages
    }
  },
  beforeDestroy() {
    this.$store.dispatch("REMOVE_ERROR_MESSAGE", this.id)
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("REMOVE_ERROR_MESSAGE", this.id)
    next()
  }
}
</script>
