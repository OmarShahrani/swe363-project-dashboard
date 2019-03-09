<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Request Form</strong>
          </div>
          <b-form @submit.prevent="click" @reset.prevent="reset">
            <b-form-group label="Service Requested" label-for="service" label-cols="3">
              <b-form-input id="service" type="text" :disabled="true" :value="request.service"></b-form-input>
            </b-form-group>

            <b-form-group label="Requested By" label-for="requestedBy" label-cols="3">
              <b-form-input id="requestedBy" type="text" :disabled="true" :value="requester.name"></b-form-input>
            </b-form-group>

            <b-form-group label="Requested At" label-for="requestedAt" label-cols="3">
              <b-form-input id="requestedAt" type="text" :disabled="true" :value="requestedAt"></b-form-input>
            </b-form-group>

            <b-form-group v-if="canAssign" label="Due Date" label-for="duedate" :label-cols="3">
              <b-form-input type="date" id="duedate" v-model="request.due"></b-form-input>
            </b-form-group>

            <b-form-group label="Status" label-for="status" :label-cols="3">
              <b-form-select id="status" :plain="true" :options="statusOptions" v-model="status"></b-form-select>
            </b-form-group>

            <b-form-group label="Notes" label-for="notes" :label-cols="3">
              <b-form-input
                id="notes"
                :textarea="true"
                :rows="3"
                v-model="request.notes"
                placeholder="Notes.."
              ></b-form-input>
            </b-form-group>

            <b-form-group v-if="canAssign" label="Assgin To" label-for="status" :label-cols="3">
              <b-form-radio-group
                v-model="request.assignedTo"
                :options="[{text: 'No one', value: null},...staff.map(v=>({text: `${v.name}(${v.username})`, value: v.username}))]"
                stacked
                name="radiosStacked"
              />
            </b-form-group>

            <div slot="footer">
              <b-button type="submit" size="lm" block variant="primary">
                <i class="fa fa-dot-circle-o"></i> Submit
              </b-button>
              <b-button type="reset" size="lg" block variant="danger">
                <i class="fa fa-ban"></i>
                Reset
              </b-button>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import moment from "moment"
export default {
  name: "forms",
  props: ["id"],
  data() {
    return {
      request: {},
      defaultRequest: {},
      requester: {},
      staff: [],
      status: null
    }
  },
  computed: {
    canAssign() {
      return this.$store.getters.role === "admin"
    },
    statusOptions() {
      return this.$store.getters.statusOptions
    },
    requestedAt() {
      return moment(this.request.requestedAt).format("DD/MM/YYYY HH:mm")
    }
  },
  methods: {
    click() {
      let v = { ...this.request }
      const { due = null, requestedAt, assignedTo = null, status } = v
      if (this.status === null) {
        if (due !== null) {
          if (moment(due).unix() < moment().unix()) {
            v = { ...v, status: "overdue" }
          } else {
            v = { ...v, status: "pending" }
          }
        }
      } else {
        v = { ...v, status: this.status }
      }
      this.request = { ...v }
      this.$store.dispatch("ADD_REQUEST", v)
      this.$router.replace({ name: "Home" })
    },
    reset() {
      this.request = { ...this.defaultRequest }
    }
  },
  mounted() {
    const requests = this.$store.getters.requests
    const req = requests.filter(v => v._id === this.id)[0]
    const { status } = req
    this.status =
      this.statusOptions.filter(v => v.value === status).length > 0
        ? status
        : null
    const requester = this.$store.getters.userbyid(req.requestedBy)
    this.requester = { ...requester[0] }
    const users = this.$store.getters.users
    this.staff = users.filter(v => v.role === "staff")
    this.request = { ...req }
    this.defaultRequest = { ...req }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>