import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const menuLinks = [
    {
      name: "Trainings",
      url: "/trainings",
    },
    {
      name: "Why Join Us",
      url: "/why-join",
    },
    {
      name: "Contact Us",
      url: "/contact",
    },
  ];
  return (
    <header className="shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]">
      <div className="py-[10px] px-[30px] bg-[#000] ">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo-white.webp" alt="alt" width={70} height={70} />
            <Image
              src="/logo-text.webp"
              alt="alt"
              width={150}
              height={100}
              className="h-[30px] w-auto ml-[10px]"
            />
          </Link>
          <div>
            {/* <Link href="/trainings">Trainings</Link> */}
            {menuLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-white text-[20px] font-bold cursor-pointer hover:text-[#009CFF] px-[20px]"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div>
            <Link
              href="/login"
              className="flex px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full  "
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
