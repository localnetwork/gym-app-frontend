import axios from "axios";
import interceptorSetup from "./interceptor";
import UseSWR from "swr";
import { parseCookies, setCookie } from "nookies";
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "";
import { toast } from "react-toastify";
import dbService from "../services/dbService";
interceptorSetup(axios);
const basicAxios = axios.create();
export default class BaseApi {
  static async get(URL) {
    try { 
      const res = await axios.get(URL);
      if (res?.status === 200) {
        return res;
      }
    } catch (error) {
      console.error(error?.status, "Error");
      const cookies = parseCookies();
      const token = cookies[TOKEN];

      if (token && error?.status === 403) {
        setCookie(null, TOKEN, "", { maxAge: 0 });
        toast.error("Session expired, please login again");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }

      switch(error?.status) {
        case 500:
          dbService.serverError();
          break;
        case 401:
          dbService.expiredSession(); 
        default:  
          break;
      }
    }
  }
  static async post(URL, data) {
    return await axios.post(URL, data).then(
      (response) => {
        return response;
      },
      (error) => {
        switch(error?.status) {
          case 500:
            dbService.serverError();
            break;
          default:  
            break;
        }
        throw error;
      }
    );
  }
  static async put(URL, data) {
    return await axios.put(URL, data).then(
      (response) => {
        return response;
      },
      (error) => {
        switch(error?.status) {
          case 500:
            dbService.serverError();
            break;
          default:  
            break;
        } 
        throw error;
      }
    );
  }
  static async patch(URL, data) {
    return await axios.patch(URL, data).then(
      (response) => {
        return response;
      },
      (error) => {
        switch(error?.status) {
          case 500:
            dbService.serverError();
            break;
          default:  
            break;
        }
        throw error;
      }
    );
  }

  static async delete(URL) {
    return await axios.delete(URL).then(
      (response) => {
        return response;
      },
      (error) => {
        switch(error?.status) {
          case 500:
            dbService.serverError();
            break;
          default:  
            break;
        }
        throw error;
      }
    );
  }
}
