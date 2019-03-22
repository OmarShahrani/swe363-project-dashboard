<template>
  <div>
    <!-- Modal Component -->
    <b-modal
      id="modalPrevent"
      ref="modal"
      title="Add a service"
      @ok="handleOk"
      @shown="loadService"
      ok-title="Save"
    >
      <div class="animated fadeIn">
        <b-row>
          <b-col md="12">
            <b-card>
              <b-alert
                :show="dismissCountDown"
                dismissible
                variant="warning"
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged"
              >
                <p>Please enter a service name ... {{ dismissCountDown }} seconds...</p>
                <b-progress
                  variant="warning"
                  :max="dismissSecs"
                  :value="dismissCountDown"
                  height="4px"
                />
              </b-alert>
              <b-form @submit.stop.prevent="handleSubmit">
                <b-form-group label="Service Name" label-for="name" label-cols="3">
                  <b-form-input id="name" type="text" v-model="service.name"></b-form-input>
                </b-form-group>

                <b-form-group label="Description" label-for="description" :label-cols="3">
                  <b-form-textarea
                    id="description"
                    v-model="service.description"
                    rows="6"
                    max-rows="10"
                  />
                </b-form-group>
                <b-form-group label="Status" label-for="status" :label-cols="3">
                  <b-form-select
                    id="status"
                    :plain="true"
                    :options="[{text: 'Active', value:'active'},{text: 'Inctive', value:'inactive'}]"
                    v-model="service.status"
                  ></b-form-select>
                </b-form-group>

                <b-form-group label="Service icon" label-for="icon" label-cols="3">
                  <b-form-input id="icon" type="text" v-model="service.icon"></b-form-input>
                </b-form-group>
              </b-form>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: ["passedService"],
  data() {
    return {
      service: {
        id: "new",
        name: "",
        description: "",
        icon: "",
        status: "inactive"
      },
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false
    }
  },
  methods: {
    loadService() {
      const { id = null } = this.passedService
      if (id === null) {
        this.clearName()
      } else {
        this.service = this.passedService
      }
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    clearName() {
      this.service = {
        id: "new",
        name: "",
        description: "",
        icon: "",
        status: "inactive"
      }
    },
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (this.service.name === "") {
        this.showAlert()
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit() {
      this.$store.dispatch("ADD_SERVICE", this.service)
      this.clearName()
      this.$nextTick(() => {
        // Wrapped in $nextTick to ensure DOM is rendered before closing
        this.$refs.modal.hide()
      })
    }
  }
}
</script>