import { Suspense } from "react";
import AnalyticsContent from "./_components/AnalyticsContent";
import AnalyticsLoading from "./loading";

export default function AnalyticsPage() {
    return (
        <Suspense fallback={<AnalyticsLoading />}>
            <AnalyticsContent />
        </Suspense>
    );
}