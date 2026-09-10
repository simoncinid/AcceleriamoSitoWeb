import { MotionScene } from "./MotionScene";
import { HeroStory } from "./StoryVisuals";

export function HeroProcessDemo() {
  return (
    <MotionScene className="hero-process" label="Esempio: 30 articoli chiesti via email a un grossista">
      <div className="hero-process__caption"><span className="signal-square" />Un esempio concreto</div>
      <p className="hero-process__heading">Il cliente chiede 30 articoli via email</p>
      <HeroStory />
    </MotionScene>
  );
}
