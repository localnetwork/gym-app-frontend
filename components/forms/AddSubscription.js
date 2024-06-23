import BaseApi from "@/lib/api/_base.api";

import { useEffect, useState } from "react";

import React from 'react'
import Select from 'react-select' 
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import errorsService from "@/lib/services/errorsService";
import entityState from "@/lib/store/entityState";
import helper from "@/lib/scrap/helper";
export default function AddSubscription() {
  const [durations, setDurations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [errors, setErrors] = useState({}); 
  const [defaultInfo, setDefaultInfo] = useState(); 
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [activePromos, setActivePromos] = useState([]);
  const [data, setData] = useState({
  }); 

  const { modalOpen, modalInfo, setModalInfo, editInfo, clearModal } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    setModalInfo: state.setModalInfo,
    clearModal: state.clearModal,
    editInfo: state.editInfo,
  })); 

  const { refetchMembers } = entityState((state) => ({
    refetchMembers: state.refetchMembers,
  })); 

  const getPromos = async() => {
    try {
      const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/member-promos"); 
      if(res.status === 200) {
        setActivePromos(res.data.data);
      }
    } catch (error) { 
      console.log('Error', error);
    }
  }; 

  const getPaymentMethods = async() => {
    try {
      const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/payment-methods"); 
      if(res.status === 200) {
        setPaymentMethods(res.data.data);
      }
    } catch (error) { 
      console.log('Error', error);
    }
  
  }
  useEffect(() => {
    getPromos();
    getPaymentMethods(); 
    setData((prevPayload) => ({
      ...prevPayload,
      availed_by: modalInfo.memberId,
    }))  
  }, []);

  const paymentMethodsOptions = paymentMethods.map((paymentMethod) => ({
    value: paymentMethod.id,
    label: paymentMethod.title,
  }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const res = await BaseApi.post(process.env.NEXT_PUBLIC_API_URL + "/subscriptions", data);
      if (res.status === 200) {
        toast.success('Subscription added successfully.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setModalInfo(""); // Adjust setting modalInfo
        modalState.setState({ modalOpen: false });
        refetchMembers(); // Adjust the refetch method
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);

      if (error && error.status === 422) {
        console.log('error.data.errors', error.data.errors)
        setErrors(error.data.errors); // Access errors from response.data
      } else {
        console.error('Error:', error);
      }
    }
  }; 

  const onChange = (e) => {
    setData((prevPayload) => ({
      ...prevPayload,
      availed_by: modalInfo.memberId,
    }))  
    if (e?.target) {
      const { name, type, checked, value } = e.target;
      setData((prevPayload) => ({
        ...prevPayload,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else if (e?.value) { // Handle select change
      const { name, value } = e;
      
      if(!name) { 
        setData((prevPayload) => ({
          ...prevPayload,
          payment_method: parseInt(value),
        }));
      }else {
        setData((prevPayload) => ({
          ...prevPayload,
          [name]: value,
        })); 
      }
    }
  }; 

 
  return (
    <div>
      <form id="add-subscription" onSubmit={onSubmit}>
        
        <label>Payment Method</label>
        {paymentMethodsOptions && (
          <div className="form-item mb-[30px]">
            <Select id="payment_method" name="payment_method" onChange={onChange} options={paymentMethodsOptions} placeholder={"Select a payment method"} /> 
            {errorsService.findError(errors, "payment_method") && (
              <p className="mt-2 text-red-500 text-xs">
                {errorsService.findError(errors, "payment_method").payment_method}
              </p> 
            )} 
          </div>  
        )}  

        <div className="form-item mb-[15px]">
          <label className="mb-[5px] block">Choose a plan:</label>
          <div className="flex flex-wrap mx-[-7px]">
          {activePromos.map((item, index) => (
            <div key={index} className="w-full px-[7px] mb-[15px] max-w-[50%] relative">
              <label className={`cursor-pointer block font-bold border-[3px] border-green-500 bg-green-100 text-[#00491b] px-[20px] py-[30px] rounded-[15px] ${parseInt(data?.promo) === item?.id ? "!bg-green-500 !text-black" : ""}`} key={index} htmlFor={`plan-${item.id}`}>
              <input type="radio" name="promo" id={`plan-${item.id}`} value={parseInt(item.id)} className="hidden" onChange={onChange} />
              {parseInt(data?.promo) === item?.id && (
                <span className="absolute top-[5px] left-[15px] text-[12px] bg-green-200 px-[5px] rounded-[5px]">
                  Selected
                </span>
              )} 
              <span className="text-[20px]">{item.title}</span>

              {/* item.price */}
              <div>
              {helper.priceFormatter(item.price)}
              </div>
            </label>
            </div>
          ))}
          </div>
          {errorsService.findError(errors, "promo") && (
              <p className="mt-2 text-red-500 text-xs">
                {errorsService.findError(errors, "promo").promo}
              </p> 
            )}  
        </div>

        <div className="form-item mb-[15px]">
          <input type="checkbox" name="status" id="status" onChange={onChange} />
          <label htmlFor="status" className="select-none cursor-pointer">
            <span className="ml-[10px]">Active</span>
          </label> 
        </div>

        <button className="flex px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full">
        {isSubmitting && (
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
              {isSubmitting ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
