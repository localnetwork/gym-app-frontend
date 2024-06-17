import modalState from "@/lib/store/modalState";
import AddPromo from "../forms/AddPromo";
import { useEffect } from "react";
import DeletePromo from "../forms/DeletePromo";
import useEntityState from "@/lib/store/entityState";
import EditPromo from "../forms/EditPromo";
export default function Modal() {
  const { modalOpen, modalInfo, setModalInfo, deleteInfo } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    setModalInfo: state.setModalInfo,
    deleteInfo: state.deleteInfo,
  }));


  let form = null;

  if (modalInfo.id === "add-promo") {
    form = <AddPromo />;
  }else if(modalInfo.id === "delete-promo") {
    form = <DeletePromo />;
  }else if(modalInfo.id === "edit-promo") {
    form = <EditPromo />; 
  }

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; 
      modalState.setState({ modalOpen: false, deleteInfo: "",  modalInfo: "" });
    }
  }, [modalOpen]);
  

  if(modalOpen) {
    return (
      <div className="fixed flex justify-center items-center top-0 w-full h-full z-[200] p-[30px]">
        <span
          className="absolute bg-[#000] bg-opacity-50 w-full h-full"
          onClick={() => {
            setModalInfo({ id: "", title: "" });
            modalState.setState({ modalOpen: false });
          }}
        />
        <div className="container !max-w-[900px] relative">
          <div className="bg-white p-[30px] text-[#121212] max-h-[calc(100dvh-60px)] overflow-y-auto">
            <h1 className="font-black text-[30px] mb-3">{modalInfo.title}</h1>
            {form}
          </div>
        </div>
      </div>
    );
  }
}
