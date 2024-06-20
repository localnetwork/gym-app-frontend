import avatarService from "@/lib/services/avatar";

import AUTHAPI from "@/lib/api/auth/request";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import authService from "@/lib/services/authService";
export default function AuthHeader({ profile }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuLinks = [
    {
      name: "Promos",
      url: "/promos",
      roleRestrictions: [1],
    },
    { 
      name: "Members",
      url: "/users",
      roleRestrictions: [1,2],
    }, 
    {
      name: "Contact Us", 
      url: "/contact", 
    }, 
  ]

  const filteredMenuLinks = menuLinks.filter((item) => {
    return !item.roleRestrictions || item.roleRestrictions.includes(profile.role);
  });



  const router = useRouter();
  const logoutHandler = async () => {
    setIsDropdownOpen(false);
    try {
      const res = await AUTHAPI.logout();
    } catch (error) {
      console.error("Error", error);
    }
  };

  const role = authService.getRole(profile?.role); 
 
  return (
    <header className="bg-[#000] relative shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]">
      <div className="container relative mx-auto py-4 flex justify-between items-center">
        <div className="">
          <Link href="/" className="flex items-center">
            <Image src="/logo-white.webp" alt="alt" width={70} height={70} />
            <Image
              src="/logo-text.webp"
              alt="alt"
              width={150}
              height={100}
              className="h-[30px] w-auto ml-[10px]"
            />
          </Link>
        </div>
        <div>
            {/* <Link href="/trainings">Trainings</Link> */}
            {filteredMenuLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-white text-[20px] font-bold cursor-pointer hover:text-[#009CFF] px-[20px]"
              >
                {link.name}
              </Link>
            ))} 
          </div>  
        <div className="relative">
          <div className="flex items-center gap-x-[5px]">
            {profile.avatar ? (
              <>
                <div
                  className="cursor-pointer text-[#333] inline-block rounded-full w-[50px] h-[50px] flex items-center justify-center p-[5px]"
                  style={{
                    backgroundColor: avatarService.findColor(
                      profile?.avatarColor
                    ),
                  }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {avatarService.findAvatar(profile?.avatar)}
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#1ed760] text-black p-[15px] rounded-full w-[50px] h-[50px] flex items-center justify-center">
                  {profile?.name}
                </div>
              </>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 ml-1 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </div>

          

          <div
            className={`dropdown-info ${
              isDropdownOpen ? "active" : ""
            } select-none overflow-hidden absolute right-0  text-[#121212] text-[#333] rounded-[5px] bg-white border border-gray-200 mt-3  w-48 shadow-lg z-10`}
          >
            <div className="px-2 pt-2 capitalize text-[14px]">
              Howdy, {profile.name}
            </div>
            {role && (
              <>
                <div className="px-2 py-[15px] mb-[50px] ">
                  <span className="bg-[#009CFF] inline-block px-2 py-[3px] rounded-[5px] text-[12px] text-white">
                    {role}
                  </span>
                </div>
              </>
            )}

            <div className="border-b border-gray-200" />
            <div
              className="cursor-pointer hover:bg-[#f3f3f3] p-2 flex gap-x-[5px]"
              onClick={() => {
                router.push(`/user/${profile?.id}`);
                setIsDropdownOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              Profile
            </div>
            <div
              className="cursor-pointer hover:bg-[#f3f3f3] p-2 flex gap-x-[5px]"
              onClick={() => {
                router.push("/settings/profile");
                setIsDropdownOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Settings
            </div>
            <div
              className="cursor-pointer hover:bg-[#f3f3f3] p-2 flex items-center gap-x-[5px]"
              onClick={logoutHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
              Logout
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-header bottom-[-6px] left-0 block h-[7px] w-full absolute block " />
    </header>
  );
}
