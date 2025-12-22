<script lang="ts">
  /**
   * TornPaperDefs - SVG definitions for realistic torn paper edges
   *
   * Renders an invisible SVG containing clip-path definitions with organic
   * bezier curves that mimic natural paper tearing. Include once in the app
   * and reference via CSS: clip-path: url(#torn-paper-clip)
   */
</script>

<!--
  Hidden SVG containing reusable clip-path definitions.
  The torn edge uses cubic bezier curves for organic, natural-looking tears.
-->
<svg
  class="torn-paper-defs"
  width="0"
  height="0"
  aria-hidden="true"
>
  <defs>
    <!--
      Torn paper clip-path with organic edges
      Viewbox is 300x100 - scales to any element size
      Top and bottom edges have irregular, fiber-like tears
    -->
    <clipPath id="torn-paper-clip" clipPathUnits="objectBoundingBox">
      <path d="
        M 0 0.08
        C 0.02 0.04, 0.04 0.12, 0.06 0.05
        C 0.08 0.02, 0.10 0.09, 0.13 0.03
        C 0.16 0.07, 0.18 0.01, 0.22 0.06
        C 0.25 0.10, 0.28 0.02, 0.32 0.08
        C 0.35 0.04, 0.38 0.11, 0.42 0.03
        C 0.45 0.07, 0.48 0.01, 0.52 0.05
        C 0.55 0.09, 0.58 0.02, 0.62 0.07
        C 0.65 0.03, 0.68 0.10, 0.72 0.04
        C 0.75 0.08, 0.78 0.01, 0.82 0.06
        C 0.85 0.11, 0.88 0.03, 0.92 0.08
        C 0.95 0.04, 0.97 0.09, 1 0.05
        L 1 0.93
        C 0.97 0.97, 0.95 0.90, 0.92 0.96
        C 0.88 0.92, 0.85 0.99, 0.82 0.94
        C 0.78 0.98, 0.75 0.91, 0.72 0.97
        C 0.68 0.93, 0.65 1.00, 0.62 0.95
        C 0.58 0.91, 0.55 0.98, 0.52 0.93
        C 0.48 0.97, 0.45 0.90, 0.42 0.96
        C 0.38 0.92, 0.35 0.99, 0.32 0.94
        C 0.28 0.98, 0.25 0.91, 0.22 0.97
        C 0.18 0.93, 0.16 1.00, 0.13 0.95
        C 0.10 0.91, 0.08 0.98, 0.06 0.93
        C 0.04 0.97, 0.02 0.90, 0 0.94
        Z
      "/>
    </clipPath>

    <!--
      Alternate torn edge - different random pattern
      Use for variety: clip-path: url(#torn-paper-clip-alt)
    -->
    <clipPath id="torn-paper-clip-alt" clipPathUnits="objectBoundingBox">
      <path d="
        M 0 0.06
        C 0.03 0.10, 0.05 0.02, 0.08 0.08
        C 0.11 0.04, 0.14 0.11, 0.18 0.05
        C 0.21 0.09, 0.24 0.01, 0.28 0.07
        C 0.31 0.12, 0.34 0.03, 0.38 0.09
        C 0.41 0.05, 0.44 0.10, 0.48 0.04
        C 0.51 0.08, 0.54 0.02, 0.58 0.07
        C 0.61 0.11, 0.64 0.04, 0.68 0.09
        C 0.71 0.05, 0.74 0.12, 0.78 0.06
        C 0.81 0.10, 0.84 0.03, 0.88 0.08
        C 0.91 0.04, 0.94 0.11, 0.97 0.05
        L 1 0.06
        L 1 0.95
        C 0.97 0.91, 0.94 0.98, 0.91 0.93
        C 0.88 0.97, 0.84 0.90, 0.81 0.96
        C 0.78 0.92, 0.74 0.99, 0.71 0.94
        C 0.68 0.98, 0.64 0.91, 0.61 0.97
        C 0.58 0.93, 0.54 1.00, 0.51 0.95
        C 0.48 0.91, 0.44 0.98, 0.41 0.93
        C 0.38 0.97, 0.34 0.90, 0.31 0.96
        C 0.28 0.92, 0.24 0.99, 0.21 0.94
        C 0.18 0.98, 0.14 0.91, 0.11 0.97
        C 0.08 0.93, 0.05 1.00, 0.03 0.95
        C 0.01 0.91, 0 0.96, 0 0.94
        Z
      "/>
    </clipPath>
  </defs>
</svg>

<style>
  .torn-paper-defs {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    pointer-events: none;
  }
</style>
