import Image from "next/image";
import HeroBanner from "@/components/blocks/HeroBanner";
import About from "@/components/blocks/About";
export default function Home() {
  return (
    <div>
      <HeroBanner />
      <About />
    </div>
  );
}
