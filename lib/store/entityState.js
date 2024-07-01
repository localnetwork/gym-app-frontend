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

    publicPromos: [],
    isPublicPromosLoading: true, 
    refetchPublicPromos: async() => {
        set((state) => ({ isPublicPromosLoading: true }));
        try {
            const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/promos/public");
            if(res.status === 200) {
                set((state) => ({ publicPromos: res?.data?.data, isPublicPromosLoading: false }));
            } 
        }catch(error) {  
            console.log('Error: ', error); 
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

    deletedMembers: [],
    isDeletedMembersLoading: true,
    refetchDeletedMembers: async() => {
        set((state) => ({ isDeletedMembersLoading: true }));
        try {
            const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/deleted-users");
            if(res.status === 200) {
                set((state) => ({ deletedMembers: res?.data?.data, isDeletedMembersLoading: false }));
            } 
        }catch(error) { 
            if(error.status === 403) { 
                authService.logoutSession(); 
            }
        } 
    },


    addMember: async (payload) => {
        try {
            const res = await BaseApi.post(process.env.NEXT_PUBLIC_API_URL + "/users", payload);

            set((state) => ({ members: [...state.members, res?.data?.data] }));

            return res; 
        } catch (error) {
            if(error.status === 422) {
                set((state) => ({ addMemberErrors: error.data.errors }));
            }
            if (error?.status === 403) {
                authService.logoutSession();
            }
            // throw new Error(error);
            return error;  
        }
    }, 

    deleteMember: async(id) => {
        try {
            const res = await BaseApi.delete(process.env.NEXT_PUBLIC_API_URL + "/users/" + id);
            if(res.status === 200) {
                set((state) => ({ members: state.members.filter(member => member.id !== id) }));
            }
        }catch(error) {
            throw new Error(error);
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
    },

    nonMembersTransactions: [],
    isNonMembersTransactionsLoading: true,
    refetchNonMembersTransactions: async() => {
        set((state) => ({ isNonMembersTransactionsLoading: true }));
        try {
            const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/non-members/transactions");
            if(res.status === 200) {
                set((state) => ({ nonMembersTransactions: res?.data?.data, isNonMembersTransactionsLoading: false }));
            } 
        }catch(error) { 
            if(error.status === 403) {
                authService.logoutSession(); 
            }
        }
    }
}));  

export default useEntityState; 