<script lang="ts">
  import '../app.css'
  import { LandscapeEnforcer, TornPaperDefs } from '$components'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href="/favicon.ico" />
</svelte:head>

<!-- SVG definitions for torn paper effects - must be in DOM for clip-path refs -->
<TornPaperDefs />

<LandscapeEnforcer>
  {@render children()}
</LandscapeEnforcer>
