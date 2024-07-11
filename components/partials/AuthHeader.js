import avatarService from "@/lib/services/avatar";

import AUTHAPI from "@/lib/api/auth/request";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import authService from "@/lib/services/authService";
export default function AuthHeader({ profile }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const menuLinks = [
    {
      name: "Plans",
      url: "/plans",
      roleRestrictions: [1],
    },
    {
      name: "Promos",
      url: "/member-plans",
      roleRestrictions: [3],
    },
    {
      name: "Members",
      url: "/users",
      roleRestrictions: [1, 2],
    },
    {
      name: "Non-members",
      url: "/non-members",
      roleRestrictions: [1, 2],
    },
    {
      name: "Orders",
      url: "/orders",
      roleRestrictions: [1, 2],
    },
    {
      name: "Durations",
      url: "/durations",
      roleRestrictions: [1],
    },
    {
      name: "Contact Us",
      url: "/contact",
    },
  ];

  const filteredMenuLinks = menuLinks.filter((item) => {
    return (
      !item.roleRestrictions || item.roleRestrictions.includes(profile.role)
    );
  });

  const logoutHandler = async () => {
    setIsDropdownOpen(false);
    try {
      // const res = await AUTHAPI.logout();
      authService.logout();
    } catch (error) {
      console.error("Error", error);
    }
  };

  const role = authService.getRole(profile?.role);

  return (
    <header className="bg-[#000] relative shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]">
      <div className="container relative mx-auto py-4 flex justify-between items-center">
        <div className="">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setIsDropdownOpen(false)}
          >
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
              onClick={() => setIsDropdownOpen(false)}
              className={`${
                router.asPath == link.url ? "!text-[#009CFF]" : ""
              } text-white text-[20px] font-bold cursor-pointer hover:text-[#009CFF] px-[20px]`}
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

            <Link
              onClick={() => setIsDropdownOpen(false)}
              className="cursor-pointer hover:bg-[#f3f3f3] p-2 flex items-center gap-x-[5px]"
              href="/profile"
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              Profile
            </Link>
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
