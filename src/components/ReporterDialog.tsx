import { forwardRef } from "react";
import { GroupType, ReporterType } from "../types/data";

const ReporterDialog = forwardRef(({ data, onChangeReporterAttend, onClose }: {
    data: {
        name: string;
        group: GroupType;
    } | undefined,
    onChangeReporterAttend: (reporter: ReporterType, checked: boolean) => void,
    onClose: () => void
}, ref: any) => {
    return (
        <dialog
            ref={ref}
            className="p-6  rounded-lg w-5/6"
        >
            {!data ? (
                <></>
            ) : (
                <ul>
                    {data.group.reporters.map(
                        (reporter: ReporterType) => {
                            return (
                                <li
                                    className="flex justify-between items-center text-lg mb-3"
                                    key={reporter.name}
                                >
                                    <label
                                        htmlFor={reporter.name}
                                        className="flex justify-start items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            id={reporter.name}
                                            checked={reporter.checked}
                                            value={reporter.name}
                                            onChange={() => {
                                                onChangeReporterAttend(
                                                    reporter,
                                                    reporter.checked ||
                                                    false
                                                )
                                            }}
                                            className="mr-2 w-5 h-5"
                                        />
                                        {reporter.name}
                                    </label>
                                    <div>
                                        <a
                                            className="text-blue-500"
                                            href={`tel:${reporter.mobile}`}
                                        >
                                            {reporter.mobile}
                                        </a>
                                    </div>
                                </li>
                            );
                        }
                    )}
                </ul>
            )}
            <button
                className="mt-4 border-none bg-gray-300"
                onClick={onClose}
            >
                關閉
            </button>
        </dialog>
    )
});

export default ReporterDialog