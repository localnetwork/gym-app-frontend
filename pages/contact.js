import BaseApi from "@/lib/api/_base.api";
import errorsService from "@/lib/services/errorsService";
import { Montserrat } from "next/font/google";
import { useState } from "react";
import { toast } from "react-toastify";
const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});


export default function Contact() {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); 
        
        const data = {
            email: e?.target?.email?.value,
            name: e?.target?.name?.value,
            subject: e?.target?.subject?.value,
            message: e?.target?.message?.value,
        };
    
        try {
            const res = await BaseApi.post(process.env.NEXT_PUBLIC_API_URL + "/contact-inquire", data);
            
            // Reset the form
            e.target.reset();
            setLoading(false)
    
            // Show success toast
            toast.success('Inquiry sent successfully.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true, 
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
    
        } catch (error) {
            console.error("Error", error);
            if (error?.data?.errors) {
                setErrors(error?.data?.errors);
            }
            setLoading(false)
        }
    }; 
    return(
        <div class="py-[30px]">
            <div class="container">
                <div class="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
                    <h1 className={`text-[40px] font-black text-black ${montserrat.className}`}>
                        Contact Us
                    </h1>

                    <form onSubmit={onSubmit}>
                        <div className="form-item mb-[15px]">
                            <input
                                id="name"
                                className="!bg-white w-full shadow-[0_0_0_1px(#727272,878787)]"
                                type="text"
                                name="name"
                                placeholder="Name"
                            />
                            {errorsService.findError(errors, "name") && (
                                <p className="mt-2 text-red-500 text-xs">
                                {errorsService.findError(errors, "name").name}
                                </p>
                            )} 
                        </div>
                        <div className="form-item mb-[15px]">
                            <input
                                id="email"
                                className="!bg-white w-full shadow-[0_0_0_1px(#727272,878787)]"
                                type="text"
                                name="email"
                                placeholder="Email"
                            />
                            {errorsService.findError(errors, "email") && (
                                <p className="mt-2 text-red-500 text-xs">
                                {errorsService.findError(errors, "email").email}
                                </p>
                            )} 
                        </div>

                        <div className="form-item mb-[15px]">
                            <input
                                id="subject"
                                className="!bg-white w-full shadow-[0_0_0_1px(#727272,878787)]"
                                type="text"
                                name="subject"
                                placeholder="Subject"
                            />
                            {errorsService.findError(errors, "subject") && (
                                <p className="mt-2 text-red-500 text-xs">
                                {errorsService.findError(errors, "subject").subject}
                                </p>
                            )} 
                        </div>
                        <div className="form-item mb-[15px]">
                            <textarea
                                id="message"
                                className="form-control min-h-[150px] p-[15px] rounded-[5px] border border-black !bg-white w-full shadow-[0_0_0_1px(#727272,878787)] !bg-white w-full shadow-[0_0_0_1px(#727272,878787)]"
                                name="message"
                                placeholder="Message"
                            />
                            {errorsService.findError(errors, "message") && (
                                <p className="mt-2 text-red-500 text-xs">
                                {errorsService.findError(errors, "message").message}
                                </p>
                            )} 
                        </div>

                        <button className="flex px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase">
                            {loading && (
                                    <svg
                                    className="animate-spin mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="#333"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="#000"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                    </svg>
                                )} 
                                {loading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}