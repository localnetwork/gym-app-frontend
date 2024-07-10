import BaseApi from "@/lib/api/_base.api";

import { useEffect, useState } from "react";

import React from "react";
import Select from "react-select";
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import errorsService from "@/lib/services/errorsService";
import entityState from "@/lib/store/entityState";
import useEntityState from "@/lib/store/entityState";
import avatarService from "@/lib/services/avatar";
import avatarColors from "@/lib/static-data/avatar-colors";
import avatars from "@/lib/static-data/avatars";
import persistentStore from "@/lib/store/persistentStore";
import authService from "@/lib/services/authService";
import Image from "next/image";
export default function EditMember() {
  const profile = persistentStore((state) => state.profile);
  const [durations, setDurations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [defaultInfo, setDefaultInfo] = useState();
  const [payload, setPayload] = useState({});
  const [selectedImage, setSelectedImage] = useState();

  const { modalOpen, modalInfo, setModalInfo, editInfo, clearModal } =
    modalState((state) => ({
      modalOpen: state.modalOpen,
      modalInfo: state.modalInfo,
      setModalInfo: state.setModalInfo,
      clearModal: state.clearModal,
      editInfo: state.editInfo,
    }));

  const { isMembersLoading, refetchMembers } = useEntityState((state) => ({
    isMembersLoading: state.isMembersLoading,
    refetchMembers: state.refetchMembers,
  }));

  const roles = [
    {
      roleRestrictions: [1],
      label: "Admin",
      value: 1,
    },
    {
      roleRestrictions: [1, 2],
      label: "Employee",
      value: 2,
    },
    {
      roleRestrictions: [1, 2],
      label: "Member",
      value: 3,
    },
  ];

  const filteredRoles = roles.filter((role) =>
    role.roleRestrictions.includes(profile.role)
  );

  const onSubmit = () => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let { name, email, avatar, color, role, status } = payload;
    role = parseInt(role, 10);

    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("email", email || "");
    formData.append("avatar", avatar || "");
    formData.append("color", color || "");
    formData.append("role", role || "");
    formData.append("status", status || "");
    formData.append(
      "profile_picture",
      e?.target?.profile_picture?.files[0] || selectedImage
    );

    console.log("formData", formData);

    const data = {
      name,
      email,
      avatar,
      color,
      role,
      status,
    };

    try {
      const res = await BaseApi.put(
        process.env.NEXT_PUBLIC_API_URL + "/users/" + editInfo.id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      authService.refetchProfile();
      toast.success("User updated successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setModalInfo({ modalInfo: "" });
      modalState.setState({ modalOpen: false });
      refetchMembers();
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.log("Error", error);
      setErrors(error?.data?.errors);
    }
  };

  useEffect(() => {
    authService.refetchProfile();

    const getUserInfo = async () => {
      try {
        const res = await BaseApi.get(
          process.env.NEXT_PUBLIC_API_URL + "/users/" + editInfo.id
        );
        if (res.status === 200) {
          console.log("status", res.data.status);
          setSelectedImage(res.data.profile_picture);
          setPayload({
            name: res.data.name,
            email: res.data.email,
            avatar: res.data.avatar,
            color: res.data.avatar_color,
            role: res.data.role,
            status: res.data.status,
            profile_picture: res.data.profile_picture,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
  }, []);

  const onChangeUpdate = (data) => {
    console.log("payload", payload);
    setPayload({ ...payload, ...data });
  };

  const onChange = (e) => {
    if (e?.target) {
      const { name, type, checked, value } = e.target;

      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: type === "checkbox" ? checked : value,
      }));

      if (name === "profile_picture") {
        setSelectedImage(e.target.files[0]);
      }
    } else {
      // Handle select change
      setPayload((prevPayload) => ({
        ...prevPayload,
        duration: e, // e is the selected option object
      }));
    }
  };

  return (
    <div>
      <form id="add-member" onSubmit={onSubmit()}>
        <div className="form-item mb-[15px]">
          <input
            id="name"
            className="w-full shadow-[0_0_0_1px(#727272,878787)]"
            type="text"
            name="name"
            placeholder="Name"
            value={payload.name}
            onChange={(e) => onChangeUpdate({ name: e?.target?.value })}
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
            className="w-full shadow-[0_0_0_1px(#727272,878787)]"
            type="text"
            name="email"
            value={payload.email}
            placeholder="Email"
            onChange={(e) => onChangeUpdate({ email: e?.target?.value })}
          />
          {errorsService.findError(errors, "email") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "email").email}
            </p>
          )}
        </div>

        <div className="form-item mb-[15px]">
          {selectedImage ? (
            <>
              <h3>Preview Profile Picture</h3>
              <div className="relative inline-block">
                {typeof selectedImage === "string" &&
                selectedImage.startsWith("/images") ? (
                  <Image
                    src={process.env.NEXT_PUBLIC_API_URL + selectedImage}
                    alt="Selected Profile Picture Preview"
                    width={300}
                    height={300}
                    className="max-w-[300px] max-h-[200px] h-auto object-cover mt-2 mb-2 rounded-[5px]"
                  />
                ) : (
                  selectedImage && (
                    <a
                      className="inline-block hover:opacity-50"
                      href={URL.createObjectURL(selectedImage)}
                      target="_blank"
                    >
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected Profile Picture Preview"
                        className="max-w-[300px] max-h-[200px] h-auto mt-2 object-cover mb-2 rounded-[5px]"
                      />
                    </a>
                  )
                )}

                <span
                  className="absolute top-[15px] right-[15px] p-[5px] cursor-pointer bg-white hover:bg-blue-500 rounded-full"
                  onClick={() => {
                    setSelectedImage("");
                    const input = document.getElementById("profile_picture");
                    input.value = "";
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </div>
            </>
          ) : (
            <></>
          )}

          <div
            className={`flex flex-wrap gap-[15px] ${
              selectedImage ? "!hidden" : ""
            }`}
          >
            <div className="w-full relative overflow-hidden">
              <label
                htmlFor="profile_picture"
                className="w-full flex flex-col justify-center py-[30px] items-center gap-[15px] cursor-pointer block border border-dashed text-center border-[2px] w-full border-[#727272] p-[10px] rounded-[5px]"
              >
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
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                Click to Upload Profile Picture
              </label>

              <input
                onChange={onChange}
                accept="image/webp,image/jpeg,image/png,image/jpg,image/gif"
                type="file"
                name="profile_picture"
                id="profile_picture"
                className="opacity-0 absolute top-0 left-0 h-full cursor-pointer  w-full border border-dashed text-center border-[2px] w-full border-[#e7e7e7] p-[10px] rounded-[5px]"
              />
            </div>
          </div>
        </div>

        <div className="form-item mb-[15px] select-none">
          <label>Select a role:</label>

          <div className="flex gap-[15px]">
            {filteredRoles.map((item, index) => (
              <div key={index} className="flex gap-[5px]">
                <input
                  type="radio"
                  id={`role-${item.value}`}
                  name="role"
                  value={item.value}
                  onChange={(e) =>
                    onChangeUpdate({ role: parseInt(e?.target?.value) })
                  }
                  onKeyDown={(e) =>
                    e?.key === "Enter" ? onRegisterTrigger() : null
                  }
                  checked={payload.role === item.value ? true : false}
                />
                <label
                  className="cursor-pointer"
                  htmlFor={`role-${item.value}`}
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
          {errorsService.findError(errors, "role") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "role").role}
            </p>
          )}
        </div>

        <h2 className="text-[#000] text-[20px] font-bold">Avatar Preview</h2>

        <div className="avatar-preview">
          {payload.avatar !== "" && payload.color !== "" ? (
            <div
              className="overflow-hidden text-[#333] inline-block rounded-full w-[100px] h-[100px] flex items-center justify-center mb-[30px] p-[15px]"
              style={{
                backgroundColor: avatarService.findColor(payload.color),
              }}
            >
              {avatarService.findAvatar(payload.avatar)}
            </div>
          ) : (
            <div className="text-[#7a7a7a]">{`There are no selections yet.`}</div>
          )}
        </div>

        <div className="my-[30px] h-[1px] bg-[#dbdbdb]" />
        <h2 className="text-[#000] text-[20px] font-bold ">Pick a color</h2>

        {errorsService.findError(errors, "color") && (
          <p className="text-red-500 text-xs">
            {errorsService.findError(errors, "color").color}
          </p>
        )}

        <div
          className={`form-group mt-[30px] avatar-color-selections  flex gap-x-[15px] flex-wrap mb-[10px] ${
            payload.color !== "" ? "has-avatar-color-selections" : ""
          }`}
        >
          {avatarColors.map((item, index) => (
            <div
              className="avatar-color-item mb-[15px] max-w-[50px] w-full"
              key={index}
            >
              <input
                type="radio"
                id={`color-${item.id}`}
                name="color"
                value={item.id}
                onChange={(e) => onChangeUpdate({ color: e?.target?.value })}
                onKeyDown={(e) =>
                  e?.key === "Enter" ? onRegisterTrigger() : null
                }
                checked={payload.color === item.id ? true : false}
                className="hidden"
              />
              <label
                className={`cursor-pointer h-[50px] w-[50px] block rounded-full relative ${
                  payload.color === item.id ? "border-[2px] border-black" : ""
                }`}
                htmlFor={`color-${item.id}`}
                style={{ backgroundColor: item.hex }}
              ></label>
            </div>
          ))}
        </div>

        <div className="my-[30px] h-[1px] bg-[#dbdbdb]" />

        <h2 className="text-[#000] text-[20px] font-bold">Pick your avatar</h2>

        {errorsService.findError(errors, "avatar") && (
          <p className="text-red-500 text-xs">
            {errorsService.findError(errors, "avatar").avatar}
          </p>
        )}
        <div
          className={`form-group mt-[30px] avatar-selections flex flex-wrap mb-[10px] ${
            payload.avatar === "" ? "has-avatar-selections" : ""
          }`}
        >
          {avatars.map((item, index) => (
            <div
              className="avatar-item mb-[15px] w-full max-w-[33.33%] xs:max-w-[25%] sm:max-w-[20%] md:max-w-[16.66%] px-[5px] w-full"
              key={index}
            >
              <input
                type="radio"
                id={`avatar-${item.id}`}
                name="avatar"
                value={item.id}
                onChange={(e) => onChangeUpdate({ avatar: e?.target?.value })}
                checked={payload.avatar === item.id ? true : false}
                className="hidden"
              />
              <label className="cursor-pointer" htmlFor={`avatar-${item.id}`}>
                {item.icon}
              </label>
            </div>
          ))}
        </div>

        <div className="form-item mb-[15px]">
          <input
            type="checkbox"
            name="status"
            id="status"
            checked={payload?.status ? true : false}
            onChange={onChange}
          />
          <label htmlFor="status" className="select-none cursor-pointer">
            <span className="ml-[10px]">Active</span>
          </label>

          {errorsService.findError(errors, "status") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "status").status}
            </p>
          )}
        </div>

        <div
          className="underline inline-block mb-5 cursor-pointer select-none text-[#009CFF]"
          onClick={() =>
            setModalInfo({
              id: "change-password-admin",
              title: `Change Password for ${payload.name}`,
              user_id: editInfo.id,
            })
          }
        >
          Click here to change password
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
