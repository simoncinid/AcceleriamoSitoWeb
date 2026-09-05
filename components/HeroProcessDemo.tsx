import { MotionScene } from "./MotionScene";
import { HeroStory } from "./StoryVisuals";

export function HeroProcessDemo() {
  return (
    <MotionScene className="hero-process" label="Esempio: preventivo per un grossista">
      <div className="hero-process__caption"><span className="signal-square" />Un esempio concreto</div>
      <p className="hero-process__heading">Dal cliente al preventivo</p>
      <HeroStory />
    </MotionScene>
  );
}
