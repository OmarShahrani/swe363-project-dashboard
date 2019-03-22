<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile/>
      <b-link class="navbar-brand text-success" to="#">
        <h2>KFUPM</h2>
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg"/>
      <b-navbar-nav class="d-sm-down-none">
        <b-nav-item class="px-3" to="/dashboard">Dashboard</b-nav-item>
        <b-nav-item class="px-3" to="/users" v-if="role==='admin'" exact>Users</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item class="d-md-down-none">
          <i class="icon-bell"></i>
          <b-badge pill variant="danger">{{pending}}</b-badge>
        </b-nav-item>
        <span class="font-weight-bold">{{user.username}}</span>
        <DefaultHeaderDropdownAccnt/>
      </b-navbar-nav>

      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarMinimizer/>
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        <a href="https://www.kfupm.edu.sa">KFUPM</a>
        <span class="ml-1">&copy; 2018</span>
      </div>
      <div class="ml-auto">
        <span class="mr-1">Course Project</span>
        <a
          href="http://www.kfupm.edu.sa/departments/ics/Pages/en/B-S-Software-Course-List.aspx"
          rel="noopener noreferrer"
          target="_blank"
        >SWE363</a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
import nav from "@/_nav"
import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarMinimizer,
  SidebarNav,
  Footer as TheFooter,
  Breadcrumb
} from "@coreui/vue"
import DefaultHeaderDropdownAccnt from "./DefaultHeaderDropdownAccnt"

export default {
  name: "DefaultContainer",
  components: {
    AppHeader,
    AppSidebar,
    TheFooter,
    Breadcrumb,
    DefaultHeaderDropdownAccnt,
    SidebarToggler,
    SidebarNav,
    SidebarMinimizer
  },
  data() {
    return {
      nav: nav.items
    }
  },
  computed: {
    pending() {
      return this.$store.getters.noofrequests("pending")
    },
    role() {
      return this.$store.getters.role
    },
    user() {
      return this.$store.getters.user
    },
    name() {
      return this.$route.name
    },
    list() {
      return this.$route.matched.filter(route => route.name || route.meta.label)
    }
  }
}
</script>
