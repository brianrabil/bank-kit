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
		title: "Quick Start",
		type: "doc",
	},
	installation: {
		type: "doc",
		title: "Installation",
	},
	changelog: {
		title: "Changelog",
		type: "doc",
	},
};

export default meta;
