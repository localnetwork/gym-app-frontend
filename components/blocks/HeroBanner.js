import Image from "next/image";
import { Montserrat } from "next/font/google";
import Link from "next/link";

// If loading a variable font, you don't need to specify the font weight
const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function HeroBanner() {
  return (
    <div
      className={`pl-[10%] ${montserrat.className} bg-[url(/images/icon1.svg)] bg-[length:50px]`}
    >
      <div className="flex items-center">
        <div className="w-[50%]">
          <div className="bg-[#000] p-[50px] rounded-l-[10px]">
            <h1 className="text-[#fff] text-[40px] font-black  uppercase">
              ANYTIME,
            </h1>
            <h2 className="text-[#fff] text-[40px] font-black  uppercase">
              ANYWHERE.
            </h2>
            <div className="text-[#009CFF] text-[40px] font-black mb-[50px] uppercase">
              With One Kaizen
            </div>
            <Link
              href="/contact"
              className="bg-[#009CFF] text-white text-[20px] font-bold px-[30px]
              py-[10px] rounded-[6px] mt-[20px] inline-block"
            >
              {" "}
              Become a Member
            </Link>
          </div>
        </div>
        <div className="w-[50%]">
          <Image
            src="/images/heroSlide1.webp"
            alt="alt"
            width={700}
            height={500}
            className="min-h-[550px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
