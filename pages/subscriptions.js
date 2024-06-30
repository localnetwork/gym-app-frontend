import BaseApi from "@/lib/api/_base.api";
import { useEffect, useState } from "react";


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


import { CSVLink } from 'react-csv'; 
import Head from "next/head";


import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
}); 

import helper from "@/lib/scrap/helper";

export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        console.log('Subscriptions page');
        const fetchSubscriptions = async() => {
            try {
                const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/subscriptions");
                setSubscriptions(res.data.data);
            }catch(error) {
                console.log('Error', error);
            }
        }

        fetchSubscriptions();
    }, []);

    const csvHeaders = [
        { label: "Created At", key: "created_at" },
        { label: "Created by", key: "created_by" },
        { label: "Availed By", key: "availed_by" },
        { label: "Availed Plan", key: "promo_title" },
        { label: "Payment Method", key: "payment_gateway" },
        { label: "Status", key: "status"}
    ];

    const formattedData = subscriptions.map(item => ({
        ...item,
        created_at: `${helper.dateFormatter(item.created_at)}`, // Ensure it's treated as a string
        status: `${item.status ? 'Expired' : 'Active'}`
    })); 

    const getFormattedDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    };

    const filename = `subscriptions-${getFormattedDate()}.csv`; 
    return  (
        <div className="py-[30px]">
            <Head>
            <title>
                Subscriptions
            </title>
            </Head>
            <div className="container">
                
                <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
                    <h1
                        className={`text-[40px] font-black mb-5 text-black ${montserrat.className}`}
                    >
                        Subscriptions
                    </h1>

                    {subscriptions?.length > 0 && (
                        <CSVLink
                            data={formattedData}
                            headers={csvHeaders}
                            filename={`${filename}`}
                            className="inline-flex max-w-[150px] px-[10px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-green-500 py-[10px] text-black text-uppercase w-full mb-4"
                        >
                            Export Sales
                        </CSVLink> 
                    )}


                    {subscriptions?.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Created At</TableHead>
                                    <TableHead className="w-[100px]">Created By</TableHead>
                                    <TableHead className="w-[100px]">Availed By</TableHead>
                                    <TableHead className="w-[100px]">Availed Plan</TableHead>
                                    <TableHead className="w-[100px]">Price</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="w-[100px]">Payment Method</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions?.map((item, index) => {
                                    
                                    return(
                                    <TableRow key={index}>
                                        <TableCell>{helper.dateFormatter(item?.created_at)}</TableCell>
                                        <TableCell>{item?.created_by}</TableCell>
                                        <TableCell>{item?.availed_by}</TableCell>
                                        <TableCell>{item?.promo_title}</TableCell>
                                        <TableCell>{helper.priceFormatter(item?.promo_price)}</TableCell>
                                        <TableCell>
                                            <span className={`text-black px-[15px] py-[5px] rounded-[5px] ${item.status ? 'bg-red-500' : 'bg-green-500'}`}>
                                            {item.status ? 'expired' : 'active'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item?.payment_gateway}</TableCell>
                                    </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
    </div>
    );
}