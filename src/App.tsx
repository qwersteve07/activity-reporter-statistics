import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import dataCSV from "./data/data.csv";
import { parseCsvToData } from "./utils/parse-csv-to-data";
import { copyToClipboard } from "./utils/clipboard";
import { CatagType, GroupType, ReporterType } from "./types/data";
import { sessionGetData, sessionSaveData } from "./utils/storage";

function App() {
  const [data, setData] = useState<Array<CatagType>>([]);
  const [reporterDialogData, setReporterDialogData] = useState<{
    name: string,
    group: GroupType
  }>();
  const reportersDialogRef = useRef<HTMLDialogElement>(null);
  const documentDialogRef = useRef<HTMLDialogElement>(null);
  const [document, setDocument] = useState<string>("");

  useEffect(() => {
    if (data.length === 0) return
    sessionSaveData(data)
  }, [data])

  useEffect(() => {
    const sessionData = sessionGetData()
    if (sessionData) {
      setData(sessionData)
      return;
    }
    const rawData = parseCsvToData(dataCSV);
    setData(() => {
      return rawData.map((data) => {
        const dataGroup = data.groups.map((group: GroupType) => {
          const reporters = group.reporters.map((reporter: ReporterType) => ({
            ...reporter,
            checked: false,
          }));
          return { ...group, reporters, checked: false };
        });

        return { ...data, groups: dataGroup };
      });
    });
  }, []);

  function generateContent() {
    const result: Array<{
      actualCompanyCounts: number,
      actualReporterCounts: number
    }> = [];

    data.forEach((d) => {
      result.push({
        actualCompanyCounts: d.groups.filter((group: GroupType) => group.checked).length,
        actualReporterCounts: d.groups
          .filter((group: GroupType) => group.checked)
          .reduce((groupAcc: number, groupCur: GroupType) => {
            return groupCur.reporters.filter((reporter: ReporterType) => reporter.checked).length + groupAcc;
          }, 0),
      });
    });
    const text = `目前出席統計共 ${getCompanyActualCounts(
      data
    )} 家 ${getReporterActualCounts(data)} 人\n\n${result
      .map((r, i) => {
        return `${data[i].name}( ${r.actualCompanyCounts} 家 ${r.actualReporterCounts
          } 人)\n${data[i].groups
            .filter((g) => g.checked)
            .map((g) => {
              const reporterCounts = g.reporters.filter((r) => r.checked).length;
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
    setDocument(text);
  }

  function getCompanyEstimateCounts(list: Array<CatagType>) {
    return list.reduce((acc: number, cur: CatagType) => {
      return cur.groups.length + acc;
    }, 0);
  }

  function getCompanyActualCounts(list: Array<CatagType>) {
    return list.reduce((acc: number, cur: CatagType) => {
      return cur.groups.filter((group: GroupType) => group.checked).length + acc;
    }, 0);
  }

  function getReporterEstimateCounts(list: Array<CatagType>) {
    return list.reduce((acc: number, cur: CatagType) => {
      return (
        cur.groups.reduce((groupAcc: number, groupCur: GroupType) => {
          return groupCur.reporters.length + groupAcc;
        }, 0) + acc
      );
    }, 0);
  }

  function getReporterActualCounts(list: Array<CatagType>) {
    return list.reduce((acc: number, cur: CatagType) => {
      return (
        cur.groups
          .filter((group: GroupType) => group.checked)
          .reduce((acc: number, cur: GroupType) => {
            return cur.reporters.filter((reporter: ReporterType) => reporter.checked).length + acc;
          }, 0) + acc
      );
    }, 0);
  }

  function changeCompanyAttend(
    catagName: string,
    groupName: string,
    checked: boolean
  ) {
    setData((prev: Array<CatagType>) => {
      return prev.map((p: CatagType) => {
        if (p.name === catagName) {
          const targetGroup = p.groups.find((group: GroupType) => group.name === groupName);
          if (targetGroup) {
            targetGroup.checked = !checked;
          }
        }
        return p;
      });
    });
  }

  function changeReporterAttend(currentReporter: ReporterType, checked: boolean) {
    setData((prev: Array<CatagType>) => {
      return prev.map((p: CatagType) => {
        if (p.name === reporterDialogData?.name) {
          const targetGroup = p.groups.find(
            (group: GroupType) => group.name === reporterDialogData.group.name
          );
          if (targetGroup) {
            const targetReporter = targetGroup.reporters.find(
              (reporter: ReporterType) => reporter.name === currentReporter.name
            );
            if (targetReporter) {
              targetReporter.checked = !checked;
            }
          }
        }
        return p;
      });
    });
  }

  function openReporterDialog(catagName: string, group: GroupType) {
    setReporterDialogData({
      name: catagName,
      group,
    });
    reportersDialogRef.current?.showModal();
  }

  function closeReporterDialog() {
    reportersDialogRef.current?.close();
  }

  function openDocumentDialog() {
    documentDialogRef.current?.showModal();
  }

  function closeDocumentDialog() {
    documentDialogRef.current?.close();
  }

  function copyText() {
    copyToClipboard(document);
  }

  return data.length === 0 ? (
    <div />
  ) : (
    <main className="flex flex-col justify-between items-center h-dvh">
      <dialog ref={documentDialogRef} className="p-6 rounded-lg w-5/6">
        <textarea defaultValue={document} rows={20} className="w-full" />
        <div className="flex justify-between items-center">
          <button className="mt-4 border-none bg-gray-300" onClick={copyText}>
            複製
          </button>
          <button
            className="mt-4 border-none bg-gray-300"
            onClick={closeDocumentDialog}
          >
            關閉
          </button>
        </div>
      </dialog>
      <dialog ref={reportersDialogRef} className="p-6  rounded-lg w-5/6">
        {!reporterDialogData ? (
          <></>
        ) : (
          <ul>
            {reporterDialogData.group.reporters.map((reporter: ReporterType) => {
              return (
                <li className="flex justify-between items-center text-lg mb-3" key={reporter.name}>
                  <label
                    htmlFor={reporter.name}
                    className="flex justify-start items-center"
                  >
                    <input
                      type="checkbox"
                      id={reporter.name}
                      checked={reporter.checked}
                      value={reporter.name}
                      onChange={() => changeReporterAttend(reporter, reporter.checked || false)}
                      className="mr-2 w-5 h-5"
                    />
                    {reporter.name}
                  </label>
                  <div>
                    <a className="text-blue-500" href={`tel:${reporter.mobile}`}>
                      {reporter.mobile}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <button
          className="mt-4 border-none bg-gray-300"
          onClick={closeReporterDialog}
        >
          關閉
        </button>
      </dialog>
      <header className="text-left text-2xl w-full pb-4 border-b-2 p-6 ">
        預計出席：
        <span className="font-bold text-gray-400">
          {getCompanyEstimateCounts(data)}
        </span>{" "}
        家{" "}
        <span className="font-bold text-gray-400">
          {getReporterEstimateCounts(data)}
        </span>{" "}
        位記者
        <br />
        目前出席：
        <span className="font-bold text-blue-500">
          {getCompanyActualCounts(data)}
        </span>{" "}
        家{" "}
        <span className="font-bold text-blue-500">
          {getReporterActualCounts(data)}
        </span>{" "}
        位記者
        <br />
      </header>
      <div className="flex-1 w-full text-left p-6 overflow-auto">
        {data.map((d: CatagType) => {
          return (
            <React.Fragment key={d.name}>
              <div className="text-xl font-bold mb-4">{d.name}</div>
              <ul className="mb-8">
                {d.groups.map((group: GroupType) => {
                  return (
                    <li className="flex justify-between items-center text-lg mb-3" key={group.name}>
                      <div className="flex justify-start items-center">
                        <input
                          type="checkbox"
                          checked={group.checked}
                          value={group.name}
                          onChange={() =>
                            changeCompanyAttend(d.name, group.name, group.checked || false)
                          }
                          className="mr-2 w-5 h-5"
                        />
                        <div onClick={() => openReporterDialog(d.name, group)}>
                          {group.name}
                        </div>
                      </div>
                      <div>
                        預計{" "}
                        <span className="font-bold text-gray-400">
                          {group.reporters.length}
                        </span>{" "}
                        人 / 實際{" "}
                        <span className="font-bold text-blue-500">
                          {group.reporters.filter((reporter: ReporterType) => reporter.checked).length}
                        </span>{" "}
                        人
                      </div>
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          );
        })}
      </div>
      <button
        className="appearance-none w-full h-16 rounded-none text-white bg-blue-500"
        onClick={() => {
          generateContent();
          openDocumentDialog();
        }}
      >
        產出統整結果
      </button>
    </main>
  );
}

export default App;
