import { useEffect, useRef, useState } from "react";
import "./App.css";
// import rawData from './data.json'
import dataCSV from "./data.csv";
import { parseCsvToData } from "./parse-csv-to-data";
import { copyToClipboard } from "./clipboard";

function App() {
  const [data, setData] = useState<any>([]);
  const [reporterDialogData, setReporterDialogData] = useState<any>([]);
  const reportersDialogRef = useRef<HTMLDialogElement>(null);
  const documentDialogRef = useRef<HTMLDialogElement>(null);
  const [document, setDocument] = useState<string>("");

  useEffect(() => {
    const rawData = parseCsvToData(dataCSV);
    setData(() => {
      return rawData.map((d) => {
        const dGroup = d.group.map((g: any) => {
          let reporters = g.reporters.map((r: any) => ({
            ...r,
            checked: true,
          }));
          return { ...g, reporters, checked: true };
        });

        return { ...d, group: dGroup };
      });
    });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);
  useEffect(() => {
    console.log(document);
  }, [document]);

  function generateContent() {
    let result = [];
    data.forEach((d) => {
      result.push({
        actualCompanyCounts: d.group.filter((g: any) => g.checked).length,
        actualReporterCounts: d.group
          .filter((g: any) => g.checked)
          .reduce((gacc: any, gcur: any) => {
            return gcur.reporters.filter((r: any) => r.checked).length + gacc;
          }, 0),
      });
    });
    const text = `目前出席統計共 ${getCompanyActualCounts(
      data
    )} 家 ${getReporterActualCounts(data)} 人\n\n${result
      .map((r, i) => {
        return `${data[i].name}( ${r.actualCompanyCounts} 家 ${r.actualReporterCounts
          } 人)\n${data[i].group
            .filter((g) => g.checked)
            .map((g) => {
              let reporterCounts = g.reporters.filter((r) => r.checked).length;
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

  function getCompanyEstimateCounts(list: any) {
    return list.reduce((acc: any, cur: any) => {
      return cur.group.length + acc;
    }, 0);
  }

  function getCompanyActualCounts(list: any) {
    return list.reduce((acc: any, cur: any) => {
      return cur.group.filter((g: any) => g.checked).length + acc;
    }, 0);
  }

  function getReporterEstimateCounts(list: any) {
    return list.reduce((acc: any, cur: any) => {
      return (
        cur.group.reduce((gacc: any, gcur: any) => {
          return gcur.reporters.length + gacc;
        }, 0) + acc
      );
    }, 0);
  }

  function getReporterActualCounts(list: any) {
    return list.reduce((acc: any, cur: any) => {
      return (
        cur.group
          .filter((g: any) => g.checked)
          .reduce((gacc: any, gcur: any) => {
            return gcur.reporters.filter((r: any) => r.checked).length + gacc;
          }, 0) + acc
      );
    }, 0);
  }

  function changeCompanyAttend(
    catagName: string,
    groupName: string,
    checked: boolean
  ) {
    setData((prev: any) => {
      return prev.map((p: any) => {
        if (p.name === catagName) {
          let targetGroup = p.group.find((g: any) => g.name === groupName);
          targetGroup.checked = !checked;
        }
        return p;
      });
    });
  }

  function changeReporterAttend(reporter: any, checked: boolean) {
    setData((prev: any) => {
      return prev.map((p: any) => {
        if (p.name === reporterDialogData.name) {
          let targetGroup = p.group.find(
            (g: any) => g.name === reporterDialogData.group.name
          );
          let targetReporter = targetGroup.reporters.find(
            (r: any) => r.name === reporter.name
          );
          targetReporter.checked = !checked;
        }
        return p;
      });
    });
  }

  function openReporterDialog(catagName: string, group: any) {
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
        {reporterDialogData.length === 0 ? (
          <></>
        ) : (
          <ul>
            {reporterDialogData.group.reporters.map((r: any) => {
              return (
                <li className="flex justify-between items-center text-lg mb-3">
                  <label
                    htmlFor={r.name}
                    className="flex justify-start items-center"
                  >
                    <input
                      type="checkbox"
                      id={r.name}
                      checked={r.checked}
                      value={r.name}
                      onChange={() => changeReporterAttend(r, r.checked)}
                      className="mr-2 w-5 h-5"
                    />
                    {r.name}
                  </label>
                  <div>
                    <a className="text-blue-500" href={`tel:${r.mobile}`}>
                      {r.mobile}
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
        {data.map((d: any) => {
          return (
            <>
              <div className="text-xl font-bold mb-4">{d.name}</div>
              <ul className="mb-8">
                {d.group.map((g: any) => {
                  return (
                    <li className="flex justify-between items-center text-lg mb-3">
                      <div className="flex justify-start items-center">
                        <input
                          type="checkbox"
                          checked={g.checked}
                          value={g.name}
                          onChange={() =>
                            changeCompanyAttend(d.name, g.name, g.checked)
                          }
                          className="mr-2 w-5 h-5"
                        />
                        <div onClick={() => openReporterDialog(d.name, g)}>
                          {g.name}
                        </div>
                      </div>
                      <div>
                        預計{" "}
                        <span className="font-bold text-gray-400">
                          {g.reporters.length}
                        </span>{" "}
                        人 / 實際{" "}
                        <span className="font-bold text-blue-500">
                          {g.reporters.filter((r: any) => r.checked).length}
                        </span>{" "}
                        人
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
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
        複製內容
      </button>
    </main>
  );
}

export default App;
