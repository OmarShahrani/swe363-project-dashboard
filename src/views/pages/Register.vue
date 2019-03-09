<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form>
                <h1>Register</h1>
                <p class="text-muted">Create your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-user"></i>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    v-model="username"
                    placeholder="Username"
                    autocomplete="username"
                    name="username"
                    :class="{'form-control':true,'is-invalid': errors.has('username') }"
                    v-validate="'required'"
                  />
                  <b-form-invalid-feedback
                    class="float-right"
                    v-if="errors.has('username')"
                    :state="false"
                  >{{errors.first('username')}}</b-form-invalid-feedback>
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-user"></i>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    class="form-control"
                    v-model="name"
                    placeholder="Name"
                    autocomplete="Name"
                    name="name"
                    :class="{'form-control':true,'is-invalid': errors.has('name') }"
                    v-validate="'required'"
                  />
                  <b-form-invalid-feedback
                    class="float-right"
                    v-if="errors.has('name')"
                    :state="false"
                  >{{errors.first('name')}}</b-form-invalid-feedback>
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>@</b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    class="form-control"
                    v-model="email"
                    placeholder="Email"
                    autocomplete="email"
                    name="email"
                    :class="{'form-control':true,'is-invalid': errors.has('email') }"
                    v-validate="'required'"
                  />
                  <b-form-invalid-feedback
                    class="float-right"
                    v-if="errors.has('email')"
                    :state="false"
                  >{{errors.first('email')}}</b-form-invalid-feedback>
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-lock"></i>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="password"
                    ref="password"
                    class="form-control"
                    v-model="password"
                    placeholder="Password"
                    autocomplete="new-password"
                    name="password"
                    :class="{'form-control':true,'is-invalid': errors.has('password') }"
                    v-validate="'required'"
                  />
                  <b-form-invalid-feedback
                    class="float-right"
                    v-if="errors.has('password')"
                    :state="false"
                  >{{errors.first('password')}}</b-form-invalid-feedback>
                </b-input-group>

                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-lock"></i>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="password"
                    class="form-control"
                    v-model="passwordconfirm"
                    placeholder="Repeat password"
                    autocomplete="new-password"
                    name="passwordconfirm"
                    :class="{'form-control':true,'is-invalid': errors.has('passwordconfirm') }"
                    v-validate="'confirmed:password'"
                  />
                  <b-form-invalid-feedback
                    class="float-right"
                    v-if="errors.has('passwordconfirm')"
                    :state="false"
                  >The passwords do not match.</b-form-invalid-feedback>
                </b-input-group>

                <b-button variant="success" @click="validateForm" block>Create Account</b-button>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import VeeValidate from "vee-validate"
import store from "@/store"

Vue.use(VeeValidate)

const dt = new Date()
const registered = `${dt.getDate().toString() + 1}/${dt.getMonth() +
  1}/${dt.getFullYear()}`
export default {
  name: "Register",
  data: () => ({
    username: "",
    name: "",
    email: "",
    password: "",
    passwordconfirm: "",
    validated: false
  }),
  methods: {
    async validateForm() {
      try {
        const valid = await this.$validator.validateAll()
        this.validated = true
        if (valid) {
          this.createAccount()
        }
      } catch (error) {
        console.log("Register.validateForm", error)
      }
    },
    createAccount() {
      const user = {
        _id: this.username,
        id: this.username,
        registered:  new Date().toISOString(),
        status: "Active",
        username: this.username,
        name: this.name,
        email: this.email,
        password: this.password,
        role: "guest",
        type: "user"
      }

      this.$store.dispatch("CREATE_ACCOUNT", user)
    }
  },
  beforeRouteEnter(to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    const activeuser = store.getters.user
    if (activeuser === null) {
      next()
    } else {
      next({ name: "Page404" })
    }
  }
}
</script>
