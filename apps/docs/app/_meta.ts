import type { MetaRecord } from "nextra";

/**
 * type MetaRecordValue =
 *  | TitleSchema
 *  | PageItemSchema
 *  | SeparatorSchema
 *  | MenuSchema
 *
 * type MetaRecord = Record<string, MetaRecordValue>
 **/
const meta: MetaRecord = {
	index: {
		title: "Introduction",
		type: "doc",
	},
	"---1": {
		type: "separator",
		title: "Getting Started",
	},
	"getting-started": {
		type: "doc",
		display: "children",
	},
	"---2": {
		type: "separator",
		title: "Design System",
	},
	"design-system": {
		type: "doc",
		display: "children",
	},
	"---3": {
		type: "separator",
		title: "Components",
	},
	components: {
		type: "doc",
		display: "children",
	},
};

export default meta;
