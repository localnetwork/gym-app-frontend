import helper from "@/lib/scrap/helper";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function UserInfo() {
  const router = useRouter();
  const [publicProfile, setPublicProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const subscriptionStatus = publicProfile?.subscription?.status;
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

  useEffect(() => {
    const getPublicProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/public/${router?.query?.id}`
        );
        if (res.status === 200) {
          const data = await res.json();
          setIsLoading(false);
          setPublicProfile(data);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error", error);
      }
    };

    if (router?.query?.id) {
      getPublicProfile();
    }
  }, [router?.query?.id]);

  return (
    <div className="py-[30px] px-[15px]">
      <Head>
        <title>
          {publicProfile?.name ? publicProfile?.name : "Loading..."}
        </title>
      </Head>
      <div className="container">
        <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
          {isLoading ? (
            <p>Loading... Please wait.</p>
          ) : (
            <div>
              <h1 className="text-[40px] font-black text-black">
                {publicProfile?.name}
              </h1>
              {publicProfile?.subscription && (
                <div className="py-[15px]">
                  <div className="flex gap-x-[5px]">
                    <span
                      className="px-[5px] rounded-[5px]"
                      style={{ background: subscriptionBg }}
                    >
                      {subscriptionStatus}
                    </span>
                    {helper.daysFormatter(
                      publicProfile?.subscription.remainingDays
                    )}{" "}
                    left
                  </div>
                </div>
              )}

              <Link
                target="_blank"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  publicProfile?.profile_picture
                }
              >
                <Image
                  src={
                    process.env.NEXT_PUBLIC_API_URL +
                    publicProfile?.profile_picture
                  }
                  width={300}
                  height={300}
                  className="rounded-[5px]"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
