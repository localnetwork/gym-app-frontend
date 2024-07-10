import BaseApi from "@/lib/api/_base.api";
import { useEffect, useState } from "react";
import persistentStore from "@/lib/store/persistentStore";
import { toast } from "react-toastify";
import errorsService from "@/lib/services/errorsService";
import authService from "@/lib/services/authService";
export default function EditProfile() {
  const [payload, setPayload] = useState({
    current_password: "",
    name: "",
    email: "",
  });
  const profile = persistentStore((state) => state.profile);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [isOpen, setIsOpen] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    // Clear previous errors
    setErrors([]);

    try {
      const res = await BaseApi.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        payload
      );
      e.target.reset();

      toast.success("Profile updated successfully");
      setErrors([]);
      setPayload({
        current_password: "",
        name: profile?.name || "",
        email: profile?.email || "",
      });
      setIsLoading(false);
      authService.refetchProfile();
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

  useEffect(() => {
    setPayload({
      current_password: "",
      name: profile?.name || "",
      email: profile?.email || "",
    });
  }, [profile]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="mb-5">
      <form id="profile-info" onSubmit={onSubmit}>
        <div className="profile-info rounded-[5px] overflow-hidden ">
          <div
            className="bg-[#323232] select-none cursor-pointer flex justify-between p-[15px] text-[20px] font-bold"
            onClick={toggleAccordion}
          >
            <h2 className="flex gap-x-[5px] items-center">
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              Profile Information
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
                <label htmlFor="name" className="mb-3">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="max-w-[350px]"
                  value={payload?.name}
                  onChange={onChange}
                />
                {errorsService.findError(errors, "name") && (
                  <p className="mt-2 text-red-500 text-xs">
                    {errorsService.findError(errors, "name").name}
                  </p>
                )}
              </div>
              <div className="form-item mb-[15px] flex flex-col">
                <label htmlFor="email" className="mb-3">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="max-w-[350px]"
                  value={payload?.email}
                  onChange={onChange}
                />
                {errorsService.findError(errors, "email") && (
                  <p className="mt-2 text-red-500 text-xs">
                    {errorsService.findError(errors, "email").email}
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
