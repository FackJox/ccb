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
    padding: 12px 16px;
    background: #F4E3C9;
    color: #0B0508;
    font-family: 'Spectral', Georgia, serif;
    font-size: 0.9375rem;
    line-height: 1.625;

    /* Torn flyer effect */
    clip-path: polygon(
      2px 0,
      100% 1px,
      calc(100% - 1px) 100%,
      0 calc(100% - 2px)
    );

    transform: translateX(var(--offset, 0));
  }

  .text-fragment p {
    margin: 0;
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
