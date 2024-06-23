import BaseApi from "@/lib/api/_base.api";

import { useEffect, useState } from "react";

import React from 'react'
import Select from 'react-select' 
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
export default function EditMember() {
  const profile = persistentStore((state) => state.profile); 
  const [durations, setDurations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [errors, setErrors] = useState({});  
  const [defaultInfo, setDefaultInfo] = useState(); 
  const [payload, setPayload] = useState({
  })
  const { modalOpen, modalInfo, setModalInfo, editInfo, clearModal } = modalState((state) => ({
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
      roleRestrictions: [1,2],
      label: "Employee", 
      value: 2,
    },
    {
      roleRestrictions: [1, 2],
      label: "Member",
      value: 3, 
    }
  ] 

  const filteredRoles = roles.filter((role) => role.roleRestrictions.includes(profile.role));

  const onSubmit = () => async (e) => {
    e.preventDefault();
    setIsSubmitting(true)

    let { name, email, avatar, color, role, status } = payload;
    role = parseInt(role, 10);  
    const data = {
      name,  
      email, 
      avatar,  
      color,
      role,
      status
    };  

    try {
      const res = await BaseApi.put(process.env.NEXT_PUBLIC_API_URL + "/users/" + editInfo.id, data);
      if (res.status === 200) {
        authService.refetchProfile(); 
        toast.success('User updated successfully.', {
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
        refetchMembers(); 
        setIsSubmitting(false)
      }  
    } catch (error) {  
      setIsSubmitting(false) 
      console.log('Error', error)
      if(error.status === 422) {
        setErrors(error.data.errors);
      }
    }
  }

  useEffect(() => {
    authService.refetchProfile(); 

    const getUserInfo = async() => {
        try {
          const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/users/" + editInfo.id); 
          if(res.status === 200) {
          console.log('status', res.data.status)
            
            setPayload({
              name: res.data.name,
              email: res.data.email,
              avatar: res.data.avatar,
              color: res.data.avatar_color, 
              role: res.data.role,
              status: res.data.status,
            }) 
          }
        } catch (error) { 
          console.log(error);
        }
      }  
    getUserInfo(); 
  }, []);

  const onChangeUpdate = (data) => {

    console.log('payload', payload)
    setPayload({ ...payload, ...data });
  }

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
            onChange={(e) =>
              onChangeUpdate({ name: e?.target?.value })
            }
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
            onChange={(e) =>
              onChangeUpdate({ email: e?.target?.value })
            }
          />
          {errorsService.findError(errors, "email") && (
            <p className="mt-2 text-red-500 text-xs">
              {errorsService.findError(errors, "email").email}
            </p>
          )}
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

        <h2 className="text-[#000] text-[20px] font-bold">
              Avatar Preview
        </h2>

          <div className="avatar-preview">
            {payload.avatar !== "" &&
            payload.color !== "" ? (
              <div
                className="overflow-hidden text-[#333] inline-block rounded-full w-[100px] h-[100px] flex items-center justify-center mb-[30px] p-[15px]"
                style={{
                  backgroundColor: avatarService.findColor(
                    payload.color
                  ),
                }}
              >
                {avatarService.findAvatar(payload.avatar)}
              </div>
            ) : (
              <div className="text-[#7a7a7a]">{`There are no selections yet.`}</div>
            )}
          </div>

            <div className="my-[30px] h-[1px] bg-[#dbdbdb]" />
            <h2 className="text-[#000] text-[20px] font-bold ">
              Pick a color
            </h2>

            {errorsService.findError(errors, "color") && (
              <p className="text-red-500 text-xs">
                {errorsService.findError(errors, "color").color}
              </p>
            )} 

            <div
              className={`form-group mt-[30px] avatar-color-selections  flex gap-x-[15px] flex-wrap mb-[10px] ${
                payload.color !== ""
                  ? "has-avatar-color-selections" 
                  : ""
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
                    onChange={(e) =>
                      onChangeUpdate({ color: e?.target?.value })
                    }
                    onKeyDown={(e) =>
                      e?.key === "Enter" ? onRegisterTrigger() : null
                    }
                    checked={
                      payload.color === item.id ? true : false
                    }
                    className="hidden"
                  />
                  <label
                    className={`cursor-pointer h-[50px] w-[50px] block rounded-full relative ${
                      payload.color === item.id
                        ? "border-[2px] border-black"
                        : ""
                    }`}
                    htmlFor={`color-${item.id}`}
                    style={{ backgroundColor: item.hex }}
                  ></label>
                </div>
              ))}
            </div>

            <div className="my-[30px] h-[1px] bg-[#dbdbdb]" />

            <h2 className="text-[#000] text-[20px] font-bold">
              Pick your avatar
            </h2>

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
                    onChange={(e) =>
                      onChangeUpdate({ avatar: e?.target?.value })
                    }
                    checked={payload.avatar === item.id ? true : false}
                    className="hidden"
                  />
                  <label
                    className="cursor-pointer"
                    htmlFor={`avatar-${item.id}`}
                  >
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
