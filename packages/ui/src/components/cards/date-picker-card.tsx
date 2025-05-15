import { Card, CardContent } from "@/registry/new-york/ui/card";
import DatePickerWithRange from "@/registry/new-york/ui/date-picker-with-range";
import { Label } from "@/registry/new-york/ui/label";

export function DatePickerCard() {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-2">
					<Label htmlFor="date" className="shrink-0">
						Pick a date
					</Label>
					<DatePickerWithRange className="[&>button]:w-[260px]" />
				</div>
			</CardContent>
		</Card>
	);
}
