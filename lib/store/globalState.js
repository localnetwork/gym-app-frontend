import { useEffect } from "react"; // Importing useEffect from React (not used in this code)
import { create } from "zustand"; // Importing create function from Zustand

// Using the create function to create a Zustand store
export default create(() => ({
  ready: false,
}));
