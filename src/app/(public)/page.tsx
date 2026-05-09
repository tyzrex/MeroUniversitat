import { LandingFeatures } from "@/modules/landing/components/landing-features";
import { LandingHero } from "@/modules/landing/components/landing-hero";

export default function Home() {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
    </>
  );
}
