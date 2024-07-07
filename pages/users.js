import { useEffect } from "react";
import Head from "next/head";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
}); 

import useEntityState from "@/lib/store/entityState";
import avatarService from "@/lib/services/avatar"; 
import modalState from "@/lib/store/modalState";
import persistentStore from "@/lib/store/persistentStore";
import authService from "@/lib/services/authService";
import Image from "next/image";
import Link from "next/link";

export default function Members() {

  const profile = persistentStore((state) => state.profile);
  
  const { modalOpen, modalInfo, setModalInfo } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    setModalInfo: state.setModalInfo,
  })); 


  const { members, isMembersLoading, refetchMembers } = useEntityState((state) => ({
    members: state.members,
    isMembersLoading: state.isMembersLoading,
    refetchMembers: state.refetchMembers,
  }));  
  
  useEffect(() => {
    refetchMembers();
  } , [refetchMembers]);

  return (
    <div className="py-[30px]">
        <Head>
          <title>
            Members
          </title> 
        </Head>
        <div className="container">
          <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
            <div className="flex flex-wrap items-center justify-between gap-[15px] mb-[30px]">
              <h1
                className={`text-[40px] font-black text-black ${montserrat.className}`}
              >
                Members
              </h1>
              <button
                className="inline-flex max-w-[250px] px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full"
                onClick={() => {
                  setModalInfo({
                    id: "add-member", 
                    title: "Add Member",
                  });
                  modalState.setState({ modalOpen: true });
                }}
              >
                Add Member
              </button>
            </div> 
              
            <div>
              <Link href="/deleted-users" className="hover:underline inline-block mb-3 text-red-700 font-bold">
                View Deleted Users
              </Link>
            </div> 
            {isMembersLoading ? (
              <div>
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="animate-pulse flex space-x-4">
                    <div className="rounded-lg bg-gray-300 h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div> 
                {members?.length === 0 && (
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[150px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                    </svg>
                    <h2 className="text-xl font-bold">No promos available at the moment. Please try again later.</h2>
                  </div>   
                )} 
                {members?.map((member, index) => (
                  <div key={index} className={`mb-4 bg-[#fff] hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] hover:border-[#ccc] hover:border-[1px] rounded-[10px] p-[30px] ${profile?.user_id == member.user_id ? '!border-green-500 border-[1px]' : ''}`}>
                    {profile?.user_id == member.user_id && (
                      <span className="bg-green-500 text-[12px] font-bold px-[10px] py-[5px] rounded-[10px] inline-block mb-[15px]">Your account</span>
                    )}
  
                      <div className="flex justify-between w-full items-start">
                        <div className="flex gap-x-[15px]">
                          <div
                          className="cursor-pointer text-[#333] inline-block rounded-full w-[50px] h-[50px] flex items-center justify-center p-[5px]"
                          style={{
                            backgroundColor: avatarService.findColor(
                              member?.avatar_color
                            ),
                          }} 
                        > 
                          {avatarService.findAvatar(member?.avatar)}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold mb-2">{member?.name}</h2> 
                          <div>
                            {member.email}
                          </div>
  
                          <div className="bg-[#009CFF] inline-block px-2 py-[3px] rounded-[5px] text-[12px] text-white inline-block">
                            {authService.getRole(member.role)}
                          </div>
                          </div>
                        </div>

                        {(member?.subscription?.totalDays > 0 && member?.qr_code && member.role === 3) && (
                          <div className="flex flex-col items-center">
                            <Link title="View QR Code" href={process.env.NEXT_PUBLIC_API_URL + member.qr_code} target="_blank" className="group relative inline-block">
                              <span className="group-hover:!flex hidden transition absolute top-0 left-0 w-full h-full z-1 justify-center items-center text-white bg-[#000] bg-opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                              </span>
                              <Image src={process.env.NEXT_PUBLIC_API_URL + member.qr_code} className="w-[150px]" width={500} height={500} alt="QR Code" />
                            </Link>

                            <div className="mt-[15px]">
                              <Link href={`/user/qr-info/${member?.uuid}`} target="_blank" className="hover:underline">
                                View Public Profile
                              </Link>
                            </div> 
                          </div>
                        )}
                      </div>
 
                    <div className="mt-[60px] flex flex-wrap gap-[15px]"> 
                      <button 
                      className="inline-flex max-w-[200px] px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full"
                      onClick={
                        () => { 
                          modalState.setState({ modalOpen: true, editInfo: { id: member.user_id }, modalInfo: { id: "edit-member", title: `Edit ${member.name} - ${authService.getRole(member.role)}` } });
                        }
                      }>Edit User</button>
                      <button
                      className="inline-flex max-w-[200px] px-[30px] items-center justify-center hover:bg-red-700 text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-red-500 py-[10px] text-black text-uppercase w-full"
                      onClick={
                        () => {
                          modalState.setState({ modalOpen: true, deleteInfo: { id: member.user_id }, modalInfo: { id: "soft-delete-member", title: `Are you sure you want to delete ${member.name} - ${authService.getRole(member.role)} ?` } });
                        }
                      }>Delete User</button>

                      {member.role === 3 && (
                        <button className="inline-flex max-w-[220px] px-[30px] items-center justify-center hover:bg-green-600 text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-green-500 py-[10px] text-black text-uppercase w-full"
                          onClick={() => {
                            modalState.setState({ modalOpen: true, modalInfo: { id: "add-subscription", title: `Add subscription for ${member.name}`, memberId: member.user_id } });
                          }}
                        >
                          Add Subscription
                        </button>
                      )}

                      {member?.subscription?.totalDays > 0 && member.role === 3 && (
                        <button className="inline-flex max-w-[220px] px-[30px] items-center justify-center hover:bg-green-600 text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-green-500 py-[10px] text-black text-uppercase w-full"
                          onClick={() => {
                            modalState.setState({ modalOpen: true, modalInfo: { id: "view-subscription", title: `Subscriptions of ${member.name}`, memberId: member?.uuid } });
                          }}
                        > 
                          View Subscriptions
                        </button> 
                      )}
                    </div> 
                  </div>
                ))}
              </div> 
            )}
          </div>
        </div>
      </div>
  );
}