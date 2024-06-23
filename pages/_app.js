import Layout from "@/components/partials/layout";
import "@/styles/globals.css";

import persistentStore from "@/lib/store/persistentStore";
import globalState from "@/lib/store/globalState";
import AUTHAPI from "@/lib/api/auth/request";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import Modal from "@/components/modals/Modal";
import modalState from "@/lib/store/modalState";

const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import authService from "@/lib/services/authService";
import { useRouter } from "next/router";
export default function App({ Component, pageProps }) {
  const profile = persistentStore((state) => state.profile);
  const ready = globalState((state) => state.ready);
  const modalOpen = modalState((state) => state.modalOpen);

  const router = useRouter();

  const cookies = parseCookies();
  const token = cookies[TOKEN];



  useEffect(() => {
    if(token) {
      authService.refetchProfile();   
    }   
  }, [token, authService]);  

  return (
    <Layout profile={profile}>
      <Component {...pageProps} />

      <Modal />
      <ToastContainer /> 
    </Layout>
  );
}