import { forwardRef } from "react";
import { CatagType, GroupType, ReporterType } from "../types/data";
import RoundedButton from "./RoundedButton";
import useAppStore from "../app-store";

const ReporterDialog = forwardRef(({ data, onChangeReporterAttend, onClose }: {
    data: {
        name: string;
        group: GroupType;
    } | undefined,
    onChangeReporterAttend: (reporter: ReporterType, checked: boolean) => void,
    onClose: () => void
}, ref: any) => {

    const appStore = useAppStore()

    function onAddReporter() {
        if (!data) return

        const newData = appStore.data.map((p: CatagType) => {
            if (p.name === data.name) {
                const targetGroup = p.groups.find(
                    (group: GroupType) =>
                        group.name === data.group.name
                );
                if (targetGroup) {
                    targetGroup.checked = true;
                    targetGroup.reporters = [...targetGroup.reporters, { name: '', checked: true, mobile: '', custom: true }]
                }
            }
            return p;
        });

        appStore.setData(newData)
    }

    function setReporterName(name: string, index: number) {
        const newData = appStore.data.map((p: CatagType) => {
            if (p.name === data?.name) {
                const targetGroup = p.groups.find(
                    (group: GroupType) =>
                        group.name === data.group.name
                );
                if (targetGroup) {
                    const targetReporter = targetGroup.reporters[index]
                    targetReporter.name = name
                }
            }
            return p;
        });

        appStore.setData(newData)
    }

    return (
        <dialog
            ref={ref}
            className="p-6  rounded-lg w-5/6"
        >
            {!data ? (
                <></>
            ) : (
                <>
                    <div className="mb-4 font-bold text-xl">{data.group.name}</div>
                    <ul>
                        {data.group.reporters.map(
                            (reporter: ReporterType, index: number) => {
                                return (
                                    <li
                                        className="flex justify-between items-center text-lg mb-3"
                                        key={index}
                                    >
                                        <label
                                            htmlFor={reporter.name}
                                            className="flex justify-start items-center w-full"
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
                                            {reporter.custom ?
                                                <>
                                                    <input
                                                        type='text'
                                                        className="border border-gray-500 rounded-md p-2 flex-1"
                                                        value={reporter.name}
                                                        onChange={(e) => setReporterName(e.target.value, index)}
                                                    />
                                                </>
                                                : reporter.name}
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
                </>
            )}
            <RoundedButton onClick={onAddReporter}>
                +新增記者
            </RoundedButton>
            <div className="mt-6 flex justify-end items-center">
                <button
                    className="border-none bg-gray-300"
                    onClick={onClose}
                >
                    關閉
                </button>
            </div>
        </dialog>
    )
});

export default ReporterDialog