import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,ts,svelte}'],
  exclude: [],
  outdir: 'styled-system',

  theme: {
    extend: {
      tokens: {
        colors: {
          // Primary palette - Brand Guidelines
          velvetSoot: { value: '#0B0508' },
          bakeryParchment: { value: '#F4E3C9' },
          stageViolet: { value: '#A248FF' },
          // Supporting neutrals
          deepBrass: { value: '#9B7A46' },
          bloodMuted: { value: '#6A1E29' },
          // Derived/transparent variants
          violetGlow: { value: 'rgba(162, 72, 255, 0.3)' },
          violetDeep: { value: 'rgba(162, 72, 255, 0.6)' },
          violetSubtle: { value: 'rgba(162, 72, 255, 0.15)' },
          parchmentFaded: { value: 'rgba(244, 227, 201, 0.8)' },
          sootLight: { value: 'rgba(11, 5, 8, 0.7)' },
        },
        fonts: {
          display: { value: "'Canela Bold', Georgia, serif" },
          body: { value: "'Spectral', Georgia, serif" },
        },
        fontSizes: {
          xs: { value: '0.75rem' },    // 12px
          sm: { value: '0.875rem' },   // 14px
          base: { value: '1rem' },     // 16px
          lg: { value: '1.125rem' },   // 18px
          xl: { value: '1.25rem' },    // 20px
          '2xl': { value: '1.5rem' },  // 24px
          '3xl': { value: '1.875rem' },// 30px
          '4xl': { value: '2.25rem' }, // 36px
          '5xl': { value: '3rem' },    // 48px
          hero: { value: '4rem' },     // 64px
          heroLg: { value: '5rem' },   // 80px
        },
        fontWeights: {
          normal: { value: '400' },
          medium: { value: '500' },
          semibold: { value: '600' },
          bold: { value: '700' },
        },
        lineHeights: {
          tight: { value: '1.1' },
          snug: { value: '1.25' },
          normal: { value: '1.5' },
          relaxed: { value: '1.625' },
          loose: { value: '2' },
        },
        letterSpacings: {
          tight: { value: '-0.025em' },
          normal: { value: '0' },
          wide: { value: '0.05em' },
          wider: { value: '0.1em' },
          widest: { value: '0.2em' },
        },
        // Motion tokens from Brand Guidelines
        easings: {
          // Quick in, long out - breath exhaled
          brandEnter: { value: 'cubic-bezier(0.33, 0.0, 0.15, 1.0)' },
          // Heavier, viscous exit - smoke dispersing
          brandExit: { value: 'cubic-bezier(0.25, 0.0, 0.35, 1.0)' },
          // Firm start, slow end - dancer pivoting then holding
          brandTransform: { value: 'cubic-bezier(0.45, 0.0, 0.15, 1.0)' },
        },
        durations: {
          // Micro-interactions
          microFast: { value: '140ms' },
          micro: { value: '230ms' },
          // Content/section transitions
          section: { value: '550ms' },
          sectionHeld: { value: '825ms' },
          // Signature moments
          signature: { value: '1050ms' },
          signatureLong: { value: '1200ms' },
        },
        // Reference viewport dimensions
        sizes: {
          frameWidth: { value: '852px' },
          frameHeight: { value: '393px' },
        },
        spacing: {
          0: { value: '0' },
          1: { value: '0.25rem' },
          2: { value: '0.5rem' },
          3: { value: '0.75rem' },
          4: { value: '1rem' },
          5: { value: '1.25rem' },
          6: { value: '1.5rem' },
          8: { value: '2rem' },
          10: { value: '2.5rem' },
          12: { value: '3rem' },
          16: { value: '4rem' },
          20: { value: '5rem' },
          24: { value: '6rem' },
        },
        radii: {
          none: { value: '0' },
          sm: { value: '0.125rem' },
          md: { value: '0.25rem' },
          lg: { value: '0.5rem' },
          xl: { value: '1rem' },
          full: { value: '9999px' },
        },
        borders: {
          brass: { value: '1px solid {colors.deepBrass}' },
          violet: { value: '1px solid {colors.stageViolet}' },
          parchment: { value: '1px solid {colors.bakeryParchment}' },
        },
        shadows: {
          violetGlow: { value: '0 0 20px {colors.violetGlow}' },
          violetStrong: { value: '0 0 40px {colors.violetDeep}' },
          text: { value: '0 2px 4px rgba(0, 0, 0, 0.5)' },
        },
        zIndex: {
          base: { value: '0' },
          layer: { value: '10' },
          overlay: { value: '100' },
          modal: { value: '1000' },
          progress: { value: '500' },
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            DEFAULT: { value: '{colors.velvetSoot}' },
            panel: { value: '{colors.bakeryParchment}' },
            overlay: { value: '{colors.sootLight}' },
          },
          text: {
            DEFAULT: { value: '{colors.bakeryParchment}' },
            muted: { value: '{colors.parchmentFaded}' },
            onPanel: { value: '{colors.velvetSoot}' },
            accent: { value: '{colors.stageViolet}' },
          },
          accent: {
            DEFAULT: { value: '{colors.stageViolet}' },
            glow: { value: '{colors.violetGlow}' },
            deep: { value: '{colors.violetDeep}' },
          },
          border: {
            DEFAULT: { value: '{colors.deepBrass}' },
            accent: { value: '{colors.stageViolet}' },
          },
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        slideInFromLeft: {
          from: { transform: 'translateX(-20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight: {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromBottom: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        violetPulse: {
          '0%, 100%': { boxShadow: '0 0 20px {colors.violetGlow}' },
          '50%': { boxShadow: '0 0 40px {colors.violetDeep}' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.01)' },
        },
      },
      recipes: {
        button: {
          className: 'btn',
          description: 'Button styles per Brand Guidelines',
          base: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'display',
            fontSize: 'sm',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            borderRadius: 'md',
            cursor: 'pointer',
            transition: 'all 230ms cubic-bezier(0.33, 0.0, 0.15, 1.0)',
            _disabled: {
              opacity: '0.5',
              cursor: 'not-allowed',
            },
          },
          variants: {
            variant: {
              primary: {
                bg: 'stageViolet',
                color: 'velvetSoot',
                _hover: {
                  boxShadow: '0 0 20px rgba(162, 72, 255, 0.3)',
                },
              },
              secondary: {
                bg: 'transparent',
                color: 'bakeryParchment',
                border: '1px solid token(colors.stageViolet)',
                _hover: {
                  bg: 'violetSubtle',
                },
              },
            },
            size: {
              sm: { px: '3', py: '1.5', fontSize: 'xs' },
              md: { px: '4', py: '2', fontSize: 'sm' },
              lg: { px: '6', py: '3', fontSize: 'base' },
            },
          },
          defaultVariants: {
            variant: 'primary',
            size: 'md',
          },
        },
      },
    },
  },

  // Global CSS
  globalCss: {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    html: {
      height: '100%',
      overflow: 'hidden',
    },
    body: {
      height: '100%',
      overflow: 'hidden',
      fontFamily: 'body',
      bg: 'bg',
      color: 'text',
      lineHeight: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: 'display',
      fontWeight: 'bold',
      lineHeight: 'tight',
    },
  },

  // Patterns for common UI elements
  patterns: {
    extend: {
      // Container scaled to reference viewport
      frameContainer: {
        description: 'Container sized to reference frame dimensions',
        properties: {
          scale: { type: 'number' },
        },
        transform(props) {
          const { scale = 1 } = props
          return {
            width: '{sizes.frameWidth}',
            height: '{sizes.frameHeight}',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }
        },
      },
      // Text fragment (torn flyer parchment block)
      textFragment: {
        description: 'Parchment text block with torn-flyer aesthetic',
        properties: {
          offset: { type: 'number' },
        },
        transform(props) {
          const { offset = 0 } = props
          return {
            bg: 'bg.panel',
            color: 'text.onPanel',
            px: '4',
            py: '3',
            fontFamily: 'body',
            fontSize: 'base',
            lineHeight: 'relaxed',
            transform: `translateX(${offset}px)`,
            // Realistic torn paper effect - requires TornPaperDefs SVG in DOM
            clipPath: 'url(#torn-paper-clip)',
            filter: 'drop-shadow(0 2px 4px rgba(11, 5, 8, 0.15))',
          }
        },
      },
      // Layer for BG/FG composition
      layer: {
        description: 'Positioned layer for BG/FG stacking',
        properties: {
          parallax: { type: 'number' },
        },
        transform(props) {
          return {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            willChange: 'transform',
          }
        },
      },
    },
  },
})
