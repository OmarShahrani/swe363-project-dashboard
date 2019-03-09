<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img src="img/avatars/7.jpg" class="img-avatar" :alt="user.email">
    </template>\
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center">
        <strong>Account</strong>
      </b-dropdown-header>
      <b-dropdown-item>
        <i class="fa fa-bell-o"/> Requests
        <b-badge variant="info">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item v-if="role==='admin' || role==='staff'">
        <i class="fa fa-tasks"/>
        Tasks
        <b-badge variant="danger">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-header tag="div" class="text-center">
        <strong>Settings</strong>
      </b-dropdown-header>
      <b-dropdown-item @click="notimplemented">
        <i class="fa fa-user"/> Profile
      </b-dropdown-item>
      <b-dropdown-item @click="notimplemented">
        <i class="fa fa-wrench"/> Settings
      </b-dropdown-item>
      <b-dropdown-item @click="logout">
        <i class="fa fa-lock"/> Logout
      </b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from "@coreui/vue"
export default {
  name: "DefaultHeaderDropdownAccnt",
  components: {
    AppHeaderDropdown
  },
  computed: {
    itemsCount() {
      return this.$store.getters.noofrequests("pending")
    },
    user() {
      return this.$store.getters.user
    },
    role() {
      return this.$store.getters.role
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("LOG_OUT")
    },
    notimplemented() {
      this.$store.dispatch("DISPLAY_ERROR_MESSAGE", {
        id: "not_implemented",
        message: "Method not implemented yet."
      })
    }
  }
}
</script>
