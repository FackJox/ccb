/**
 * Bridge Validation
 *
 * Validates that bridged texts have matching content and position.
 * Run at build time or in development to catch mismatches.
 */

import { sceneConfigs } from './scenes'

interface ValidationError {
  sourceChapter: number
  sourceTextNum: number
  targetChapter: number
  targetTextNum: number
  error: string
}

/**
 * Validate all bridge connections in scene configs
 * @returns Array of validation errors (empty if all valid)
 */
export function validateBridges(): ValidationError[] {
  const errors: ValidationError[] = []

  for (const [chapterIdStr, config] of Object.entries(sceneConfigs)) {
    const chapterId = parseInt(chapterIdStr)

    for (const text of config.textBlocks) {
      if (text.bridgesTo) {
        const targetConfig = sceneConfigs[text.bridgesTo.chapter]

        if (!targetConfig) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Target chapter ${text.bridgesTo.chapter} not found`,
          })
          continue
        }

        const targetText = targetConfig.textBlocks.find(
          (t) => t.num === text.bridgesTo!.textNum
        )

        if (!targetText) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Target text block ${text.bridgesTo.textNum} not found in chapter ${text.bridgesTo.chapter}`,
          })
          continue
        }

        // Validate content matches
        if (targetText.content !== text.content) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Content mismatch`,
          })
        }

        // Validate position matches
        if (JSON.stringify(targetText.position) !== JSON.stringify(text.position)) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Position mismatch: ${JSON.stringify(text.position)} vs ${JSON.stringify(targetText.position)}`,
          })
        }

        // Validate target has bridgesFrom pointing back
        if (
          !targetText.bridgesFrom ||
          targetText.bridgesFrom.chapter !== chapterId ||
          targetText.bridgesFrom.textNum !== text.num
        ) {
          errors.push({
            sourceChapter: chapterId,
            sourceTextNum: text.num,
            targetChapter: text.bridgesTo.chapter,
            targetTextNum: text.bridgesTo.textNum,
            error: `Target missing or incorrect bridgesFrom reference`,
          })
        }
      }
    }
  }

  return errors
}

/**
 * Throw if any bridge validation errors
 * Use in build scripts or tests
 */
export function assertBridgesValid(): void {
  const errors = validateBridges()
  if (errors.length > 0) {
    const messages = errors.map(
      (e) =>
        `Ch${e.sourceChapter} text ${e.sourceTextNum} → Ch${e.targetChapter} text ${e.targetTextNum}: ${e.error}`
    )
    throw new Error(`Bridge validation failed:\n${messages.join('\n')}`)
  }
}
