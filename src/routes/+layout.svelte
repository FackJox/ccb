<script lang="ts">
  import '../app.css'
  import { LandscapeEnforcer, TornPaperDefs, InstallPrompt } from '$components'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href="/favicon.ico" />
</svelte:head>

<!-- SVG definitions for torn paper effects - must be in DOM for clip-path refs -->
<TornPaperDefs />

<!-- PWA install prompt for mobile browsers -->
<InstallPrompt />

<LandscapeEnforcer>
  {@render children()}
</LandscapeEnforcer>
