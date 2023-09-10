<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  methods: {
    onMounted() {
      this.$router.push("/sign_up_enter_email_view")
      window.history.replaceState({}, '', '/sign_up_enter_email_view');

    }
  }
}
</script>