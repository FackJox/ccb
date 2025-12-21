<script lang="ts">
  interface Props {
    content: string
    size?: 'normal' | 'large' | 'hero'
    class?: string
  }

  let { content, size = 'normal', class: className = '' }: Props = $props()

  // Split "Un. Deux. Trois." style content into words
  const words = $derived(content.split(/\s+/))
</script>

<div class="typography-beat {size} {className}" data-beat>
  {#each words as word, i}
    <span
      class="beat-word"
      style:--delay="{i * 125}ms"
    >
      {word}
    </span>
  {/each}
</div>

<style>
  .typography-beat {
    font-family: 'Canela Bold', Georgia, serif;
    color: #F4E3C9;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5em;
  }

  .beat-word {
    display: inline-block;
    /* GSAP controls opacity and transform via SplitText */
  }

  /* Size variants */
  .normal {
    font-size: 1.5rem;
    letter-spacing: 0.05em;
  }

  .large {
    font-size: 2.25rem;
    letter-spacing: 0.1em;
  }

  .hero {
    font-size: 4rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
</style>
