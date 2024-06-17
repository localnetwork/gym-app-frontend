import BaseApi from "@/lib/api/_base.api";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import persistentStore from "@/lib/store/persistentStore";
import Router from "next/router";
const APIDOMAIN = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "";
import axios from "axios";

export default class AUTHAPI {
  static async register(payload) {
    try {
      const res = await BaseApi.post(APIDOMAIN + "/register", payload);
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async login(payload) {
    try {
      const res = await BaseApi.post(APIDOMAIN + "/login", payload);
      setCookie({}, TOKEN, res.data.token, {
        path: "/",
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async update(payload) {
    try {
      const res = await BaseApi.post(APIDOMAIN + "/user", payload);
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async logout() {
    console.log('logout!')
    persistentStore.setState({ profile: "" });
    Router.push("/login");
    destroyCookie(null, TOKEN);
  }

  static async forgotPassword(payload) {
    try {
      const res = await BaseApi.post(
        APIDOMAIN + "/api/account/password/email",
        payload
      );
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async verifyAccount() {
    try {
      const res = await BaseApi.post(
        APIDOMAIN + "/api/account/verification/resend"
      );
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async resetPassword(payload) {
    try {
      await BaseApi.post(APIDOMAIN + "/api/account/password/reset", payload);
      // window.location.href = "/login";
    } catch (err) {
      throw err;
    }
  }

  static getProfileInfo(params = "", options = {}) {
    return BaseApi.get(APIDOMAIN + `/profile` + params, options);
  }
}
