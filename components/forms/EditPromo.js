import BaseApi from "@/lib/api/_base.api";

import { useEffect, useState } from "react";

import React from 'react'
import Select from 'react-select' 
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import errorsService from "@/lib/services/errorsService";
import entityState from "@/lib/store/entityState";
export default function EditPromo() {
  const [durations, setDurations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [defaultInfo, setDefaultInfo] = useState();
  const [errors, setErrors] = useState({}); 
  const { modalOpen, modalInfo, setModalInfo, editInfo } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    editInfo: state.editInfo,
    setModalInfo: state.setModalInfo,
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
      console.log(error); 
    }
  }; 

  const getDefaultInfo = async() => {
    try {
      const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/promos/" + editInfo.id); 
      if(res.status === 200) {
        setDefaultInfo(res.data.data);
      }
    } catch (error) { 
      console.log(error);
    }
  };

  const getDefaultDuration = (defaultInfo) => {
    const durationOption = options.find(option => option.value === defaultInfo?.duration);
    return durationOption || null;
  };

  

  useEffect(() => {
    getDurations();

    getDefaultInfo(); 
  }, []);

  const options = durations.map((duration) => ({
    value: duration.id,
    label: duration.title,
  }));  

  const [payload, setPayload] = useState({
    title: defaultInfo?.title,
    price: defaultInfo?.price,
    status: defaultInfo?.status,
    duration: getDefaultDuration(defaultInfo), 
  });

  // This useEffect ensures that when defaultInfo changes, payload is updated
  useEffect(() => {
    setPayload({
      title: defaultInfo?.title,
      price: defaultInfo?.price,
      status: defaultInfo?.status,
      duration: getDefaultDuration(defaultInfo),
    });
  }, [defaultInfo]); 

  const onChange = (e) => {
    if (e?.target) {
      const { name, type, checked, value } = e.target;
      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else {
      // Handle select change
      setPayload((prevPayload) => ({
        ...prevPayload,
        duration: e, // e is the selected option object
      }));
    }
  }; 

  const onSubmit = () => async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    const title = e?.target?.title?.value;
    const price = e?.target?.price?.value;
    const status = e?.target?.status?.checked;
    const duration = parseInt(e?.target?.duration?.value);
    const data = {
      title, 
      price,
      status, 
      duration,
    };  
    if(duration != defaultInfo?.duration) {
      const confirm = window.confirm(`There's a change in the duration, this will affect the subscription of the subscribed members. Are you sure you want to continue?`);

      if(confirm) {
        setIsSubmitting(true)
        try {
          const res = await BaseApi.put(process.env.NEXT_PUBLIC_API_URL + "/promos/" + editInfo.id, data);
          if (res.status === 200) {
            toast.success('Promo updated successfully.', {
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
      setIsSubmitting(false)
    }else {
      try {
        const res = await BaseApi.put(process.env.NEXT_PUBLIC_API_URL + "/promos/" + editInfo.id, data);
        if (res.status === 200) {
          toast.success('Promo updated successfully.', {
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
    
  }
 
  return (
    <div>
      <form id="edit-promo" onSubmit={onSubmit()}>
        <div className="form-item mb-[15px]">
          <input
            id="title"
            className="w-full shadow-[0_0_0_1px(#727272,878787)]"
            type="text"
            name="title"
            placeholder="Promo Title"
            value={payload.title} 
            onChange={onChange}
          />
          {errorsService.findError(errors, "title") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "title").title}
            </p>
          )} 
        </div>  
        
        <div className="form-item mb-[15px]">
          <input
            id="price"
            className="w-full shadow-[0_0_0_1px(#727272,878787)]"
            type="number"
            name="price"
            placeholder="Price" 
            onChange={onChange}
            value={payload.price}
          /> 

          {errorsService.findError(errors, "price") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "price").price}
            </p> 
          )}
        </div>
        {options && (
          <div className="form-item mb-[15px]">
            <Select id="duration" name="duration" options={options} value={payload.duration} onChange={onChange} /> 
            {errorsService.findError(errors, "duration") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "duration").duration}
            </p> 
          )}  
          </div> 
        )}  
  
        <div className="form-item mb-[15px]">
          <input type="checkbox" name="status" id="status" checked={payload.status ? true : false} onChange={onChange}/>
          
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
              {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
