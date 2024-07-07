import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
let storeHandler = (set, get) => ({
  checkoutData: "",
});
storeHandler = devtools(storeHandler);
storeHandler = persist(storeHandler, { name: "checkout" });
const store = create(storeHandler);
export default store;