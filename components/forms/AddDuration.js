import BaseApi from "@/lib/api/_base.api";

import { useEffect, useState } from "react";

import React from "react";
import Select from "react-select";
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import errorsService from "@/lib/services/errorsService";
import entityState from "@/lib/store/entityState";
import helper from "@/lib/scrap/helper";
import useEntityState from "@/lib/store/entityState";
export default function AddDuration() {
  const [durations, setDurations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [defaultInfo, setDefaultInfo] = useState();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [activePromos, setActivePromos] = useState([]);
  const [data, setData] = useState({});

  const { modalOpen, modalInfo, setModalInfo, editInfo, clearModal } =
    modalState((state) => ({
      modalOpen: state.modalOpen,
      modalInfo: state.modalInfo,
      setModalInfo: state.setModalInfo,
      clearModal: state.clearModal,
      editInfo: state.editInfo,
    }));

  const { refetchmembershipDurations } = useEntityState((state) => ({
    refetchmembershipDurations: state.refetchmembershipDurations,
  }));

  useEffect(() => {
    setData((prevPayload) => ({
      ...prevPayload,
      availed_by: modalInfo.memberId,
    }));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await BaseApi.post(
        process.env.NEXT_PUBLIC_API_URL + "/membership-durations",
        data
      );
      if (res.status === 200) {
        toast.success("Duration added successfully.", {
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
        refetchmembershipDurations();
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);

      if (error && error.status === 422) {
        console.log("error.data.errors", error.data.errors);
        setErrors(error.data.errors); // Access errors from response.data
      } else {
        console.error("Error:", error);
      }
    }
  };

  const onChange = (e) => {
    setData((prevPayload) => ({
      ...prevPayload,
      availed_by: modalInfo.memberId,
    }));
    if (e?.target) {
      const { name, type, checked, value } = e.target;
      setData((prevPayload) => ({
        ...prevPayload,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (e?.value) {
      // Handle select change
      const { name, value } = e;

      if (!name) {
        setData((prevPayload) => ({
          ...prevPayload,
          payment_method: parseInt(value),
        }));
      } else {
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
        <div className="form-item mb-[15px]">
          <input
            id="title"
            className="w-full shadow-[0_0_0_1px(#727272,878787)]"
            type="text"
            name="title"
            placeholder="Title"
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
            id="duration"
            className="w-full shadow-[0_0_0_1px(#727272,878787)]"
            type="text"
            name="duration"
            placeholder="Duration (Number of days)"
            onChange={onChange}
          />
          {errorsService.findError(errors, "duration") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "duration").duration}
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
