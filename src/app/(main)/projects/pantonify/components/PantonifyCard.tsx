import PantonifySwatch from './PantonifySwatch';

export default function PantonifyCard() {
  return (
    // pantonify-card-wrapper: GSAP finds this by class and slides it along X (tl1/tl2)
    <div className="pantonify-card-wrapper">
      {/* card-scene: perspective wrapper — GSAP tweens height here (tl2) */}
      <div className="card-scene">
        {/* card-inner: GSAP rotates this from 0 → 180deg (tl2).
            transform-style: preserve-3d is set in SCSS. */}
        <div className="card-inner">

          {/* FRONT FACE — existing p-square content */}
          <div className="card-face card-front">
            <div className="pantonify">
              <span className="helvetica">PANTONIFY©</span>
              <span>1ED760</span>
            </div>
          </div>

          {/* BACK FACE — PantonifySwatch.
              GSAP reads .card-back scrollHeight on mount to know
              the natural height to tween card-scene to in tl2. */}
          <div className="card-face card-back">
            <PantonifySwatch />
          </div>

        </div>
      </div>
    </div>
  );
}
