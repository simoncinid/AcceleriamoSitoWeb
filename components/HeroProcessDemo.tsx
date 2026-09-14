import { MotionScene } from "./MotionScene";
import { HeroStory } from "./StoryVisuals";

export function HeroProcessDemo() {
  return (
    <MotionScene className="hero-process" label="Come passano i dati tra i tuoi programmi">
      <div className="hero-process__caption"><span className="signal-square" />Come funziona</div>
      <p className="hero-process__heading">Dai documenti ai tuoi programmi</p>
      <HeroStory />
    </MotionScene>
  );
}
