import modalState from "@/lib/store/modalState";

export default function ViewUserSubscriptions() {
    const { modalOpen, modalInfo, setModalInfo, editInfo, clearModal } = modalState((state) => ({
        modalOpen: state.modalOpen,
        modalInfo: state.modalInfo,
        setModalInfo: state.setModalInfo,
        clearModal: state.clearModal,
        editInfo: state.editInfo,
    }));  
    return(
        <div>
            Hello
        </div>
    )
}