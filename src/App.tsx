import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import dataCSV from "./data/data.csv";
import { parseCsvToData } from "./utils/parse-csv-to-data";
import { CatagType, GroupType, ReporterType } from "./types/data";
import { sessionGetData, sessionSaveData } from "./utils/storage";
import Group from "./components/Group";
import DocumentDialog from "./components/DocumentDialog";
import ReporterDialog from "./components/ReporterDialog";
import generateReports from "./utils/generate-reports";
import { getCompanyActualCounts, getCompanyEstimateCounts, getReporterActualCounts, getReporterEstimateCounts } from "./utils/getCounts";

function App() {
  const [data, setData] = useState<Array<CatagType>>([]);
  const [reporterDialogData, setReporterDialogData] = useState<{
    name: string;
    group: GroupType;
  }>();
  const reportersDialogRef = useRef<HTMLDialogElement>(null);
  const documentDialogRef = useRef<HTMLDialogElement>(null);
  const [document, setDocument] = useState<string>("");

  useEffect(() => {
    if (data.length === 0) return;
    sessionSaveData(data);
  }, [data]);

  useEffect(() => {
    const sessionData = sessionGetData();
    if (sessionData) {
      setData(sessionData);
      return;
    }
    const rawData = parseCsvToData(dataCSV);
    setData(() => {
      return rawData.map((data) => {
        const dataGroup = data.groups.map((group: GroupType) => {
          const reporters = group.reporters.map(
            (reporter: ReporterType) => ({
              ...reporter,
              checked: false,
            })
          );
          return { ...group, reporters, checked: false };
        });

        return { ...data, groups: dataGroup };
      });
    });
  }, []);

  function onChangeCompanyAttend(
    catagName: string,
    groupName: string,
    checked: boolean
  ) {
    setData((prev: Array<CatagType>) => {
      return prev.map((p: CatagType) => {
        if (p.name === catagName) {
          const targetGroup = p.groups.find(
            (group: GroupType) => group.name === groupName
          );
          if (targetGroup) {
            targetGroup.checked = !checked;
          }
        }
        return p;
      });
    });
  }

  function onChangeReporterAttend(
    currentReporter: ReporterType,
    checked: boolean
  ) {
    setData((prev: Array<CatagType>) => {
      return prev.map((p: CatagType) => {
        if (p.name === reporterDialogData?.name) {
          const targetGroup = p.groups.find(
            (group: GroupType) =>
              group.name === reporterDialogData.group.name
          );
          if (targetGroup) {
            const targetReporter = targetGroup.reporters.find(
              (reporter: ReporterType) =>
                reporter.name === currentReporter.name
            );
            if (targetReporter) {
              targetReporter.checked = !checked;
            }
            if (
              targetGroup.reporters.every(
                (reporter: ReporterType) => !reporter.checked
              )
            ) {
              targetGroup.checked = false;
            } else {
              targetGroup.checked = true;
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

  if (data.length === 0) return <div />

  return (
    <main className="flex flex-col justify-between items-center h-dvh">
      <DocumentDialog ref={documentDialogRef} text={document} onClose={closeDocumentDialog} />
      <ReporterDialog ref={reportersDialogRef} data={reporterDialogData} onChangeReporterAttend={onChangeReporterAttend} onClose={closeReporterDialog} />
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
      <div className="w-full text-left p-6 overflow-auto h-[calc(100%-170px)]">
        {data.map((d: CatagType) => {
          return (
            <React.Fragment key={d.name}>
              <div className="text-xl font-bold mb-4">
                {d.name}
              </div>
              <ul className="mb-8">
                {d.groups.map((group: GroupType) => (
                  <Group
                    data={group}
                    key={group.name}
                    onCompanyAttend={() => {
                      onChangeCompanyAttend(
                        d.name,
                        group.name,
                        group.checked || false
                      );
                    }}
                    onOpenReporterDialog={() => {
                      openReporterDialog(d.name, group);
                    }}
                  />
                ))}
              </ul>
            </React.Fragment>
          );
        })}
      </div>
      <button
        className="appearance-none w-full h-16 rounded-none text-white bg-blue-500"
        onClick={() => {
          const reports = generateReports(data, getCompanyActualCounts(data), getReporterActualCounts(data));
          setDocument(reports)
          openDocumentDialog();
        }}
      >
        產出統整結果
      </button>
    </main>
  );
}

export default App;
