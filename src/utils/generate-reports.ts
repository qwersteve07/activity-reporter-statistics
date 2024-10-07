import { CatagType, GroupType, ReporterType } from "../types/data";

function generateReports(data: Array<CatagType>,companyCounts: number, reporterCounts:number) {
    const result: Array<{
      actualCompanyCounts: number;
      actualReporterCounts: number;
    }> = [];

    data.forEach((d) => {
      result.push({
        actualCompanyCounts: d.groups.filter(
          (group: GroupType) => group.checked
        ).length,
        actualReporterCounts: d.groups
          .filter((group: GroupType) => group.checked)
          .reduce((groupAcc: number, groupCur: GroupType) => {
            return (
              groupCur.reporters.filter(
                (reporter: ReporterType) => reporter.checked
              ).length + groupAcc
            );
          }, 0),
      });
    });
    const text = `目前出席統計共 ${companyCounts} 家 ${reporterCounts} 人\n\n${result
      .map((r, i) => {
        return `${data[i].name}( ${r.actualCompanyCounts} 家 ${r.actualReporterCounts
          } 人)\n${data[i].groups
            .filter((g) => g.checked)
            .map((g) => {
              const reporterCounts = g.reporters.filter(
                (r) => r.checked
              ).length;
              if (reporterCounts > 1) {
                return `${g.name}(${reporterCounts}人)`;
              } else {
                return `${g.name}`;
              }
            })
            .join("、")}
    `;
      })
      .join("\n")}
    `;

    return text
  }

  export default generateReports