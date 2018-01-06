<template>
  <div id="MCanvas" class="MCanvas" @dragover.prevent @drop="onDrop">
    <div id="MCanvas-container"></div>
  </div>
</template>

<script>
  import jointService from '@/joint-services/joint-service'
  export default {
    name: 'MCanvas',
    data () {
      return {
        jointService: null
      }
    },
    methods: {
      getContainer () {
        return document.getElementById('MCanvas-container')
      },
      onDrop (evt) {
        const elementType = evt.dataTransfer.getData('text')
        const coordinates = {x: evt.x, y: evt.y}
        jointService.createElement(elementType, coordinates)
      }
    }
  }
</script>

<style lang="scss" scoped>

  .MCanvas {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 10;

    .joint-paper {
      width: 100%;
      height: 100%;
    }

  }
</style>
