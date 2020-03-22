<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Movies</router-link> |
      <router-link to="/shows">TV-Shows</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import '@/element-variables';
#app {
  font-family: system-ui;
  color: #2c3e50;
  max-width: 1000px;
  margin: 0 auto;

  h1,
  h2,
  h3 {
    font-weight: normal;
  }
}

#nav {
  padding: 30px;
  text-align: center;

  a {
    color: $--color-primary;
    &.router-link-exact-active {
      color: $--color-text-placeholder;
      text-decoration: none;
      pointer-events: none;
    }
  }
}
</style>
