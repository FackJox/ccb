<script lang="ts">
  interface Props {
    src: string
    parallax?: number
    zIndex?: number
    alt?: string
    layerId?: string
  }

  let { src, parallax = 0.8, zIndex = 0, alt = '', layerId }: Props = $props()
</script>

<img
  {src}
  {alt}
  class="bg-layer"
  style:z-index={zIndex}
  data-speed={parallax}
  data-layer={layerId}
  draggable="false"
/>

<style>
  .bg-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
    user-select: none;
    -webkit-user-drag: none;
  }
</style>
