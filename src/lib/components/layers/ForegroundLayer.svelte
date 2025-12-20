<script lang="ts">
  interface Props {
    src: string
    zIndex?: number
    alt?: string
  }

  let { src, zIndex = 1, alt = '' }: Props = $props()
</script>

<img
  {src}
  {alt}
  class="fg-layer"
  style:z-index={zIndex}
  data-speed="1"
  draggable="false"
/>

<style>
  .fg-layer {
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
