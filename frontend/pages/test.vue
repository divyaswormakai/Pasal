<template>
  <div>This is a test page..</div>
</template>

<script>
export default {
  name: 'test.vue',
  created() {
    this.$store.dispatch('updateLoadingState', false)
  },
}
</script>

<style scoped></style>
