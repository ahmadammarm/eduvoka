"use client";

import { Languages } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LanguageSettings() {
	const [lang, setLang] = useState("indonesia");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative hover:bg-black/80 dark:hover:bg-white/80 rounded-lg"
				>
					<Languages className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-12 mt-2">
				<DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
					<DropdownMenuRadioItem
						value="indonesia"
						className="[&>span]:hidden p-2 data-[state=checked]:bg-primary/20 focus:bg-primary/10 focus:text-black"
					>
						🇮🇩 Indonesia
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem
						value="english"
						className="[&>span]:hidden p-2 data-[state=checked]:bg-primary/20 focus:bg-primary/10 focus:text-black"
					>
						🇬🇧 English
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
