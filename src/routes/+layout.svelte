<script lang="ts">
  import '../app.css'
  import { LandscapeEnforcer } from '$components'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href="/favicon.ico" />
</svelte:head>

<LandscapeEnforcer>
  {@render children()}
</LandscapeEnforcer>
