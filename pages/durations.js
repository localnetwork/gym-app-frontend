import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});   


import Page403 from "@/components/statuses/Page403";
import useEntityState from "@/lib/store/entityState";
import { useEffect } from "react";
import persistentStore from "@/lib/store/persistentStore";
import Head from "next/head";
import modalState from "@/lib/store/modalState";


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead, 
  TableHeader,
  TableRow,
} from "@/components/ui/table"  


import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table" 

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";

 
export default function Durations() {
    const profile = persistentStore((state) => state.profile); 
    const { modalOpen, modalInfo, setModalInfo } = modalState((state) => ({
      modalOpen: state.modalOpen,
      modalInfo: state.modalInfo,
      setModalInfo: state.setModalInfo,
    }));  

    const { membershipDurations, refetchmembershipDurations, ismembershipDurationsLoading } = useEntityState((state) => ({
        membershipDurations: state.membershipDurations,
        refetchmembershipDurations: state.refetchmembershipDurations,
        ismembershipDurationsLoading: state.ismembershipDurationsLoading,
    }));



    useEffect(() => {
        refetchmembershipDurations();
    }, []);

    if(profile.role !== 1) {
        return <Page403 />
    } 

    return(
        <div className="py-[30px] px-[15px]">
        <Head>
          <title>
            Durations
          </title>
        </Head>
        <div className="container">
          <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
          <div className="flex flex-wrap items-center justify-between gap-[15px] mb-[30px]">
              <h1
                  className={`text-[40px] font-black text-black ${montserrat.className}`}
              >
                  Durations
              </h1>
              <button
                  className="inline-flex max-w-[250px] px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full"
                  onClick={() => {
                  setModalInfo({
                      id: "add-duration",
                      title: "Add Duration",
                  });
                  modalState.setState({ modalOpen: true });
                  }}
              >
                  Add Duration
              </button>
          </div> 


          {ismembershipDurationsLoading ? (
                <div>
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="animate-pulse flex space-x-4">
                    <div className="rounded-lg bg-gray-300 h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <div>
                      <Table>
                          <TableHeader>
                              <TableRow>
                              <TableHead className="w-[250px]">Title</TableHead>
                              <TableHead className="w-[100px]">{`Duration (In days)`}</TableHead>
                              <TableHead className="text-right">{`Actions`}</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {membershipDurations?.map((item, index) => {
                                  return(
                                  <TableRow key={index}>
                                      <TableCell>{item?.title}</TableCell>
                                      <TableCell>{item?.duration}</TableCell>
                                      <TableCell className="text-right flex justify-end"> 
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <div variant="outline">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </div>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuCheckboxItem
                                                  className="capitalize outline-none"
                                                >
                                                  <div className="py-[5px] cursor-pointer" onClick={() => {
                                              setModalInfo({
                                                id: "delete-duration",
                                                title: `Delete duration ${item?.title}`,
                                                deleteId: item?.id,
                                              });
                                              modalState.setState({ modalOpen: true });
                                            }}>
                                              Delete
                                            </div>
                                            </DropdownMenuCheckboxItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </TableCell>
                                  </TableRow>
                                  )
                              })}
                          </TableBody>
                      </Table>
                </div>
            )}
          </div>
        </div>
        </div>
    )
}