<template>
  <div class="keywrap">
    <div
      v-for="(item, index) in keylayouts"
      :key="index"
      :style="{ left: `${item.left}%`, top: `${item.top}%` }"
      class="keylayout-tap"
    >
      <span class="font1">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
import keylayouts from "../utils/keylayouts";
export default {
  data() {
    return {
      keylayouts,
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.keywrap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
  .keylayout-tap {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: url("../assets/keybtn.png");
    background-size: 100%;
    margin-top: -18px;
    margin-left: -18px;
    .font1 {
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>