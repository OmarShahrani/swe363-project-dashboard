<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="6" lg="3">
        <h2>Services</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6" lg="3" v-for="s in services" :key="s.id">
        <b-card
          @mouseover="showShadow(s.id)"
          @mouseleave="hideShadow(s.id)"
          @click="addRequest(s.id)"
          no-body
          :class="{'shadow-lg border rounded div-pointer': raised.includes(s.id) && !inactive_services.includes(s.id) ,'bg-light':true}"
        >
          <b-card-body class="pb-2">
            <b-button
              v-if="!inactive_services.includes(s.id)"
              class="float-right text-primary"
              @click.stop="addRequest(s.id)"
              variant="transparent p-0"
              right
            >
              <i class="icon-plus"></i>
            </b-button>
            <div style="position: relative;">
              <h4 class="mb-2">{{s.name}}</h4>
              <span
                style="position: relative; margin-top: -22px;"
                class="font-weight-bold text-danger"
                v-if="inactive_services.includes(s.id)"
              >(not available at this time)</span>
            </div>
            <p>{{s.description}}</p>
            <div class="text-right">
              <b-button
                v-if="role==='admin'"
                @click.stop="toggleService(s.id)"
                :variant="(inactive_services.includes(s.id) && 'success')|| 'danger'"
              >{{(inactive_services.includes(s.id) && 'Make available')|| 'Make unavailable'}}</b-button>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6" lg="3">
        <h2>Requests</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" sm="6" lg="3" v-for="r in requests" :key="r._id" class="animated fadeIn">
        <b-card :no-body="true" footer-class="px-3 py-2">
          <b-card-body class="p-3 clearfix">
            <b-button
              class="float-right"
              v-if="role==='admin'"
              @click="removeRequest(r)"
              variant="p-0"
              right
            >
              <i class="icon-minus text-danger"></i>
            </b-button>
            <i :class="{[icon(r.service)]: true, 'bg-primary p-3 font-2xl mr-3 float-left':true}"></i>
            <div class="h5 text-primary mb-0 mt-2">{{serviceName(r.service)}}</div>

            <div
              class="text-muted text-uppercase font-weight-bold font-xs"
            >{{requestedAt(r.requestedAt)}}</div>

            <div
              class="text-muted text-uppercase font-weight-bold font-xs"
            >Requested By : {{r.requestedBy}}</div>

            <div
              v-if="r.due"
              class="text-muted text-uppercase font-weight-bold font-xs"
            >Due : {{r.due}}</div>
          </b-card-body>
          <div slot="footer">
            <b-link
              class="font-weight-bold font-xs btn-block text-muted"
              :to="{name: 'RequestForm',params: {id: r._id}}"
            >
              View More
              <i class="fa fa-angle-right float-right font-lg"></i>
            </b-link>
            <div
              :class="{'h5 py-1 px-2 mt-2 float-right': true, [flag(r.status)]: true}"
            >{{r.status}}</div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "dashboard",
  data: () => ({
    role: null,
    raised: []
  }),
  computed: {
    user() {
      return this.$store.getters.user;
    },
    services() {
      return this.$store.getters.services;
    },
    inactive_services() {
      return this.$store.getters.inactive_services;
    },
    requests() {
      let requests = this.$store.getters.requests;
      let statusOptions = this.$store.getters.statusOptions;
      requests = requests.map(v => {
        let tempv = v;
        const { due = null, requestedAt, status } = tempv;
        if (due !== null) {
          if (statusOptions.filter(so => so.value === status).length === 0) {
            if (moment(due).unix() < moment().unix()) {
              tempv = { ...tempv, status: "overdue" };
            }
          }
        }
        return tempv;
      });
      const { role, username } = this.user;
      this.role = role;
      if (role === "admin") {
        return requests;
      } else {
        return requests.filter(v => {
          const { assignedTo = null, requestedBy } = v;
          return (
            (role === "staff" && assignedTo === username) ||
            requestedBy === username
          );
        });
      }
    }
  },
  methods: {
    toggleService(name) {
      this.$store.dispatch("TOGGLE_SERVICE", name);
    },
    hideShadow(id) {
      this.raised = this.raised.filter(v => v !== id);
    },
    showShadow(id) {
      this.raised.push(id);
    },
    flag(value) {
      switch (value) {
        case "open":
          return "text-warning bg-light";
          break;
        case "pending":
          return "text-info bg-dark";
          break;
        case "completed":
          return "text-success";
          break;
        case "closed":
          return "text-success bg-dark";
          break;
        case "overdue":
          return "text-danger";
          break;
      }
    },
    removeRequest(r) {
      this.$store.dispatch("REMOVE_REQUEST", r);
    },
    addRequest(id) {
      if (this.inactive_services.includes(id)) {
        return false;
      }
      const user = this.$store.getters.user;
      const username = user.username;
      const request = {
        type: "request",
        requestedBy: username,
        requestedAt: new Date().toISOString(),
        service: id,
        status: "pending"
      };
      this.$store.dispatch("ADD_REQUEST", request);
    },
    serviceName(name) {
      return this.services.filter(v => v.id === name).map(v => v.name)[0];
    },
    icon(name) {
      return this.services.filter(v => v.id === name).map(v => v.icon)[0];
    },
    requestedAt(date) {
      return moment(date).format("DD/MM/YYYY -- HH:mm");
    }
  }
};
</script>

<style>
/* IE fix */
#card-chart-01,
#card-chart-02 {
  width: 100% !important;
}

.div-pointer {
  cursor: pointer;
}
</style>
