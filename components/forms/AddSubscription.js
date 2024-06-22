import BaseApi from "@/lib/api/_base.api";

import { useEffect, useState } from "react";

import React from 'react'
import Select from 'react-select' 
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import errorsService from "@/lib/services/errorsService";
import entityState from "@/lib/store/entityState";
export default function AddSubscription() {
  const [durations, setDurations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [errors, setErrors] = useState({}); 
  const [defaultInfo, setDefaultInfo] = useState(); 
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [activePromos, setActivePromos] = useState([]);

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
      const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/promos"); 
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
  }, []);

  const promosOptions = activePromos.map((promo) => ({
    value: promo.id,
    label: promo.title,
  }));   

  const paymentMethodsOptions = paymentMethods.map((paymentMethod) => ({
    value: paymentMethod.id,
    label: paymentMethod.title,
  }));


  console.log('modalInfo', modalInfo?.memberId)
  const onSubmit = () => async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    const status = e?.target?.status?.checked; 
    const promo = parseInt(e?.target?.promo?.value);
    const payment_method = parseInt(e?.target?.payment_method?.value);
    const availed_by = modalInfo?.memberId; 
    const data = {
      status, 
      promo,
      availed_by, 
      payment_method
    }; 
 
    try {
      const res = await BaseApi.post(process.env.NEXT_PUBLIC_API_URL + "/subscriptions", data);
      if (res.status === 200) {
        toast.success('Promo added successfully.', {
          position: "top-right", 
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true, 
          pauseOnHover: true,
          draggable: true, 
          progress: undefined, 
          theme: "light", 
        }); 
        setModalInfo({ modalInfo: "", })
        modalState.setState({ modalOpen: false }) 
        refetchPromos(); 
        setIsSubmitting(false)
      } 
    } catch (error) {  
      setIsSubmitting(false) 
      if(error.status === 422) {
        setErrors(error.data.errors);
      }
    }
  }
 
  return (
    <div>
      <form id="add-subscription" onSubmit={onSubmit()}>
        
        <label>Payment Method</label>
        {paymentMethodsOptions && (
          <div className="form-item mb-[15px]">
            <Select id="payment_method" name="payment_method" options={paymentMethodsOptions} placeholder={"Select a payment method"} /> 
            {errorsService.findError(errors, "payment_method") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "payment_method").payment_method}
            </p> 
          )} 
          </div>  
        )}  

        <label>Promo</label>
        {promosOptions && (
          <div className="form-item mb-[15px]">
            <Select id="promo" name="promo" options={promosOptions} placeholder={"Select a promo"} /> 
            {errorsService.findError(errors, "promo") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "promo").promo}
            </p> 
          )} 
          </div>  
        )}  

        <div className="form-item mb-[15px]">
          <input type="checkbox" name="status" id="status" />
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
