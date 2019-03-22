<template>
  <b-row>
    <b-col cols="12" lg="6">
      <b-card no-header>
        <template slot="header">Username: {{ name }}</template>
        <b-table
          striped
          small
          fixed
          responsive="sm"
          :items="items($route.params.id)"
          :fields="fields"
        >
          <template slot="value" slot-scope="data">
            <strong>{{data.item.value}}</strong>
          </template>
        </b-table>
        <template slot="footer">
          <b-button @click="goBack">Back</b-button>
        </template>
        <b-form-group label="Change Role">
          <b-form-radio-group
            buttons
            button-variant="outline-primary"
            size="lg"
            id="radios1"
            v-model="selected"
            :options="options"
            name="radioOptions"
            @input="updateRole($route.params.id)"
          />
        </b-form-group>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "User",
  props: {
    caption: {
      type: String,
      default: "User id"
    }
  },
  data: () => {
    return {
      selected: "first",
      name: '',
      options: [
        { text: "Admin", value: "admin" },
        { text: "Guest", value: "guest" },
        { text: "Staff", value: "staff" }
      ],
      fields: [{ key: "key" }, { key: "value" }]
    }
  },
  computed: {
    items() {
      return id => {
        const user = this.$store.getters.userbyid(parseInt(id)) || []
        this.name = user[0].name || ''
        if (user.length === 0) {
          this.selected = "guest"
          return [{ key: "key", value: "value" }]
        } else {
          this.selected = user[0]["role"]
          const keys = Object.keys(user[0]).filter(v => v !== "password")
          return keys.map(k => ({ key: k, value: user[0][k] }))
        }
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      // this.$router.replace({path: '/users'})
    },
    updateRole(id) {
      const user = this.$store.getters.userbyid(parseInt(id))[0]
      this.$store.dispatch("UPDATE_USER", { ...user, role: this.selected })
    }
  }
}
</script>
