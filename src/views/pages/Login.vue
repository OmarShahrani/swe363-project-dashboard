<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <b-alert :show="login_error!==null" variant="danger" dismissible>{{login_error}}</b-alert>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-user"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      class="form-control"
                      placeholder="Username"
                      v-model="username"
                      autocomplete="username email"
                    />
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-lock"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="password"
                      v-model="password"
                      class="form-control"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" @click="logmein">Login</b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button
                        variant="link"
                        class="px-0"
                        :to="{name: 'Page500', params: {id: 'not_implemented'}}"
                      >Forgot password?</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>If you do not have an acoount.</p>
                  <b-button
                    variant="primary"
                    class="active mt-3"
                    @click="$router.replace({name: 'Register'})"
                  >Register Now!</b-button>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    username: "",
    password: ""
  }),
  computed: {
    login_error() {
      const { login_error = null } = this.$store.getters.error_messages
      return login_error
    }
  },
  methods: {
    logmein() {
      const user = { username: this.username, password: this.password }
      this.$store.dispatch("LOG_IN", user)
    }
  }
}
</script>
