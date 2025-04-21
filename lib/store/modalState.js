import { create } from "zustand"; // Importing create function from Zustand

// Using the create function to create a Zustand store
export default create((set) => ({
  modalOpen: false,
  modalInfo: {},
  deleteInfo: {},
  editInfo: {},
  setModalInfo: (info) => set({ modalInfo: info }),
  setClearModal: () =>
    set({ modalInfo: "", deleteInfo: "", editInfo: "", modalOpen: false }),
}));
