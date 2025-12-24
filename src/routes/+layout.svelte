<script lang="ts">
  import '../app.css'
  import { LandscapeEnforcer, TornPaperDefs, InstallPrompt } from '$components'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
</svelte:head>

<!-- SVG definitions for torn paper effects - must be in DOM for clip-path refs -->
<TornPaperDefs />

<!-- PWA install prompt for mobile browsers -->
<InstallPrompt />

<LandscapeEnforcer>
  {@render children()}
</LandscapeEnforcer>
