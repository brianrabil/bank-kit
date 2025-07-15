"use client";

import { Table } from "@bank-kit/ui/src/registry/new-york/ui/table";
import { cn } from "@bank-kit/ui/lib/utils";
import {
	type ColumnDef,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";
import * as React from "react";

/** -------------------------------------------------------------------------
 * Transaction type
 * --------------------------------------------------------------------------*/
export interface Transaction {
	id: string;
	postedAt: Date; // transaction date
	description: string;
	category: string;
	amount: number; // negative for debits, positive for credits
	balance: number; // running balance after txn
	status: "pending" | "posted";
}

/** -------------------------------------------------------------------------
 * Column definitions
 * --------------------------------------------------------------------------*/
const columnHelper = {
	date: {
		header: "Date",
		cell: (row: Transaction) => format(row.postedAt, "MMM d, yyyy"),
		enableSorting: true,
	},
	description: {
		header: "Description",
		cell: (row: Transaction) => row.description,
		enableSorting: true,
	},
	category: {
		header: "Category",
		cell: (row: Transaction) => row.category,
		enableSorting: true,
	},
	amount: {
		header: "Amount",
		cell: (row: Transaction) =>
			row.amount.toLocaleString(undefined, {
				style: "currency",
				currency: "USD",
			}),
		enableSorting: true,
	},
	balance: {
		header: "Balance",
		cell: (row: Transaction) =>
			row.balance.toLocaleString(undefined, {
				style: "currency",
				currency: "USD",
			}),
		enableSorting: true,
	},
};

const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "postedAt",
		header: () => "Date",
		cell: ({ getValue }) => format(getValue<Date>(), "MMM d, yyyy"),
	},
	{
		accessorKey: "description",
		header: () => "Description",
		cell: ({ getValue }) => getValue<string>(),
	},
	{
		accessorKey: "category",
		header: () => "Category",
		cell: ({ getValue }) => getValue<string>(),
	},
	{
		accessorKey: "amount",
		header: () => "Amount",
		cell: ({ getValue }) => {
			const amount = getValue<number>();
			const formatted = amount.toLocaleString(undefined, {
				style: "currency",
				currency: "USD",
			});
			return (
				<span className={amount < 0 ? "text-danger" : "text-success"}>
					{formatted}
				</span>
			);
		},
	},
	{
		accessorKey: "balance",
		header: () => "Balance",
		cell: ({ getValue }) => {
			const balance = getValue<number>();
			return balance.toLocaleString(undefined, {
				style: "currency",
				currency: "USD",
			});
		},
	},
];

/** -------------------------------------------------------------------------
 * TransactionsTable component
 * --------------------------------------------------------------------------*/

export interface TransactionsTableProps {
	data: Transaction[];
	className?: string;
}

export function TransactionsTable({ data, className }: TransactionsTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: false,
	});

	return (
		<Table className={cn("w-full text-sm", className)}>
			{/* Header */}
			<thead className="sticky top-0 z-10 bg-background">
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							const meta = header.column.columnDef.meta as
								| { className?: string }
								| undefined;
							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={cn(
										"whitespace-nowrap px-4 py-2 text-left font-medium",
										meta?.className,
									)}
								>
									{header.isPlaceholder ? null : (
										<button
											type="button"
											className="inline-flex items-center gap-1"
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
											{header.column.getIsSorted() === "asc" && (
												<ArrowUp className="h-3 w-3" />
											)}
											{header.column.getIsSorted() === "desc" && (
												<ArrowDown className="h-3 w-3" />
											)}
										</button>
									)}
								</th>
							);
						})}
					</tr>
				))}
			</thead>
			{/* Body */}
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id} className="border-t">
						{row.getVisibleCells().map((cell) => (
							<td key={cell.id} className="whitespace-nowrap px-4 py-2">
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	);
}

/** -------------------------------------------------------------------------
 * Example usage
 * --------------------------------------------------------------------------*/
// const demo: Transaction[] = [
//   {
//     id: "1",
//     postedAt: new Date(),
//     description: "Coffee Shop",
//     category: "Food & Drink",
//     amount: -4.5,
//     balance: 1250.56,
//     status: "posted",
//   },
// ];
// <TransactionsTable data={demo} />
