import BaseApi from "@/lib/api/_base.api";

import { useEffect, useState } from "react";

import React from 'react'
import Select from 'react-select' 
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import errorsService from "@/lib/services/errorsService";
import entityState from "@/lib/store/entityState";
export default function ChangePasswordAdmin() {
  const [durations, setDurations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [errors, setErrors] = useState({}); 
  const [defaultInfo, setDefaultInfo] = useState(); 
  const { modalOpen, modalInfo, setModalInfo, editInfo, clearModal } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    setModalInfo: state.setModalInfo,
    clearModal: state.clearModal,
    editInfo: state.editInfo,
  })); 

  const { refetchPromos, isPromosLoading } = entityState((state) => ({
    refetchPromos: state.refetchPromos,
    isPromosLoading: state.isPromosLoading, 
  })); 

  const getDurations = async() => {
    try {
      const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/membership-durations"); 
      if(res.status === 200) {
        setDurations(res.data.data);
      }
    } catch (error) { 
      console.log('Error', error);
    }
  }; 
  useEffect(() => {
    getDurations();
  }, []);

  const options = durations.map((duration) => ({
    value: duration.id,
    label: duration.title,
  }));  

  const onSubmit = () => async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    const data = {
      password: e?.target?.password?.value,
      confirm_password: e?.target?.confirm_password?.value,
    }; 
 
    try {
      const res = await BaseApi.put(process.env.NEXT_PUBLIC_API_URL + "/change-password-admin", data);
      if (res.status === 200) {
        toast.success('Password changed successfully.', {
          position: "top-right", 
          autoClose: 3000,
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
      <form id="add-promo" onSubmit={onSubmit()}> 
        
        <div className="form-item mb-[15px]">
          <input
            id="password"
            className="w-full shadow-[0_0_0_1px(#727272,878787)]"
            type="password"
            name="password"
            placeholder="Password" 
          /> 

          {errorsService.findError(errors, "password") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "password").password}
            </p> 
          )}
        </div>

        <div className="form-item mb-[15px]">
          <input
            id="confirm_password"
            className="w-full shadow-[0_0_0_1px(#727272,878787)]"
            type="password"
            name="confirm_password"
            placeholder="Confirm Password" 
          /> 

          {errorsService.findError(errors, "confirm_password") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "confirm_password").confirm_password}
            </p> 
          )}
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
