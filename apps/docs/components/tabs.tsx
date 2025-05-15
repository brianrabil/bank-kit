"use client";

import { useEffect, useRef, useState } from "react";

const TABS = [
	{ label: "All Posts", value: "all-posts" },
	{ label: "Interactions", value: "interactions" },
	{ label: "Resources", value: "resources" },
	{ label: "Docs", value: "docs" },
];

export function Tabs() {
	const [activeTab, setActiveTab] = useState(TABS[0]?.value);
	const containerRef = useRef<HTMLDivElement>(null);
	const activeTabRef = useRef<HTMLButtonElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: The dependencies activeTabRef and containerRef are stable because they are refs and do not change between renders, so it's safe to omit them from the dependency array.
	useEffect(() => {
		const container = containerRef.current;

		if (container && activeTab) {
			const activeTabElement = activeTabRef.current;

			if (activeTabElement) {
				const { offsetLeft, offsetWidth } = activeTabElement;

				const clipLeft = offsetLeft;
				const clipRight = offsetLeft + offsetWidth;

				container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}% round 17px)`;
			}
		}
	}, [activeTab, activeTabRef, containerRef]);

	return (
		<div className="relative mx-auto flex w-fit flex-col items-center rounded-full">
			<div
				ref={containerRef}
				className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
			>
				<div className="relative flex w-full justify-center bg-black dark:bg-white">
					{TABS.map((tab) => (
						<button
							key={tab.value}
							type="button"
							onClick={() => setActiveTab(tab.value)}
							className="flex h-8 items-center rounded-full p-3 text-sm font-medium text-white dark:text-black"
							tabIndex={-1}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>
			<div className="relative flex w-full justify-center">
				{TABS.map((tab) => {
					const isActive = activeTab === tab.value;

					return (
						<button
							key={tab.value}
							type="button"
							ref={isActive ? activeTabRef : null}
							onClick={() => setActiveTab(tab.value)}
							className="flex h-8 items-center rounded-full p-3 text-sm font-medium text-neutral-500 dark:text-neutral-300"
						>
							{tab.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
