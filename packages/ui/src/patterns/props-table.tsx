import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@bank-kit/ui/registry/new-york/ui/table";
import { Badge } from "@bank-kit/ui/registry/new-york/ui/badge";

/**
 * Represents a single property in the props table
 * @interface Prop
 */
interface Prop {
	/** The name of the property */
	name: string;
	/** The TypeScript type of the property */
	type: string;
	/** The default value of the property, if any */
	defaultValue?: string;
	/** A description of what the property does */
	description: string;
	/** Whether this property is required */
	required?: boolean;
}

/**
 * Props for the PropsTable component
 * @interface PropsTableProps
 */
interface PropsTableProps {
	/** Array of property definitions to display in the table */
	props: Prop[];
}

/**
 * Renders a table displaying component properties and their details
 * @param {PropsTableProps} props - The props for the PropsTable component
 * @returns {JSX.Element} A table showing property names, types, descriptions and default values
 * @example
 * ```tsx
 * <PropsTable props={[
 *   {
 *     name: 'size',
 *     type: '"sm" | "md" | "lg"',
 *     description: 'The size of the component',
 *     defaultValue: 'md'
 *   }
 * ]} />
 * ```
 */
export function PropsTable({ props }: PropsTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[180px]">Name</TableHead>
						<TableHead className="w-[200px]">Type</TableHead>
						<TableHead>Description</TableHead>
						<TableHead className="w-[150px]">Default</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{props.map((prop) => (
						<TableRow key={prop.name}>
							<TableCell className="font-mono text-sm">
								{prop.name}
								{prop.required && (
									<Badge variant="outline" className="ml-2 text-xs">
										Required
									</Badge>
								)}
							</TableCell>
							<TableCell className="font-mono text-xs">{prop.type}</TableCell>
							<TableCell>{prop.description}</TableCell>
							<TableCell className="font-mono text-xs">
								{prop.defaultValue || "-"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
