import Link from "next/link";
import Facebook from "../icons/Facebook";
import Instagram from "../icons/Instagram";
import Twitter from "../icons/Twitter";
import Youtube from "../icons/Youtube";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-[15px] text-[#121212] pt-[100px] pb-[50px] bg-[#EFF0F0]">
      <div className="flex">
        <div className="flex flex-wrap max-w-[75%] w-full">
          <div className="max-w-[33.33%] w-full">
            <h3 className="font-black text-[20px] mb-[15px] uppercase">
              Company
            </h3>
            <div className="flex flex-col">
              <div>
                <Link href="/" className="hover:underline">
                  Employee Wellness
                </Link>
              </div>
              <div>
                <Link href="/" className="hover:underline">
                  Media
                </Link>
              </div>
              <div>
                <Link href="/" className="hover:underline">
                  Careers
                </Link>
              </div>
              <div>
                <Link href="/" className="hover:underline">
                  Privacy Notice
                </Link>
              </div>
            </div>
          </div>
          <div className="max-w-[33.33%] w-full">
            <h3 className="font-black text-[20px] mb-[15px] uppercase">Gyms</h3>
            <div className="flex flex-col">
              <div>
                <Link href="/" className="hover:underline">
                  Find A Gym
                </Link>
              </div>
            </div>
          </div>
          <div className="max-w-[33.33%] w-full">
            <h3 className="font-black text-[20px] mb-[15px] uppercase">
              MEMBERS
            </h3>
            <div className="flex flex-col">
              <div>
                <Link href="/" className="hover:underline">
                  FAQs
                </Link>
              </div>
              <div>
                <Link href="/" className="hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[25%]">
          <h3 className="font-black text-[20px] mb-[15px] uppercase">
            Socials
          </h3>

          <div className="flex">
            <Link href="/" className="mr-[10px] hover:opacity-50">
              <Facebook />
            </Link>
            <Link href="/" className="mr-[10px] hover:opacity-50">
              <Instagram />
            </Link>
            <Link href="/" className="mr-[10px] hover:opacity-50">
              <Twitter />
            </Link>
            <Link href="/" className="mr-[10px] hover:opacity-50">
              <Youtube />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-[30px]">
        <p>&copy; {currentYear}. One Kaizen Fitness</p>
      </div>
    </footer>
  );
}
