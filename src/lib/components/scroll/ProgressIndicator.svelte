<script lang="ts">
  import { createScrollState } from '$stores'

  interface Props {
    class?: string
  }

  let { class: className = '' }: Props = $props()

  const scrollState = createScrollState()

  // Progress as percentage
  const progressPercent = $derived(Math.round(scrollState.progress * 100))
</script>

<div class="progress-indicator {className}" aria-hidden="true">
  <div class="progress-track">
    <div class="progress-fill" style:height="{progressPercent}%"></div>
    <div class="progress-icon" style:bottom="{progressPercent}%">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <!-- C/J monogram simplified as initials -->
        <text x="4" y="16" font-size="12" font-family="Georgia, serif">CJ</text>
      </svg>
    </div>
  </div>

  <div class="chapter-indicator">
    <span class="chapter-number">{scrollState.chapter.id}</span>
    <span class="chapter-separator">/</span>
    <span class="chapter-total">9</span>
  </div>
</div>

<style>
  .progress-indicator {
    position: fixed;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .progress-track {
    position: relative;
    width: 2px;
    height: 60vh;
    background: rgba(162, 72, 255, 0.2);
    border-radius: 1px;
  }

  .progress-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #A248FF;
    border-radius: 1px;
    transition: height 100ms linear;
  }

  .progress-icon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(50%);
    width: 24px;
    height: 24px;
    color: #A248FF;
    transition: bottom 100ms linear;
  }

  .progress-icon svg {
    width: 100%;
    height: 100%;
  }

  .chapter-indicator {
    font-family: 'Canela Bold', Georgia, serif;
    font-size: 0.75rem;
    color: #F4E3C9;
    opacity: 0.6;
    letter-spacing: 0.1em;
  }

  .chapter-number {
    color: #A248FF;
  }

  .chapter-separator {
    margin: 0 2px;
  }
</style>
