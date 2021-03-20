<template>
  <div>
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="home">
        <nuxt-link to="/"> <a-icon type="mail" />Medicines</nuxt-link>
      </a-menu-item>
      <a-menu-item key="invoice">
        <nuxt-link to="/invoice"><a-icon type="appstore" />Invoices</nuxt-link>
      </a-menu-item>
      <a-menu-item key="expiry">
        <nuxt-link to="/expiry"><a-icon type="appstore" />Expiry</nuxt-link>
      </a-menu-item>
      <a-menu-item key="expired">
        <nuxt-link to="/expired"><a-icon type="appstore" />Expired</nuxt-link>
      </a-menu-item>
      <a-menu-item key="distributor">
        <nuxt-link to="/distributor"
          ><a-icon type="appstore" />Distributors</nuxt-link
        >
      </a-menu-item>
      <a-menu-item key="chart">
        <nuxt-link to="/chart"><a-icon type="appstore" />Chart</nuxt-link>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      current: ['home'],
      logoText: 'Pasal',
    }
  },
  mounted() {
    this.current = [this.$route.path.split('/')[1]]
  },
}
</script>

<style scoped></style>
