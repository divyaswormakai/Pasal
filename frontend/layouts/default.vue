<template>
  <div class="body">
    <div class="loader-div" v-if="this.$store.state.loading">
      <span class="loader"></span>
    </div>
    <Navbar />
    <div class="container">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.body {
  position: relative;
}

.loader-div {
  position: absolute;
  background-color: white;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.loader {
  width: 50%;
  height: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  background-image: linear-gradient(
    45deg,
    #ce2f6c 25%,
    transparent 25%,
    transparent 50%,
    #ce2f6c 50%,
    #ce2f6c 75%,
    transparent 75%,
    transparent
  );
  font-size: 30px;
  background-size: 1em 1em;
  box-sizing: border-box;
  animation: barStripe 1s linear infinite;
}

@keyframes barStripe {
  0% {
    background-position: 1em 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
