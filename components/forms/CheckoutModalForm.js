import BaseApi from "@/lib/api/_base.api";
import modalState from "@/lib/store/modalState";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import FormTest from "form-data";
import errorsService from "@/lib/services/errorsService";
import { Link } from "lucide-react";
import { toast } from "react-toastify";
export default function CheckoutModalForm() {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [payload, setPayload] = useState({});
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingText, setIsLoadingText] = useState('Loading...');
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null); 

    const { modalInfo, setClearModal } = modalState((state) => ({
        modalInfo: state.modalInfo,
        setClearModal: state.setClearModal
    }));

    const fetchPaymentMethods = useCallback(async () => {
        try {
            const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/payment-methods");
            if (res.status === 200) {
                setPaymentMethods(res.data.data);
            }
        } catch (error) {
            console.log('Error', error);
            
        }
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setPayload((prevPayload) => ({
            ...prevPayload,
            [name]: name === 'payment_method' ? parseInt(value, 10) : value
        }));
        console.log('name', name)
        if (name === 'proof') {
            setSelectedImage(e.target.files[0]);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        
        const formData = new FormData();
        formData.append('payment_method', payload.payment_method || "");
        formData.append('promo', JSON.stringify(modalInfo.promo || ""));
        formData.append('proof', e?.target?.proof?.files[0] || "");
        if(payload.payment_method === 2) {
            setIsLoadingText('Redirecting to paypal...')
        }else {
            setIsLoadingText('Processing your order...')
        }
        try {
            const res = await BaseApi.post(process.env.NEXT_PUBLIC_API_URL + "/checkout", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res?.data?.approval_url) {
                router.push(res.data.approval_url);
            }else {
                router.push(`/checkout/${res.data.orderId}`)
                setClearModal(); 
            }
        } catch (error) {
            setIsLoading(false);
            if(error?.data?.errors) {
                setErrors(error.data.errors);
            }
            if(error.status === 400) {
                toast.error(error.data.error);
            }
        }
    }; 
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="bg-white rounded-[15px] mt-[15px] mb-[30px] relative shadow-[0_4px_8px_0_rgba(0,0,0,0.1)] border border-[#e7e7e7] text-[#121212] rounded-[15px] pt-[50px] p-[30px]">
                    <span className="rounded-full bg-[#280031] text-white absolute left-[15px] top-[-15px] border-[5px] border-[#fff] w-[40px] h-[40px] inline-block text-center text-[20px] font-bold bg-[#009CFF]">1</span>
                    <div className="mt-[-40px] pl-[25px] text-[#280031] text-[17px] font-bold mb-[30px]">
                        Choose a payment method
                    </div>
                    <div className="flex mx-[-7px] flex-wrap">
                        {paymentMethods.map((item, index) => (
                            <div key={index} className="w-full md:max-w-[50%] p-[7px]">
                                <input
                                    type="radio"
                                    id={`payment-method-${item.id}`}
                                    name="payment_method"
                                    value={item.id}
                                    onChange={onChange}
                                    checked={payload.payment_method === item.id}
                                    className="hidden" 
                                    hidden
                                />
                                <label
                                    htmlFor={`payment-method-${item.id}`}
                                    className={`${payload.payment_method === item.id ? '!opacity-100' : ''} block border-[2px] relative border-[#280031] min-h-[100px] pt-[5px] rounded-[15px] hover:opacity-70 w-full flex items-center justify-center cursor-pointer h-full`}
                                >
                                    {payload.payment_method === item.id && (
                                        <span className="absolute top-[5px] left-[5px] text-[10px] bg-[#280031] text-white px-[15px] py-[5px] rounded-[5px]">Selected</span>
                                    )}
                                    <Image src={process.env.NEXT_PUBLIC_API_URL + item.image} alt={item.title} width={100} height={100} />
                                </label>
                            </div>
                        ))}
                    </div>
                    {errorsService.findError(errors, "payment_method") && (
                        <p className="mt-2 text-red-500 text-xs">
                        {errorsService.findError(errors, "payment_method").payment_method}
                        </p>
                    )}
                </div>

                {payload.payment_method === 1 && (
                    <>
                        <div className="bg-white rounded-[15px] mt-[15px] mb-[30px] relative shadow-[0_4px_8px_0_rgba(0,0,0,0.1)] border border-[#e7e7e7] text-[#121212] rounded-[15px] pt-[50px] p-[30px]">
                            <span className="rounded-full bg-[#280031] text-white absolute left-[15px] top-[-15px] border-[5px] border-[#fff] w-[40px] h-[40px] inline-block text-center text-[20px] font-bold bg-[#009CFF]">2</span>
                            <div className="mt-[-40px] pl-[25px] text-[#280031] text-[17px] font-bold mb-[20px]">
                                Follow Instruction
                            </div>
                            <div className="text-center">
                                <div dangerouslySetInnerHTML={{ __html: paymentMethods.find((item) => item.id === payload.payment_method)?.instruction }} />
                                <span className="block py-[15px] font-bold text-[20px] border-t border-b border-[#ddd] my-[15px]">
                                    OR
                                </span>
                                <div className="flex justify-center">
                                    <Image width={250} height={250} src={process.env.NEXT_PUBLIC_API_URL + `${paymentMethods.find((item) => item.id === payload.payment_method)?.image_instruction}`} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[15px] mt-[15px] mb-[30px] relative shadow-[0_4px_8px_0_rgba(0,0,0,0.1)] border border-[#e7e7e7] text-[#121212] rounded-[15px] pt-[50px] p-[30px]">
                            <span className="rounded-full bg-[#280031] text-white absolute left-[15px] top-[-15px] border-[5px] border-[#fff] w-[40px] h-[40px] inline-block text-center text-[20px] font-bold bg-[#009CFF]">3</span>
                            <div className="mt-[-40px] pl-[25px] text-[#280031] text-[17px] font-bold mb-[20px]">
                                Upload proof
                            </div>

                            {selectedImage && (
                                <div className="w-full">
                                    <a className="inline-block hover:opacity-50" href={URL.createObjectURL(selectedImage)} target="_blank">
                                        <img src={URL.createObjectURL(selectedImage)} alt="Selected Proof Preview" className="max-w-[300px] max-h-[200px] h-auto mt-2 mb-2" />
                                    </a>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-[15px]">
                                <div className="w-full">
                                    {/* <label htmlFor="proof" className="block text-[#280031] font-bold mb-[10px]">Upload Proof</label> */}
                                    <input onChange={onChange} accept="image/webp,image/jpeg,image/png,image/jpg,image/gif" type="file" name="proof" id="proof" className="w-full border border-dashed text-center border-[2px] w-full border-[#e7e7e7] p-[10px] rounded-[5px]" />
                                </div>
                            </div>

                            {errorsService.findError(errors, "proof") && (
                                <p className="mt-2 text-red-500 text-xs">
                                {errorsService.findError(errors, "proof").proof}
                                </p>
                            )}
                        </div>
                    </>
                )}

                <button type="submit" className={`bg-[#009CFF] text-black text-[20px] font-bold px-[30px] py-[10px] rounded-[6px] mt-[20px] inline-block ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isLoading ? isLoadingText : 'Submit'}
                </button>
            </form>
        </div>
    );
} 