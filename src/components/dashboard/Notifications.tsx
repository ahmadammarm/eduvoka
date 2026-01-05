import { Bell } from "lucide-react";
import { Button } from "../ui/button";

export default function Notifications() {
	return (
		<Button
			variant="ghost"
			size="icon"
			className="relative hover:bg-black/80 dark:hover:bg-white/80 rounded-lg"
		>
			<Bell className="h-5 w-5" />
			<span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500" />
		</Button>
	);
}
