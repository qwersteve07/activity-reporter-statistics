import { CatagType, GroupType, ReporterType } from "../types/data";

export function getCompanyEstimateCounts(list: Array<CatagType>) {
	return list.reduce((acc: number, cur: CatagType) => {
		return cur.groups.length + acc;
	}, 0);
}

export function getCompanyActualCounts(list: Array<CatagType>) {
	return list.reduce((acc: number, cur: CatagType) => {
		return (
			cur.groups.filter((group: GroupType) => group.checked).length + acc
		);
	}, 0);
}

export function getReporterEstimateCounts(list: Array<CatagType>) {
	return list.reduce((acc: number, cur: CatagType) => {
		return (
			cur.groups.reduce((groupAcc: number, groupCur: GroupType) => {
				return groupCur.reporters.length + groupAcc;
			}, 0) + acc
		);
	}, 0);
}

export function getReporterActualCounts(list: Array<CatagType>) {
	return list.reduce((acc: number, cur: CatagType) => {
		return (
			cur.groups
				.filter((group: GroupType) => group.checked)
				.reduce((acc: number, cur: GroupType) => {
					return (
						cur.reporters.filter(
							(reporter: ReporterType) => reporter.checked
						).length + acc
					);
				}, 0) + acc
		);
	}, 0);
}
