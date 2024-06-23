import { toast } from "react-toastify";
import persistentStore from "@/lib/store/persistentStore";
import { destroyCookie } from "nookies"; 
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || ""; 
import Router from "next/router"; 
import { serverError } from "./globalService";
import AUTHAPI from "../api/auth/request";
import { parseCookies, setCookie } from "nookies"; 
const authService = {
  getRole: (id) => {
    if (id === 1) {
      return "admin";
    } else if (id === 2) {
      return "employee";
    } else if (id === 3) {
      return "member";
    }
  }, 
  refetchProfile: async() => {
    try {
      const res = await AUTHAPI.getProfileInfo();

      if(res.status === 200) {
        persistentStore.setState({ profile: res.data.data });
      }
    }catch(error) { 
      console.log(error);  
      if(error.response && error.response.status === 401) {
        authService.logoutSession(); 
      }   
      if(error.response && error.response.status === 500) {
        serverError(); 
      } 
    } 
  }, 
  logoutSession: () => {
    persistentStore.setState({ profile: "" });
    Router.push("/login");
    destroyCookie(null, TOKEN);
    toast.error("Session expired. Please login again.");
  },

  logout: () => {
    persistentStore.setState({ profile: "" });
    Router.push("/login");
    destroyCookie(null, TOKEN);
  }
};

export default authService;
