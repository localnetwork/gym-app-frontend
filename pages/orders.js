import { useEffect, useMemo, useState } from "react";
import Flatpickr from "react-flatpickr";
import { CSVLink } from "react-csv";
import Head from "next/head";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import helper from "@/lib/scrap/helper";
import AccordionItem from "@/components/misc/AccordionItem";
import "flatpickr/dist/themes/material_green.css";
import { Montserrat } from "next/font/google";
import useEntityState from "@/lib/store/entityState";

const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import persistentStore from "@/lib/store/persistentStore";

export default function Orders() {
  const profile = persistentStore((state) => state.profile);
  const {
    orders,
    isOrdersLoading,
    statusFilter,
    startDateFilter,
    endDateFilter,
    orderIdFilter,
    setStatusFilter,
    setStartDateFilter,
    setEndDateFilter,
    setOrderIdFilter,
    refetchOrders,
  } = useEntityState();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    refetchOrders();
  }, [statusFilter, startDateFilter, endDateFilter, orderIdFilter]);

  useEffect(() => {
    if (startDateFilter && endDateFilter) {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDateFilter && orderDate <= endDateFilter;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, startDateFilter, endDateFilter]);

  const csvHeaders = useMemo(
    () => [
      { label: "Created At", key: "created_at" },
      { label: "Created by", key: "created_by" },
      { label: "Availed By", key: "availed_by" },
      { label: "Availed Plan", key: "promo_title" },
      { label: "Payment Method", key: "payment_gateway" },
      { label: "Status", key: "status" },
      { label: "Total Estimated Earnings", key: "total_estimated_earnings" }, // New column
    ],
    []
  );

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

  const filename = `subscriptions-${getFormattedDate()}.csv`;

  const calculateTotalEstimatedEarnings = () => {
    let total = 0;
    orders.forEach((item) => {
      total += parseFloat(item.promo_price); // Example calculation based on promo_price field
    });
    return total.toFixed(2);
  };

  const formattedData = useMemo(
    () => [
      ...orders.map((item) => ({
        ...item,
        created_at: helper.dateFormatter(item.created_at),
        status: item.status ? "Expired" : "Active",
      })),
      {
        created_at: "",
        created_by: "",
        availed_by: "",
        promo_title: "",
        payment_gateway: "",
        status: "Total Estimated Earnings",
        total_estimated_earnings: calculateTotalEstimatedEarnings(),
      },
    ],
    [orders]
  );

  const chartData = useMemo(() => {
    const labels = filteredOrders.map((order) =>
      helper.dateFormatter(order.created_at)
    );
    const earningsData = filteredOrders.map((order) =>
      parseFloat(order.promo_price)
    );

    return {
      labels,
      datasets: [
        {
          label: "Total Earnings",
          data: earningsData,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [filteredOrders]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Earnings by Date",
      },
    },
  };

  const toggleChartVisibility = () => {
    setIsChartVisible(!isChartVisible);
  };

  return (
    <div className="py-[30px]">
      <Head>
        <title>Orders</title>
      </Head>
      <div className="container">
        <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
          <div className="flex items-center justify-between mb-[30px]">
            <h1
              className={`text-[40px] font-black mb-5 text-black ${montserrat.className}`}
            >
              Orders
            </h1>
            {profile?.role === 1 && (
              <>
                {orders?.length > 0 && (
                  <CSVLink
                    data={formattedData}
                    headers={csvHeaders}
                    filename={filename}
                    className="inline-flex max-w-[150px] px-[10px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-green-500 py-[10px] text-black text-uppercase w-full"
                  >
                    Export Sales
                  </CSVLink>
                )}
              </>
            )}
          </div>

          <div className="mb-3 select-none flex gap-x-[15px]">
            <div>
              <label className="mr-2" htmlFor="status">
                Status
              </label>
              <select
                className="border w-full border-black px-[15px] py-[5px] select-none outline-none"
                name="status"
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <div className="relative">
                <label className="mr-1">Start Date</label>
                <Flatpickr
                  name="start_date"
                  id="start_date"
                  className="border w-full border-black px-[15px] py-[5px] select-none outline-none"
                  options={{
                    enableTime: false,
                    dateFormat: "Y-m-d",
                  }}
                  value={startDateFilter}
                  onChange={(date) => {
                    setStartDateFilter(date[0]);
                    if (endDateFilter && date[0] > endDateFilter) {
                      setEndDateFilter(null);
                      alert(
                        "Start date cannot be later than end date. End date has been cleared."
                      );
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <label className="mr-1">End Date</label>
                <Flatpickr
                  name="end_date"
                  id="end_date"
                  className="border w-full border-black px-[15px] py-[5px] select-none outline-none"
                  options={{
                    enableTime: false,
                    dateFormat: "Y-m-d",
                  }}
                  value={endDateFilter}
                  onChange={(date) => {
                    if (startDateFilter && date[0] < startDateFilter) {
                      alert("End date cannot be earlier than start date");
                      setEndDateFilter(null);
                    } else {
                      setEndDateFilter(date[0]);
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label>Order ID:</label>
              <input
                type="number"
                className="border w-full border-black px-[15px] py-[5px] select-none outline-none"
                value={orderIdFilter}
                onChange={(e) => setOrderIdFilter(e.target.value)}
              />
            </div>
          </div>

          {orders.length > 0 ? (
            <>
              <button
                onClick={toggleChartVisibility}
                className="mb-5 flex items-center px-4 py-2 bg-blue-500 text-white rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>

                {isChartVisible ? "Hide Chart" : "Show Chart"}
              </button>
              {isChartVisible && (
                <div className="mb-5">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}
              {orders.map((item, index) => (
                <AccordionItem item={item} key={index} />
              ))}
            </>
          ) : (
            <div className="flex flex-col text-[20px] font-bold py-[30px] items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-[150px] h-[150px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
