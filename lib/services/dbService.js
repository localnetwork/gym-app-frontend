import { toast } from "react-toastify";
import authService from "./authService";
const dbService = {
    serverError: () => {
        return toast.error("Server error. Please try again later.");
    },

    expiredSession: () => {
        authService.logoutSession(); 
    }
}  

export default dbService;