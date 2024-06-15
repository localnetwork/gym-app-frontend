import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import store from "@/lib/store/persistentStore";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/router";
import authStore from "@/lib/store/auth";
import Head from "next/head";
export default function Login() {
  console.log("store", store);
  const [loginForm, onChangeLogin, onLogin, loginError, submissionLoading] =
    authStore(
      (state) => [
        state.loginForm,
        state.onChangeLogin,
        state.onLogin,
        state.loginError,
        state.submissionLoading,
      ],
      shallow
    );

  const router = useRouter();
  const profile = store((state) => state.profile);

  const onLoginTrigger = async (e) => {
    e?.preventDefault();

    try {
      const res = await onLogin();
      console.log("resresres", res);
    } catch (err) {
      console.error("Error", err);
    }
  };

  if (profile) {
    // window.location.href = "/";
    router.push("/");
    return <div>Loading</div>;
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="gradient-black min-h-[100vh] flex items-center justify-center flex-col p-[15px] md:p-[32px]">
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={100}
            height={150}
            className="max-w-[100px] mb-[30px]"
          />
        </Link>
        <div className="max-w-[734px] w-full mx-auto py-[15px] md:py-[32px] bg-[#121212] px-[15px] rounded-[8px]">
          <div className="box-shadow py-[30px] rounded-[8px] px-[20px] w-full max-w-[400px] mx-auto">
            <h1 className="text-[32px] text-center font-bold my-[48px]">
              Log in to <span className="text-[#009CFF]">One Kaizen</span>
            </h1>

            {loginError?.message && (
              <p className="bg-[#ffeaea] py-[10px] px-[15px] text-red-500 border-red-100 border text-[13px] mb-[30px] text-center block">
                {loginError?.message}
              </p>
            )}

            <form className="flex flex-col" onSubmit={onLoginTrigger}>
              <div className="form-item mb-[15px]">
                <input
                  id="email"
                  className={`w-full shadow-[0_0_0_1px(#727272,878787)] ${
                    loginError?.message?.toString().length > 0 ||
                    (loginError?.email && "!border-red-500")
                  }`}
                  type="text"
                  name="email"
                  value={loginForm.email}
                  onChange={(e) => onChangeLogin({ email: e?.target?.value })}
                  onKeyDown={(e) =>
                    e?.key === "Enter" ? onLoginTrigger() : null
                  }
                  placeholder="Email"
                />

                {loginError && loginError?.email && (
                  <>
                    {loginError?.email.map((item, index) => (
                      <span
                        key={index}
                        className="text-red-500 text-[13px] mt-[5px] block"
                      >
                        {item}
                      </span>
                    ))}
                  </>
                )}
              </div>
              <div className="form-item mb-[15px]">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`w-full shadow-[0_0_0_1px(#727272,878787)] ${
                    loginError?.message?.toString().length > 0 ||
                    (loginError?.password && "!border-red-500")
                  }`}
                  value={loginForm.password}
                  onChange={(e) =>
                    onChangeLogin({ password: e?.target?.value })
                  }
                  onKeyDown={(e) =>
                    e?.key === "Enter" ? onLoginTrigger() : null
                  }
                  placeholder="Password"
                />

                {loginError && loginError?.password && (
                  <>
                    {loginError?.password.map((item, index) => (
                      <span
                        key={index}
                        className="text-red-500 text-[13px] mt-[5px] block"
                      >
                        {item}
                      </span>
                    ))}
                  </>
                )}
              </div>
              <div className="form-action mt-[15px]">
                <button
                  className={`flex items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full  ${
                    submissionLoading ? "opacity-[.7] pointer-events-none" : ""
                  }`}
                >
                  {submissionLoading && (
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

                  {submissionLoading ? "Please Wait..." : "Log in"}
                </button>
              </div>

              <div className="my-[32px] text-center">
                <span
                  href="/forgot-password"
                  className="underline cursor-pointer"
                  onClick={() => {
                    alert("Still work in progress.");
                  }}
                >
                  Forgot your password?
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
