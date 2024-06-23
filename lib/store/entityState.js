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
            if(error.status === 403) {
                authService.logoutSession();
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
            if(error.status === 403) {
                authService.logoutSession(); 
            }
        }
    },


    membershipDurations: [],
    ismembershipDurationsLoading: true,
    refetchmembershipDurations: async() => {
        set((state) => ({ ismembershipDurationsLoading: true }));
        try {
            const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/membership-durations");
            if(res.status === 200) {
                set((state) => ({ membershipDurations: res?.data?.data, ismembershipDurationsLoading: false }));
            } 
        }catch(error) { 
            // if(error.status === 403) {
            //     authService.logoutSession(); 
            // }
        }
    }
}));  

export default useEntityState; 