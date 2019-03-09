<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <h1 class="float-left display-5 mr-4">{{titles[title] || 'Page Loading'}}</h1>
            <div class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: ["title"],
  data: () => ({
    titles: {
      login: "Loging in, please wait",
      logout: "Loging out, please wait"
    }
  })
}
</script>