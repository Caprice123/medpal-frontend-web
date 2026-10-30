import styled from 'styled-components'
import { heroChrome, media } from '../../../../theme'

// The art is laid out against the same reference box Figma uses — the region of
// the 1440x774 hero frame running x 620..1440, y 120..680. Keeping the children
// positioned as percentages of that box preserves the overlap between the
// mascot and the two floating UI cards at every width.
/* The art is the tallest thing in the hero, so it is what has to give when the
   window is short enough that the hero and the ticker cannot both fit.

   Capping its height directly would not work: with an explicit width AND a
   capped height, `aspect-ratio` is overruled and the box simply squashes,
   distorting every percentage-positioned child inside it. Capping the WIDTH
   against the height still available keeps the ratio exact, so the art scales
   down whole. 1.4643 is 820/560, turning leftover height into a width.

   Both terms of that cap vary, and not with the same thing — the column with
   the window's width, the leftover height with the chrome budget in play — so
   each is a custom property and the width itself is written once. Spelling the
   four combinations out as four `width:` declarations instead would leave them
   to override each other in source order. */

// The floor under all of that: below roughly two thirds of the 820px Figma
// draws, the mascot and its two UI cards stop reading as an illustration and
// start reading as a thumbnail.
//
// It is a real trade, not a free win. Once this floor beats the height cap the
// hero is taller than the screen can hold and the page scrolls — about 55px of
// it on a 620px-tall window. HeroWrapper sizes on min-height precisely so that
// it can grow instead of clipping, so the overflow is a short scroll rather
// than a cut-off ticker.
const MIN_WIDTH = '520px'

export const ArtBox = styled.div`
  --art-column: 100%;
  --hero-chrome: ${heroChrome.full};

  position: relative;
  aspect-ratio: 820 / 560;

  /* clamp() reads MIN first and MAX last: never below MIN_WIDTH, never wider
     than the column, and the height cap in between. */
  width: clamp(
    ${MIN_WIDTH},
    calc((100vh - var(--hero-chrome)) * 1.4643),
    var(--art-column)
  );

  /* On a short window the cap makes the art narrower than the column it sits
     in. Left-aligned that left a dead strip of background against the right
     edge of the screen; pinned to the end it stays in the corner Figma puts it
     in, and the slack opens up between the copy and the art instead. */
  justify-self: end;

  /* The trust card and the paddings around it compress here and hand the art
     what they save. */
  ${media.shortViewport} {
    --hero-chrome: ${heroChrome.compact};
  }

  /* In Figma the art runs past the 1260px content column into the right
     gutter. HeroWrapper clips the overflow at the viewport edge. */
  @media (min-width: 1200px) {
    --art-column: calc(100% + 90px);
  }

  ${media.tablet} {
    /* The hero is no longer height-constrained here, so the art goes back to
       being sized purely by its column. */
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
    justify-self: center;
  }
`

export const Mascot = styled.img`
  position: absolute;
  left: 12.44%;
  top: 7.32%;
  width: 59.87%;
  height: 90%;
  max-width: 100%;
  object-fit: contain;
`

// Both cards are crops of one exported sprite, so each sits in an
// overflow-hidden frame with the shared image offset inside it.
const CardFrame = styled.div`
  position: absolute;
  overflow: hidden;
  pointer-events: none;
`

export const TopCardFrame = styled(CardFrame)`
  left: 52.8%;
  top: 2.14%;
  width: 38.93%;
  height: 50.18%;
`

export const TopCardImage = styled.img`
  position: absolute;
  top: 0;
  left: -95.19%;
  width: 195.19%;
  height: 100%;
  max-width: none;
`

export const BottomCardFrame = styled(CardFrame)`
  left: 3.78%;
  top: 46.96%;
  width: 29.39%;
  height: 21.27%;
`

export const BottomCardImage = styled.img`
  position: absolute;
  top: -95.31%;
  left: -6.31%;
  width: 214.03%;
  height: 195.31%;
  max-width: none;
`
