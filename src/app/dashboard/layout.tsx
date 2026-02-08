import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardFooter from "./_components/Footer";
import DashboardNavbar from "./_components/Navbar";
import { DashboardSidebar } from "./_components/Sidebar";

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
			className="py-6 bg-white dark:bg-black min-h-screen"
		>
			<div
				className="fixed inset-0 -z-10 h-full w-full"
				style={{
					backgroundImage:
						"radial-gradient(ellipse 70% 35% at 50% 0%, rgba(240, 223, 201, 0.5), transparent 80%)",
				}}
			/>
			<DashboardSidebar />
			<SidebarInset className="bg-transparent lg:container lg:mx-auto lg:px-12">
				<DashboardNavbar />
				{children}
				<DashboardFooter />
			</SidebarInset>
		</SidebarProvider>
	);
}
