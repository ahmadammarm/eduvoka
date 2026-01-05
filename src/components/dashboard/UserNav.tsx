import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export default function UserNav() {
	const handleSignout = () => {
		signOut({ callbackUrl: "/auth/sign-in" });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-lg bg-black/80 hover:bg-black/80 shadow"
				>
					<Avatar className="w-full h-full rounded-lg">
						<AvatarImage
							src="https://avatars.githubusercontent.com/ahmadammarm"
							alt="@eduvokaUser"
						/>
						<AvatarFallback className="rounded-lg bg-black/80 text-white">
							EU
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="mt-2 -mr-2 rounded-lg w-75">
				<DropdownMenuLabel className="flex gap-2">
					<Avatar className="w-10 h-10 mt-1 rounded-full">
						<AvatarImage
							src="https://avatars.githubusercontent.com/ahmadammarm"
							alt="@eduvokaUser"
						/>
						<AvatarFallback>EU</AvatarFallback>
					</Avatar>
					<div className="wrap-anywhere">
						<div className="text-base font-semibold">Eduvoka User</div>
						<div className="text-sm font-light text-muted-foreground">
							ahmadammar@eduvoka.com
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="focus:text-black focus:bg-primary/20 dark:focus:text-white p-2">
					<User className="w-4 h-4 text-black dark:text-white" />
					My Account
				</DropdownMenuItem>
				<DropdownMenuItem className="focus:text-black focus:bg-primary/20 dark:focus:text-white p-2">
					<CreditCard className="w-4 h-4 text-black dark:text-white" />
					Billing
				</DropdownMenuItem>
				<DropdownMenuItem className="focus:text-black focus:bg-primary/20 dark:focus:text-white p-2">
					<Settings className="w-4 h-4 text-black dark:text-white" />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Button
						variant="ghost"
						onClick={handleSignout}
						className="text-red-500 focus:text-red-500 focus:bg-red-100 dark:focus:bg-red-950 dark:text-red-400 p-2 w-full justify-start"
					>
						<LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
						Logout
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
