import modalState from "@/lib/store/modalState";
import AddPromo from "../forms/AddPromo";
import AddMember from "../forms/AddMember";
import { useEffect } from "react";
import DeletePromo from "../forms/DeletePromo";
import useEntityState from "@/lib/store/entityState";
import EditPromo from "../forms/EditPromo";
import EditMember from "../forms/EditMember";
import DeleteMember from "../forms/DeleteUser";
import AddSubscription from "../forms/AddSubscription";
import ViewUserSubscriptions from "../forms/ViewUserSubscriptions";
import AddNonMember from "../forms/AddNonMember";
import ChangePasswordAdmin from "../forms/ChangePasswordAdmin";
import SoftDeleteMember from "../forms/SoftDeleteUser";
import RestoreUser from "../forms/RestoreUser";
export default function Modal() {
  const { modalOpen, modalInfo, setModalInfo, deleteInfo, setClearModal } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    setModalInfo: state.setModalInfo,
    deleteInfo: state.deleteInfo,
    setClearModal: state.setClearModal,
  }));


  let form = null;

  switch (modalInfo.id) {
    case "add-promo":
      form = <AddPromo />;
      break;
    case "delete-promo":
      form = <DeletePromo />;
      break;
    case "edit-promo":
      form = <EditPromo />;
      break;
    case "add-member":
      form = <AddMember />;
      break;
    case "edit-member":
      form = <EditMember />;
      break;
    case "delete-member":
      form = <DeleteMember />;
      break;
    case "soft-delete-member":
      form = <SoftDeleteMember />;
      break;
    case "add-subscription":
      form = <AddSubscription />;
      break;
    case "view-subscription":
      form = <ViewUserSubscriptions />;
      break;
    case "add-nonmember-transaction":
      form = <AddNonMember />;
      break;
    case "change-password-admin":
      form = <ChangePasswordAdmin />;
      break;
    case "restore-member":
      form = <RestoreUser />;
      break;
    default:
      form = null;
  } 
 
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; 
      // modalState.setState({ modalOpen: false, deleteInfo: "",  modalInfo: "" });
      setClearModal(); 
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
            <div className="relative flex justify-between">
              <h1 className="font-black text-[30px] mb-3">{modalInfo.title}</h1>
              <span className="cursor-pointer" onClick={() => {
                setClearModal() 
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
            {form}
          </div>
        </div>
      </div>
    );
  }
}
