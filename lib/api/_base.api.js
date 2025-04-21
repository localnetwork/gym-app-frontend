import axios from "axios";
import interceptorSetup from "./interceptor";
import UseSWR from "swr";
import { parseCookies, setCookie } from "nookies";
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "";
import { toast } from "react-toastify";
import dbService from "../services/dbService";
import authService from "../services/authService";
interceptorSetup(axios);
const basicAxios = axios.create();

import useSWR from "swr";
// Fetcher function to fetch data from an API
const fetcher = (url) => fetch(url).then((res) => res.json());
export default class BaseApi {
  static async get(URL) {
    try {
      const res = await axios.get(URL);
      if (res?.status === 200) {
        return res;
      }
    } catch (error) {
      switch (error?.status) {
        case 500:
          dbService.serverError();
          break;
        case 401:
          authService.logoutSession();
        case 403:
          authService.logoutSession();
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
        switch (error?.status) {
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
        switch (error?.status) {
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
        switch (error?.status) {
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
        switch (error?.status) {
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

  static swr(URL, options = {}) {
    const fetcher = (link) => this.get(link);
    const render = options.hasOwnProperty("render") ? options.render : true;
    const { data, mutate, isValidating, error } = UseSWR(
      render ? URL : null,
      fetcher,
      options
    );
    return {
      data: data ? data.data : data,
      mutate,
      isValidating,
      error,
    };
  }
}
