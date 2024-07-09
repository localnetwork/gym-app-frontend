
import Head from "next/head";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
}); 

 
export default function Privacy() {
    return(
        <div className="py-[30px] px-[15px]">
            <Head>
            <title>
                Privacy Notice
            </title>
            </Head>
            <div className="container">
                <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
                    <div className="flex flex-wrap items-center justify-between gap-[15px] mb-[30px]">
                        <h1 className={`text-[40px] font-black text-black ${montserrat.className}`}>
                            Privacy Notice
                        </h1>
                    </div>

                    <p>
                        <h2 className="font-bold text-[20px] text-[#666] mb-2">Sample Heading Here</h2>
                    </p>
                    <p>
                        {`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
                    </p>
                    <p>
                        <h2 className="font-bold text-[20px] text-[#666] mb-2">Sample Heading Here</h2>
                    </p>
                    <p>
                        {`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
                    </p>
                    <p>
                        <h2 className="font-bold text-[20px] text-[#666] mb-2">Sample Heading Here</h2>
                    </p>
                    <p>
                        {`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
                    </p>
                    <p>
                        <h2 className="font-bold text-[20px] text-[#666] mb-2">Sample Heading Here</h2>
                    </p>
                    <p>
                        {`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
                    </p>
                </div>
            </div>
        </div>
    )
}