<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style>
  /*::-webkit-scrollbar {*/
  /*  width: 0px;*/
  /*  height: 1px;*/
  /*}*/
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance:textfield;
  }

  @import "./assets/css/main.css";
    @import "./assets/css/theme-red/color-red.css";/*红色主题*/
</style>
