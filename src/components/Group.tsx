import { GroupType, ReporterType } from "../types/data"

const Group = ({ data, onCompanyAttend, onOpenReporterDialog }: { data: GroupType, onCompanyAttend: () => void, onOpenReporterDialog: () => void }) => {
    return (
        <li className="flex justify-between items-center text-lg mb-3" key={data.name}>
            <div className="flex justify-start items-center">
                <input
                    type="checkbox"
                    checked={data.checked}
                    value={data.name}
                    onChange={onCompanyAttend}
                    className="mr-2 w-5 h-5"
                />
                <div onClick={onOpenReporterDialog}>
                    {data.name}
                </div>
            </div>
            <div>
                預計{" "}
                <span className="font-bold text-gray-400">
                    {data.reporters.length}
                </span>{" "}
                人 / 實際{" "}
                <span className="font-bold text-blue-500">
                    {data.reporters.filter((reporter: ReporterType) => reporter.checked).length}
                </span>{" "}
                人
            </div>
        </li>
    )
}

export default Group