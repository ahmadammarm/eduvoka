import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAnalyticsData } from "../_lib/data";
import OverviewCards from "./OverviewCards";
import ActivityChart from "./ActivityChart";
import SubjectTable from "./SubjectTable";
import RecentSessionList from "./RecentSessionList";
import StudyTimeChart from "./StudyTimeChart";

export default async function AnalyticsContent() {
    const data = await getAnalyticsData();

    return (
        <div className="bg-white dark:bg-stone-900 rounded-xl p-6 space-y-6 shadow-sm border">

            <OverviewCards stats={data.overview} />

            <Tabs defaultValue="activity" className="w-full">
                <TabsList className="w-full h-12 bg-gray-100 dark:bg-stone-800">
                    <TabsTrigger
                        value="activity"
                        className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700"
                    >
                        Aktivitas Harian
                    </TabsTrigger>
                    <TabsTrigger
                        value="subjects"
                        className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700"
                    >
                        Per Subtest
                    </TabsTrigger>
                    <TabsTrigger
                        value="studytime"
                        className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700"
                    >
                        Waktu Belajar
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4 mt-4">
                    <ActivityChart dailyActivity={data.dailyActivity} />
                    <RecentSessionList sessions={data.recentSessions} />
                </TabsContent>

                <TabsContent value="subjects" className="mt-4">
                    <SubjectTable subjectPerformance={data.subjectPerformance ?? []} />
                </TabsContent>

                <TabsContent value="studytime" className="mt-4">
                    <StudyTimeChart distribution={data.studyTimeDistribution} />
                </TabsContent>
            </Tabs>
        </div>
    );
}