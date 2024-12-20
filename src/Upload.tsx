import { ChangeEvent, useEffect } from "react";
import useAppStore from "./app-store";
import { CatagType, GroupType, ReporterStatus, ReporterType } from "./types/data";
import { csvToJson, jsonToRawData } from "./utils/parse";
import { sessionGetData } from "./utils/storage";
import { useNavigate } from "react-router-dom";

function UploadPage() {

    const appStore = useAppStore()
    const navigate = useNavigate()

    useEffect(() => {
        const sessionData = sessionGetData();
        if (sessionData) {
            appStore.setData(sessionData);
            navigate('/app')

        }
    }, [])

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files;

        if (file && file[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const csvContent = e.target?.result;
                if (!csvContent || typeof csvContent !== 'string') return
                const csvJson = csvToJson(csvContent)
                const rawData = jsonToRawData(csvJson);
                const newData = rawData.map((data: CatagType) => {
                    const dataGroup = data.groups.map((group: GroupType) => {
                        const reporters = group.reporters.map(
                            (reporter: ReporterType) => ({
                                ...reporter,
                                checked: false,
                                status: ReporterStatus.UNKNOWN
                            })
                        );
                        return { ...group, reporters, checked: false };
                    });

                    return { ...data, groups: dataGroup };
                });

                appStore.setData(newData)
                navigate('/app')
            };

            reader.readAsText(file[0]);
        };
    }

    return (
        <main className="flex justify-center items-center h-screen">
            <label className="border p-4 rounded-xl cursor-pointer" htmlFor="upload-csv">上傳 CSV</label>
            <input className="hidden" type="file" name="csv" id="upload-csv" onChange={onChange} />
        </main>
    )
}

export default UploadPage