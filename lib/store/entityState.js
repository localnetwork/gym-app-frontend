import { create } from "zustand"; // Importing create function from Zustand
import BaseApi from "../api/_base.api";

import authService from "../services/authService";

const useEntityState = create((set) => ({ 
    promos: [],
    isPromosLoading: true, 
    refetchPromos: async() => {
        set((state) => ({ isPromosLoading: true }));
        try {
            const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/promos");
            if(res.status === 200) {
                set((state) => ({ promos: res?.data?.data, isPromosLoading: false }));
            } 
        }catch(error) {  
            console.error("Error", error);    
            if(error.status === 403) {
                authService.logout();
            }
        }
    },

    members: [],
    isMembersLoading: true,
    refetchMembers: async() => {
        set((state) => ({ isMembersLoading: true }));
        try {
            const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/users");
            if(res.status === 200) {
                set((state) => ({ members: res?.data?.data, isMembersLoading: false }));
            } 
        }catch(error) { 
            console.error("Error", error);    
            if(error.status === 403) {
                authService.logout(); 
            }
        }
    } 
}));  

export default useEntityState; 