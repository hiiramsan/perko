import HeroSection from "@/components/landingPage/HeroSection";
import HowItWorks from "@/components/landingPage/HowItWorks";
import SocialProof from "@/components/landingPage/SocialProof";
import ActionSection from "@/components/landingPage/ActionSection";
import FaqSection from "@/components/landingPage/FaqSection";
import FooterSection from "@/components/landingPage/FooterSection";

export default function Home() {


  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f8fa]">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <HeroSection />
      <HowItWorks />
      <SocialProof />
      <FaqSection />
      {/* <ActionSection /> */}
      <FooterSection />
    </main>
  );
}
