import { toast } from "react-toastify";
import persistentStore from "@/lib/store/persistentStore";
import { destroyCookie } from "nookies"; 
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || ""; 
import Router from "next/router"; 
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
  logoutSession: () => {
    toast.error("Session expired, please login again"); 
    persistentStore.setState({ profile: "" });
    Router.push("/login");
    destroyCookie(null, TOKEN);
  } 
};

export default authService;
