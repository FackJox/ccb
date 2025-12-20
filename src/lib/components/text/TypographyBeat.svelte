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

<div class="typography-beat {size} {className}">
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
    opacity: 0;
    transform: translateY(0);
    animation: beat-reveal 0.55s cubic-bezier(0.33, 0.0, 0.15, 1.0) forwards;
    animation-delay: var(--delay, 0ms);
  }

  @keyframes beat-reveal {
    from {
      opacity: 0;
      transform: translateY(0);
    }
    to {
      opacity: 1;
      transform: translateY(-10px);
    }
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
