import avatarService from "@/lib/services/avatar";
import persistentStore from "@/lib/store/persistentStore";
import Link from "next/link";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import UserOrders from "@/components/blocks/UserOrders";
import EditProfile from "@/components/forms/EditProfile";
import EditProfilePassword from "@/components/forms/EditProfilePassword";
import helper from "@/lib/scrap/helper";
const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function Profile() {
  const profile = persistentStore((state) => state.profile);
  const [currentTab, setCurrentTab] = useState("about");
  const subscriptionStatus = profile?.subscription?.status;
  let subscriptionBg;

  if (subscriptionStatus === "active") {
    subscriptionBg = "#2d9258";
  } else if (subscriptionStatus === "expired") {
    subscriptionBg = "#ba3434";
  } else if (subscriptionStatus === "no_subscription") {
    subscriptionBg = "#9c5f23";
  } else {
    subscriptionBg = "#2d9258";
  }

  return (
    <div className={`bg-[#1E1F22] py-[50px] min-h-[80vh]`}>
      <div className="max-w-[1140px] mx-auto bg-[#111214] rounded-[15px] overflow-hidden">
        {profile && (
          <>
            <div
              className="opacity-[.3] h-[250px] relative  "
              style={{
                background: avatarService.findColor(profile.avatarColor),
              }}
            ></div>
            <div className="flex items-center justify-between mt-[-50px] z-[1] relative px-[50px]">
              <div className="flex items-end">
                <span
                  className=" avatar block w-[100px] h-[100px] relative rounded-full p-3 border-[7px] border-[#111214]"
                  style={{
                    background: avatarService.findColor(profile.avatarColor),
                  }}
                >
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_API_URL + profile?.profile_picture
                    }
                    width={100}
                    height={100}
                    className="h-full w-full rounded-full object-cover absolute left-0 top-0"
                  />
                </span>
                <h1
                  className={`text-[20px] pl-[15px]  ${montserrat.className} font-bold`}
                >
                  {profile.name}{" "}
                </h1>
              </div>

              {profile && (
                <div className="pt-[70px]">
                  <div
                    onClick={() => {
                      setCurrentTab("edit");
                    }}
                    className="select-none cursor-pointer text-white py-3 px-5 flex items-center gap-x-[5px] min-w-[100px] text-center rounded-[5px] bg-[#4E5058]"
                  >
                    <svg
                      aria-hidden="true"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"
                        class=""
                      ></path>
                    </svg>
                    Edit Profile
                  </div>
                </div>
              )}
            </div>

            <div className="p-[50px] text-[#ccc]">
              <div className="bg-[#232528] rounded-[7px] p-[15px] border border-[#ccc] border-opacity-10">
                <div className="select-none tab-links gap-x-[15px] flex items-center border-b border-[#ccc] border-opacity-10">
                  <div
                    className={`${
                      currentTab === "about"
                        ? "border-b-[2px] border-[#ccc]"
                        : ""
                    } hover:border-b-[2px] border-[#ccc] cursor-pointer`}
                    onClick={() => {
                      setCurrentTab("about");
                    }}
                  >
                    About
                  </div>

                  <div
                    className={`${
                      currentTab === "orders"
                        ? "border-b-[2px] border-[#ccc]"
                        : ""
                    } hover:border-b-[2px] border-[#ccc] cursor-pointer`}
                    onClick={() => {
                      setCurrentTab("orders");
                    }}
                  >
                    Orders
                  </div>

                  <div
                    className={`${
                      currentTab === "edit"
                        ? "border-b-[2px] border-[#ccc]"
                        : ""
                    } hover:border-b-[2px] border-[#ccc] cursor-pointer`}
                    onClick={() => {
                      setCurrentTab("edit");
                    }}
                  >
                    Settings
                  </div>
                </div>

                <div className="py-[20px] text-[14px]">
                  {currentTab === "about" && (
                    <>
                      <div className="mb-3">
                        <div className="font-bold">Email</div>
                        <span className="text-[#848484]">{profile?.email}</span>
                      </div>
                      {profile?.uuid && (
                        <div className="mb-3">
                          <div className="font-bold">UUID</div>
                          <span className="text-[#848484]">
                            {profile?.uuid}
                          </span>
                        </div>
                      )}

                      {profile?.qr_code && (
                        <div className="mb-3">
                          <div className="font-bold mb-1">QR Code</div>
                          <Link
                            href={
                              process.env.NEXT_PUBLIC_API_URL + profile?.qr_code
                            }
                            target="_blank"
                            className="group inline-block relative"
                          >
                            <span className="group-hover:flex hidden bg-[#000] bg-opacity-80 text-white text-center justify-center items-center justify-center absolute p-5 h-full w-full z-[1]">
                              View Image
                            </span>
                            <Image
                              className="bg-white"
                              src={
                                process.env.NEXT_PUBLIC_API_URL +
                                profile?.qr_code
                              }
                              width={100}
                              height={100}
                            />
                          </Link>
                        </div>
                      )}

                      {profile?.subscription && (
                        <div className="">
                          <div className="font-bold mb-1">
                            Subscription Info
                          </div>
                          <div className="flex gap-x-[5px]">
                            <span
                              className="px-[5px] rounded-[5px]"
                              style={{ background: subscriptionBg }}
                            >
                              {subscriptionStatus}
                            </span>
                            {helper.daysFormatter(
                              profile?.subscription.remainingDays
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {currentTab === "orders" && <UserOrders />}

                  {currentTab === "edit" && (
                    <>
                      <EditProfile />
                      <EditProfilePassword />
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
