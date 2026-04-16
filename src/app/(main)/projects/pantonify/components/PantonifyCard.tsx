'use client';

import { RefObject } from 'react';

// We pass refs in via a plain object rather than forwardRef because
// we need to expose three distinct refs — forwardRef only forwards one.
export interface PantonifyCardRefs {
  cardRef: RefObject<HTMLDivElement | null>;      // outer wrapper (GSAP translates x here)
  cardSceneRef: RefObject<HTMLDivElement | null>; // perspective wrapper (GSAP tweens height here)
  cardInnerRef: RefObject<HTMLDivElement | null>; // rotating wrapper (GSAP tweens rotateY here)
  backRef: RefObject<HTMLDivElement | null>;      // back face (hook reads scrollHeight for tween)
}

interface Props {
  refs: PantonifyCardRefs;
}

export default function PantonifyCard({ refs }: Props) {
  const { cardRef, cardSceneRef, cardInnerRef, backRef } = refs;

  return (
    // cardRef: GSAP slides this along X during timeline 1
    <div ref={cardRef}>
      {/* cardSceneRef: GSAP tweens height here during timeline 2.
          perspective lives on this element, not on card-inner. */}
      <div ref={cardSceneRef} className="card-scene">
        {/* cardInnerRef: GSAP rotates this from 0 → 180deg during timeline 2.
            transform-style: preserve-3d is set in SCSS. */}
        <div ref={cardInnerRef} className="card-inner">

          {/* FRONT FACE — existing p-square content */}
          <div className="card-face card-front">
            <div className="pantonify">
              <span className="helvetica">PANTONIFY©</span>
              <span>1ED760</span>
            </div>
          </div>

          {/* BACK FACE — placeholder, content TBD.
              backRef: hook reads .scrollHeight on mount to know
              the natural height to tween to. */}
          <div ref={backRef} className="card-face card-back">
            {/* Back card content goes here later */}
          </div>

        </div>
      </div>
    </div>
  );
}
