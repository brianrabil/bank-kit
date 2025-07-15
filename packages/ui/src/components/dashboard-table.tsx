"use client";

import type { UniqueIdentifier } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	useReactTable,
	type ColumnDef,
	getCoreRowModel,
} from "@tanstack/react-table";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
	TableHead,
} from "@bank-kit/ui/registry/new-york/ui/table";
import type { DragEndEvent } from "@dnd-kit/core";
import {
	DndContext,
	closestCenter,
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
	KeyboardSensor,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSortable } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { flexRender } from "@tanstack/react-table";

/**
 * Props for the DashboardTable component.
 *
 * @template T - The type of each row, must include a unique `id` property.
 * @property data - Array of row data to display.
 * @property columns - Column definitions for TanStack Table.
 * @property initialPageSize - Number of rows per page initially.
 * @property pageSizeOptions - Available page size options for pagination.
 * @property onReorder - Optional callback invoked with reordered data after drag-and-drop.
 */
export interface DashboardTableProps<T> {
	data: T[];
	columns: ColumnDef<T>[];
	initialPageSize?: number;
	pageSizeOptions?: number[];
	onReorder?: (data: T[]) => void;
}

/**
 * **DashboardTable**
 *
 * A generic, draggable table component using TanStack Table and DnD Kit.
 * Supports row selection, pagination, and drag-and-drop reordering.
 *
 * @template T - Row data type extending `{ id: UniqueIdentifier }`.
 * @param props.data - The data array to render in the table.
 * @param props.columns - Column definitions for rendering headers and cells.
 * @param props.initialPageSize - Initial page size for pagination (default: 10).
 * @param props.pageSizeOptions - Options for page size selection.
 * @param props.onReorder - Callback when rows are reordered via drag-and-drop.
 * @returns A rendered table with draggable rows.
 */
export function DashboardTable<T extends { id: UniqueIdentifier }>({
	data,
	columns,
	initialPageSize = 10,
	pageSizeOptions = [10, 20, 50],
	onReorder,
}: DashboardTableProps<T>) {
	const table = useReactTable({
		data,
		columns,
		initialState: {
			pagination: {
				pageSize: initialPageSize,
			},
		},
		getCoreRowModel: getCoreRowModel(),
		// ...other table options
	});

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor),
	);

	// Composable logic for drag and drop reordering
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id !== over?.id && onReorder) {
			const oldIndex = table
				.getRowModel()
				.rows.findIndex((r) => r.id === String(active.id));
			const newIndex = table
				.getRowModel()
				.rows.findIndex((r) => r.id === String(over?.id));
			const reordered = arrayMove(data, oldIndex, newIndex);
			onReorder(reordered);
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			modifiers={[restrictToVerticalAxis]}
		>
			<SortableContext
				items={data.map((item) => item.id)}
				strategy={verticalListSortingStrategy}
			>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((hg) => (
							<TableRow key={hg.id}>
								{hg.headers.map((header) => (
									<TableHead key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => {
							const { setNodeRef, transform, transition, isDragging } =
								useSortable({ id: row.id });
							return (
								<TableRow
									key={row.id}
									ref={setNodeRef}
									style={{
										transform: transform
											? `translate3d(${transform.x}px, ${transform.y}px, 0)`
											: undefined,
										transition,
									}}
									data-dragging={isDragging}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</SortableContext>
		</DndContext>
	);
}
