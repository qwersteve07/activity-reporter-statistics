import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { CatagType, GroupType, ReporterStatus, ReporterType } from "./types/data";
import { sessionGetData } from "./utils/storage";
import Group from "./components/Group";
import DocumentDialog from "./components/DocumentDialog";
import ReporterDialog from "./components/ReporterDialog";
import AddCompanyDialog from "./components/AddCompanyDialog";
import generateReports from "./utils/generate-reports";
import { getCompanyActualCounts, getCompanyEstimateCounts, getReporterActualCounts, getReporterEstimateCounts } from "./utils/getCounts";
import useAppStore from "./app-store";
import Button from "./components/Button";
import { useNavigate } from "react-router-dom";

function AppPage() {
  const navigate = useNavigate()
  const [reporterDialogData, setReporterDialogData] = useState<{
    name: string;
    group: GroupType;
  }>();
  const reportersDialogRef = useRef<HTMLDialogElement>(null);
  const documentDialogRef = useRef<HTMLDialogElement>(null);
  const addCompanyDialogRef = useRef<HTMLDialogElement>(null);
  const [document, setDocument] = useState<string>("");
  const appStore = useAppStore()
  const companyEstimateCounts = useMemo(() => getCompanyEstimateCounts(appStore.data), [appStore.data])
  const reporterEstimateCounts = useMemo(() => getReporterEstimateCounts(appStore.data), [appStore.data]);
  const companyActualCounts = useMemo(() => getCompanyActualCounts(appStore.data), [appStore.data])
  const reporterActualCounts = useMemo(() => getReporterActualCounts(appStore.data), [appStore.data]);
  const [currentAddingCatag, setCurrentAddingCatag] = useState<string>('')

  useEffect(() => {
    const sessionData = sessionGetData();
    if (sessionData) {
      appStore.setData(sessionData);
    } else {
      navigate('/')
    }
  }, [])

  function onChangeCompanyAttend(
    catagName: string,
    groupName: string,
    checked: boolean
  ) {
    const newData = appStore.data.map((p: CatagType) => {
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

    appStore.setData(newData);

  }

  function onChangeReporterAttend(
    currentReporter: ReporterType,
    checked: boolean
  ) {
    const newData = appStore.data.map((p: CatagType) => {
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

    appStore.setData(newData);

  }

  function onChangeReporterStatus(
    currentReporter: ReporterType,
    status: ReporterStatus
  ) {
    console.log(status)
    const newData = appStore.data.map((p: CatagType) => {
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
            targetReporter.status = status
          }
        }
      }
      return p;
    });

    appStore.setData(newData);
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

  function openAddCompanyDialog(catagName: string) {
    setCurrentAddingCatag(catagName)
    addCompanyDialogRef.current?.showModal();
  }

  function closeAddCompanyDialog() {
    setCurrentAddingCatag('')
    addCompanyDialogRef.current?.close();
  }

  function saveCompanyData(companyName: string, reporters: string[]) {
    const newData = appStore.data.map((p: CatagType) => {
      if (p.name === currentAddingCatag) {
        p.groups = [...p.groups, {
          name: companyName,
          checked: true,
          reporters: reporters.filter(x => x !== '').map(x => ({ checked: true, mobile: '', name: x, status: ReporterStatus.UNKNOWN }))
        }]
      }
      return p;
    });
    appStore.setData(newData)
    closeAddCompanyDialog()
  }

  if (appStore.data.length === 0) return <div />

  return (
    <main className="flex flex-col justify-between items-center h-dvh">
      <DocumentDialog ref={documentDialogRef} text={document} onClose={closeDocumentDialog} />
      <ReporterDialog ref={reportersDialogRef} data={reporterDialogData} onChangeReporterAttend={onChangeReporterAttend} onChangeReporterStatus={onChangeReporterStatus} onClose={closeReporterDialog} />
      <AddCompanyDialog ref={addCompanyDialogRef} onClose={closeAddCompanyDialog} onSave={saveCompanyData} />
      <header className="text-left text-2xl w-full pb-4 border-b-2 p-6 ">
        預計出席：
        <span className="font-bold text-gray-400">
          {companyEstimateCounts}
        </span>{" "}
        家{" "}
        <span className="font-bold text-gray-400">
          {reporterEstimateCounts}
        </span>{" "}
        位記者
        <br />
        目前出席：
        <span className="font-bold text-blue-500">
          {companyActualCounts}
        </span>{" "}
        家{" "}
        <span className="font-bold text-blue-500">
          {reporterActualCounts}
        </span>{" "}
        位記者
        <br />
      </header>
      <div className="w-full text-left p-6 overflow-auto h-[calc(100%-170px)]">
        {appStore.data.map((d: CatagType) => {
          return (
            <div key={d.name} className="mb-10">
              <div className="text-xl font-bold mb-4">
                {d.name}
              </div>
              <ul className="mb-2">
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
              <Button onClick={() => openAddCompanyDialog(d.name)}>
                新增媒體
              </Button>

            </div>
          );
        })}
      </div>
      <button
        className="appearance-none w-full h-16 rounded-none text-white bg-blue-500"
        onClick={() => {
          const reports = generateReports(appStore.data, companyActualCounts, reporterActualCounts);
          setDocument(reports)
          openDocumentDialog();
        }}
      >
        產出統整結果
      </button>
    </main>
  );
}

export default AppPage;
