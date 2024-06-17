import { toast } from "react-toastify";
const dbService = {
    serverError: () => {
        return toast.error("Server error. Please try again later.");
    }
}

export default dbService;