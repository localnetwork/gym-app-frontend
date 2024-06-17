const { toast } = require("react-toastify")

const dbService = {
    serverError: () => {
        return toast.error("Server error, please try again later");
    }
}

export default dbService;