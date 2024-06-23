import Page403 from "@/components/statuses/Page403";
import useEntityState from "@/lib/store/entityState";
import Head from "next/head";
import { useEffect } from "react";
import persistentStore from "@/lib/store/persistentStore";
export default function Durations() {
    const profile = persistentStore((state) => state.profile); 


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
                    {membershipDurations?.map((duration, index) => (
                        <div key={index}>
                            {duration.title}
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
        </div>
    )
}