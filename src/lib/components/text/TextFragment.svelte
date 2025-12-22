<script lang="ts">
  interface Props {
    content: string
    position?: 'left' | 'right' | 'center' | 'bottom'
    offset?: number
    class?: string
  }

  let {
    content,
    position = 'left',
    offset = 0,
    class: className = ''
  }: Props = $props()
</script>

<div
  class="text-fragment {position} {className}"
  style:--offset="{offset}px"
  data-text
>
  <p>{content}</p>
</div>

<style>
  .text-fragment {
    position: absolute;
    max-width: 300px;
    padding: 16px 20px;
    background: #F4E3C9;
    color: #0B0508;
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.9375rem;
    line-height: 1.625;

    /* Realistic torn paper effect using SVG clip-path */
    clip-path: url(#torn-paper-clip);

    /* Subtle paper shadow for depth */
    filter: drop-shadow(0 2px 4px rgba(11, 5, 8, 0.15));

    transform: translateX(var(--offset, 0));
  }

  /*
   * Torn edge highlight - simulates the lighter fiber edge of torn paper
   * Creates a subtle lighter strip along the torn edges
   */
  .text-fragment::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 8%,
      transparent 12%,
      transparent 88%,
      rgba(255, 255, 255, 0.1) 92%,
      rgba(255, 255, 255, 0.35) 100%
    );
    pointer-events: none;
    clip-path: url(#torn-paper-clip);
  }

  .text-fragment p {
    margin: 0;
    position: relative; /* Above the ::before */
  }

  /* Position variants */
  .left {
    left: 24px;
    top: 50%;
    transform: translateY(-50%) translateX(var(--offset, 0));
  }

  .right {
    right: 24px;
    top: 50%;
    transform: translateY(-50%) translateX(var(--offset, 0));
    text-align: right;
  }

  .center {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) translateX(var(--offset, 0));
    text-align: center;
  }

  .bottom {
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%) translateX(var(--offset, 0));
    text-align: center;
  }
</style>
