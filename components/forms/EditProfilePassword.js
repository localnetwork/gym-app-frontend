import BaseApi from "@/lib/api/_base.api";
import { useEffect, useState } from "react";
import persistentStore from "@/lib/store/persistentStore";
import { toast } from "react-toastify";
import errorsService from "@/lib/services/errorsService";
import authService from "@/lib/services/authService";
import modalState from "@/lib/store/modalState";
export default function EditProfilePassword() {
  const [payload, setPayload] = useState({
    current_password: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const { modalOpen, modalInfo, setModalInfo } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    setModalInfo: state.setModalInfo,
  }));
  const onSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    // Clear previous errors
    setErrors([]);

    try {
      const res = await BaseApi.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/password`,
        payload
      );
      e.target.reset();

      toast.success("Password updated successfully");
      setErrors([]);
      setPayload({});
      setIsLoading(false);
      authService.refetchProfile();
      setModalInfo({
        id: "offer-logout",
        title: `You've changed your password. Do you want to login with your new password?`,
      });
      modalState.setState({ modalOpen: true });
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
      setErrors(error.data.errors);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    console.log("value", value);
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <form id="profile-password" onSubmit={onSubmit}>
        <div className="profile-info rounded-[5px] overflow-hidden">
          <div
            className="bg-[#323232] select-none cursor-pointer flex justify-between p-[15px] text-[20px] font-bold"
            onClick={toggleAccordion}
          >
            <h2 className="flex items-center gap-x-[5px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                />
              </svg>
              Update Password
            </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class={`size-6 transition ${isOpen ? "rotate-180" : ""}`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              ></path>
            </svg>
          </div>
          {isOpen && (
            <div className="bg-[#121212] p-[15px]">
              <div className="form-item mb-[15px] flex flex-col">
                <label htmlFor="password" className="mb-3">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="max-w-[350px]"
                  onChange={onChange}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {errorsService.findError(errors, "password") && (
                  <p className="mt-2 text-red-500 text-xs">
                    {errorsService.findError(errors, "password").password}
                  </p>
                )}
              </div>
              <div className="form-item mb-[15px] flex flex-col">
                <label htmlFor="confirm_password" className="mb-3">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  className="max-w-[350px]"
                  onChange={onChange}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {errorsService.findError(errors, "confirm_password") && (
                  <p className="mt-2 text-red-500 text-xs">
                    {
                      errorsService.findError(errors, "confirm_password")
                        .confirm_password
                    }
                  </p>
                )}
              </div>

              <div className="form-item mb-[15px] flex flex-col">
                <label htmlFor="current_password" className="mb-3">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  id="current_password"
                  className="max-w-[350px]"
                  onChange={onChange}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {errorsService.findError(errors, "current_password") && (
                  <p className="mt-2 text-red-500 text-xs">
                    {
                      errorsService.findError(errors, "current_password")
                        .current_password
                    }
                  </p>
                )}
              </div>

              <div className="form-actions">
                {console.log("isLoading", isLoading)}
                <button className="inline-flex max-w-[180px] mt-[15px] px-[30px] items-center justify-center hover:bg-green-600 text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-green-500 py-[10px] text-black text-uppercase w-full">
                  {isLoading && (
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
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
