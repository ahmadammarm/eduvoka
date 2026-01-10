import { Book, CreditCard, Search, Settings } from "lucide-react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SearchDialogContent() {
	return (
		<DialogContent className="md:max-w-2xl p-0 gap-0">
			<DialogTitle className="sr-only">Search</DialogTitle>
			<div className="flex items-center border-b px-4 py-3">
				<Search className="h-5 w-5 text-muted-foreground mr-2" />
				<input
					type="text"
					placeholder="Search here..."
					className="flex-1 outline-none text-base"
				/>
			</div>

			<div className="max-h-[500px] overflow-y-auto">
				<div className="p-4">
					<h3 className="text-sm font-light text-muted-foreground mb-2">
						SUGGESTIONS
					</h3>
					<div className="space-y-1">
						<Button
							variant="ghost"
							className="w-full justify-start font-normal hover:bg-primary/20 hover:text-black dark:hover:text-white"
						>
							<Book className="h-4 w-4" />
							Materi
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start font-normal hover:bg-primary/20 hover:text-black dark:hover:text-white"
						>
							<CreditCard className="h-4 w-4" />
							Subscriptions
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start font-normal hover:bg-primary/20 hover:text-black dark:hover:text-white"
						>
							<Settings className="h-4 w-4" />
							Settings
						</Button>
					</div>
				</div>
			</div>
		</DialogContent>
	);
}
