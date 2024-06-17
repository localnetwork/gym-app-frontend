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

export default function App({ Component, pageProps }) {
  const profile = persistentStore((state) => state.profile);
  const ready = globalState((state) => state.ready);
  const modalOpen = modalState((state) => state.modalOpen);

  const cookies = parseCookies();
  const token = cookies[TOKEN];

  useEffect(() => {
    if (!token && profile.name) {
      window.location.reload();
      persistentStore.setState({ profile: "" });
    }
    if (!ready) return;

    const fetchProfile = async () => {
      try {
        const res = await AUTHAPI.getProfileInfo();
        persistentStore.setState({ profile: res.data.data });
      } catch (err) {
        persistentStore.setState({ profile: "" });
      }
    };

    fetchProfile();
  }, [profile, ready, token]);

  return (
    <Layout profile={profile}>
      <Component {...pageProps} />

      <Modal />
      <ToastContainer /> 
    </Layout>
  );
}
