import Head from "next/head";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
import useEntityState from "@/lib/store/entityState";
import persistentStore from "@/lib/store/persistentStore";
import Page403 from "@/components/statuses/Page403";
import helper from "@/lib/scrap/helper";
import { useState, useEffect } from "react";
import modalState from "@/lib/store/modalState";
import BaseApi from "@/lib/api/_base.api";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CSVLink } from "react-csv";

export default function NonMembers() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const profile = persistentStore((state) => state.profile);
  const { modalOpen, modalInfo, setModalInfo } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    setModalInfo: state.setModalInfo,
  }));

  const {
    nonMembersTransactions,
    isNonMembersTransactionsLoading,
    refetchNonMembersTransactions,
  } = useEntityState((state) => ({
    nonMembersTransactions: state.nonMembersTransactions,
    isNonMembersTransactionsLoading: state.isNonMembersTransactionsLoading,
    refetchNonMembersTransactions: state.refetchNonMembersTransactions,
  }));

  useEffect(() => {
    refetchNonMembersTransactions();
  }, []);

  if (profile?.role === 3) {
    return <Page403 />;
  }

  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Added by", key: "created_by" },
    { label: "Availed Plan", key: "promo_title" },
    { label: "Payment Method", key: "payment_method_name" },
    { label: "Created At", key: "created_at" },
    { label: "Note", key: "note" },
  ];

  const formattedData = nonMembersTransactions.map((item) => ({
    ...item,
    created_at: `${helper.dateFormatter(item.created_at)}`, // Ensure it's treated as a string
  }));

  const getFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  };

  const filename = `non_member_transactions_${getFormattedDate()}.csv`;

  return (
    <div className="py-[30px]">
      <Head>
        <title>Non-Members Transactions</title>
      </Head>
      <div className="container">
        <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
          <div className="flex flex-wrap items-center justify-between gap-[15px] mb-[30px]">
            <h1
              className={`text-[40px] font-black text-black ${montserrat.className}`}
            >
              Non-Members
            </h1>
            <button
              className="inline-flex max-w-[250px] px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full"
              onClick={() => {
                setModalInfo({
                  id: "add-nonmember-transaction",
                  title: "Add Transaction",
                });
                modalState.setState({ modalOpen: true });
              }}
            >
              Add Transaction
            </button>
          </div>

          {nonMembersTransactions?.length > 0 && profile?.role === 1 && (
            <CSVLink
              data={formattedData}
              headers={csvHeaders}
              filename={`${filename}`}
              className="inline-flex max-w-[150px] px-[10px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-green-500 py-[10px] text-black text-uppercase w-full mb-4"
            >
              Export Sales
            </CSVLink>
          )}

          {isNonMembersTransactionsLoading ? (
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
              {nonMembersTransactions?.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-[150px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold">
                    No transactions found at the moment. Please try again later.
                  </h2>
                </div>
              )}

              {nonMembersTransactions?.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>Added by</TableHead>
                      <TableHead>Availed Plan</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="w-[250px]">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nonMembersTransactions?.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{item?.name}</TableCell>
                          <TableCell>{item?.created_by}</TableCell>
                          <TableCell>{item?.promo_title}</TableCell>
                          <TableCell>{item?.payment_method_name}</TableCell>
                          <TableCell>
                            {helper.dateFormatter(item.created_at)}
                          </TableCell>
                          <TableCell className="">{item?.note}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
