import Image from "next/image"
import { Montserrat } from "next/font/google";
import Head from "next/head";
const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});  

import locations from "@/lib/static-data/locations";
import Facebook from "@/components/icons/Facebook";
import Link from "next/link";
export default function Locations() {
    return(
        <div className="bg-[#121212]">
            <div className="banner relative overflow-hidden min-h-[450px] flex items-center">
                <span className="bg-[#000] bg-opacity-50 absolute w-full h-full z-[2]" />
                <Image className="h-[450px] w-full object-cover absolute top-0 left-0 w-full h-full" src="/images/cover.jpg" height={500} width={1920} />
                <div className="container relative z-[20] text-white">
                        <h1 className={`text-[40px] font-black mb-4 ${montserrat.className}`}>
                            Locations
                        </h1>
                        <div>
                            <Link
                                target="_blank"
                                href="https://facebook.com/profile.php?id=100083270234483"
                                className="mr-[10px] hover:opacity-50 inline-flex gap-x-[5px] text-[20px]"
                                >
                                <Facebook color="#ffffff" /> One-Kaizen Fitness 
                            </Link>
                        </div>
                </div>

               
            </div>
            <div className="py-[30px]">
                <div className="container">
                    <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
                        {locations.map((item, index) => (
                            <div key={index} className="mb-5 pb-5 border-b border-[#ccc]">
                                <h2 className="font-bold text-[30px] mb-1">{item.title}</h2>
                                <p className="text-[18px] ">
                                <span className="text-[#5b5b5b] font-bold">Address:</span>{item.address}</p>
                                <div className="mt-2">
                                    <iframe src={item.mapLink} width="100%" height="250" style={{ border: 0 }} allowfullscreen="" loading="lazy"></iframe>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}