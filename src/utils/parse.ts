import { CatagType, GroupType } from "../types/data";
import { RowType } from "../types/rawData";
import { formatMobile } from "./format";

export function csvToJson(csvString: string) {
	const rows = csvString.split("\n");
	const headers = rows[0].split(",");
	const jsonData:any = [];
	rows.forEach((row, i) => {
		if (i === 0) return;
		const obj:any = {};
		const values = row.replace("\r", "").split(",");
		for (let i = 0; i < headers.length; i++) {
			const key = headers[i].trim();
			const value = values[i].trim();
			obj[key] = value;
		}
		jsonData.push(obj);
	});

	return jsonData;
}

export const jsonToRawData: (data: Array<RowType>)=> Array<CatagType> = (data) => {
	const catags: { [key: string]: Array<RowType> } = {};

	data.forEach((d: RowType) => {
		const catagName = d["分類"];
		if (!catags[catagName]) {
			catags[catagName] = [d];
		} else {
			catags[d["分類"]].push(d);
		}
	});

	const result: Array<CatagType> = [];

	Object.entries(catags).forEach((c) => {
		const RowArr: Array<RowType> = c[1];
		const groups: { [key: string]: GroupType } = {};
		RowArr.forEach((row: RowType) => {
			const mediaName = row["媒體"];
			if (!groups[mediaName]) {
				groups[mediaName] = {
					name: mediaName,
					reporters: [
						{
							name: row["名字"],
							mobile: formatMobile(row["電話"]),
						},
					],
				};
			} else {
				groups[mediaName].reporters.push({
					name: row["名字"],
					mobile: formatMobile(row["電話"]),
				});
			}
		});

		result.push({
			name: c[0],
			groups: Object.values(groups),
		});
	});

	return result;
};
