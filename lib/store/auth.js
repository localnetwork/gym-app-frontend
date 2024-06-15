import { create } from "zustand";
import { devtools } from "zustand/middleware";
import AUTHAPI from "@/lib/api/auth/request";
import persistentStore from "@/lib/store/persistentStore";
import { deserialize } from "@/lib/services/globalService";

let storeHandler = (set, get) => ({
  loginForm: {
    email: "",
    password: "",
  },
  registerForm: {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    avatar: "",
    avatar_color: "",
  },

  resetPasswordForm: {
    password: "",
    password_confirmation: "",
  },
  forgotPasswordForm: {
    email: "",
  },

  registrationError: "",
  loginError: "",
  forgotFormError: "",
  resetPasswordFormError: "",
  verifyFormError: "",
  submissionLoading: false,
  onChangeLogin: (data) => {
    set(() => ({
      loginForm: { ...get().loginForm, ...data },
    }));
  },
  onLogin: async (e) => {
    set(() => ({ submissionLoading: true, loginError: "" }));
    await Promise.all([
      await AUTHAPI.login(get().loginForm)
        .then((res) => {
          set(() => ({
            login: {
              email: "",
              password: "",
            },
          }));

          persistentStore.setState({ profile: res.data.user });
        })
        .catch((err) => {
          set(() => ({
            submissionLoading: false,
            loginError: err?.data?.errors,
          }));
          throw err;
        }),
    ]);

    set(() => ({ submissionLoading: false }));
  },

  onChangeRegister: (data) => {
    set(() => ({
      registerForm: { ...get().registerForm, ...data },
    }));
  },

  onRegister: async () => {
    const personalInfo = get().registerForm;
    let payload = {};

    payload = {
      ...personalInfo,
    };

    set(() => ({ submissionLoading: true, registrationError: "" }));
    return await AUTHAPI.register(payload)
      .then(() => {
        // Reset form
        set(() => ({
          registerForm: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
          },
        }));
        set(() => ({
          submissionLoading: false,
        }));
      })
      .catch((err) => {
        set(() => ({
          submissionLoading: false,
          registrationError: err?.data?.errors,
        }));
        throw err;
      });
  },

  //   onChangeForgot: (data) => {
  //     set(() => ({
  //       forgotPasswordForm: { ...get().forgotPasswordForm, ...data },
  //     }));
  //   },
  //   onForgotPassword: async () => {
  //     set(() => ({ submissionLoading: true, forgotFormError: "" }));
  //     return await AUTHAPI.forgotPassword(get().forgotPasswordForm)
  //       .then(() => {
  //         set(() => ({
  //           submissionLoading: false,
  //         }));
  //       })
  //       .catch((err) => {
  //         set(() => ({
  //           submissionLoading: false,
  //           // forgotFormError:
  //           //   err?.data?.errors || err?.data?.message || "Forgot password failed",
  //         }));
  //         throw err;
  //       });
  //   },
  //   onChangeReset: (data) => {
  //     set(() => ({
  //       resetPasswordForm: { ...get().resetPasswordForm, ...data },
  //     }));
  //   },
  //   onResetPassword: async (token, email) => {
  //     const payload = {
  //       ...get().resetPasswordForm,
  //       token,
  //       email,
  //     };
  //     set(() => ({ submissionLoading: true, resetPasswordFormError: "" }));
  //     return await AUTHAPI.resetPassword(payload)
  //       .then(() => {
  //         set(() => ({
  //           submissionLoading: false,
  //         }));
  //       })
  //       .catch((err) => {
  //         set(() => ({
  //           submissionLoading: false,
  //           resetPasswordFormError:
  //             err?.data?.errors || err?.data?.message || "Reset password failed",
  //         }));
  //         throw err;
  //       });
  //   },
  //   onVerify: async () => {
  //     set(() => ({ submissionLoading: true }));
  //     return await AUTHAPI.verifyAccount()
  //       .then(() => {
  //         set(() => ({
  //           submissionLoading: false,
  //         }));
  //       })
  //       .catch((err) => {
  //         set(() => ({
  //           submissionLoading: false,
  //         }));
  //         throw err;
  //       });
  //   },
});

storeHandler = devtools(storeHandler);
const store = create(storeHandler);

export default store;
