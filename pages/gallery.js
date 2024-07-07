import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});   

import gallery from "@/lib/static-data/gallery";
import Image from "next/image";

export default function Gallery() {
    function groupByThree(array) {
        const groupedArray = [];
        for (let i = 0; i < array.length; i += 3) {
            groupedArray.push(array.slice(i, i + 3));
        }
        return groupedArray;
    }


    const test = groupByThree(gallery);

    const isOdd = (num) => num % 2 === 1;
    return(
        <div className="py-[30px]">
            <div className="container">
                <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
                    <h1 className={`text-[40px] font-black text-black ${montserrat.className}`}>
                        Gallery
                    </h1>

                    <div className="">
                        {test.map((group, index) => {
                            const stat = isOdd(index);
                            return(
                                <div key={index} className={`group mb-[10px] mx-[-5px] flex flex-wrap ${stat ? 'flex-row-reverse' : ''}`}>
                                    <div className="left flex-col flex gap-[10px] px-[5px] w-full max-w-[40%]">
                                        <div className="w-full">
                                            <Image src={group[0].url} alt="alt" width={600} height={400} className="h-[200px] w-full block object-cover" />
                                        </div>
                                        <div className="w-full ">
                                            <Image src={group[1].url} alt="alt" width={600} height={400} className="h-[200px] w-full block object-cover" />
                                        </div>
                                    </div>

                                    {group[2]?.url && (
                                        <div className="right px-[5px] w-full max-w-[60%]">
                                            <Image src={group[2]?.url} alt="alt" width={600} height={400} className="h-[410px] w-full block object-cover" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )   
}