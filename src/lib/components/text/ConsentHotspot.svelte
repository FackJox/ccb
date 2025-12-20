<script lang="ts">
  interface Props {
    content: string
    class?: string
  }

  let { content, class: className = '' }: Props = $props()

  let isHovered = $state(false)
</script>

<span
  class="consent-hotspot {className}"
  class:hovered={isHovered}
  data-text={content}
  role="button"
  tabindex="0"
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
  onfocus={() => isHovered = true}
  onblur={() => isHovered = false}
>
  {content}
</span>

<style>
  .consent-hotspot {
    position: relative;
    cursor: pointer;
    font-family: 'Spectral', Georgia, serif;
    font-style: italic;
    color: #F4E3C9;
    transition: all 0.55s cubic-bezier(0.33, 0.0, 0.15, 1.0);
  }

  .consent-hotspot::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    opacity: 0;
    transform: translate(2px, 2px);
    color: inherit;
    filter: blur(1px);
    transition: opacity 0.55s cubic-bezier(0.33, 0.0, 0.15, 1.0);
    pointer-events: none;
  }

  .consent-hotspot.hovered::after,
  .consent-hotspot:focus::after {
    opacity: 0.3;
  }

  .consent-hotspot:focus {
    outline: none;
    text-decoration: underline;
    text-decoration-color: #A248FF;
    text-underline-offset: 4px;
  }
</style>
