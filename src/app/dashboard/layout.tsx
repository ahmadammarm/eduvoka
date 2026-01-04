import DashboardFooter from "@/components/dashboard/Footer";
import DashboardNavbar from "@/components/dashboard/Navbar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "19rem",
				} as React.CSSProperties
			}
			className="py-6 bg-tertiary/10 dark:bg-transparent min-h-screen"
		>
			<div className="fixed inset-0 -z-10 h-full w-full bg-black/90 dark:bg-white/10 -top-1/2 left-0" />
			<DashboardSidebar />
			<SidebarInset className="bg-transparent lg:container lg:mx-auto lg:px-12">
				<DashboardNavbar />
				{children}
				<DashboardFooter />
			</SidebarInset>
		</SidebarProvider>
	);
}
