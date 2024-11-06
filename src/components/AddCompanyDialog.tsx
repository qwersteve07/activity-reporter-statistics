import { forwardRef, useState } from "react";
import RoundedButton from "./RoundedButton";
import Button from "./Button";

const AddCompanyDialog = forwardRef(({ onSave, onClose }: {
    onSave: (companyName: string, reporters: Array<string>) => void
    onClose: () => void
}, ref: any) => {
    const [companyName, setCompanyName] = useState('');
    const [reporters, setReporters] = useState<Array<string>>([]);

    function addReporterField() {
        setReporters(prev => [...prev, ''])
    }

    function onSaveCompanyData() {
        onSave(companyName, reporters)
        reset()
    }

    function reset() {
        setCompanyName('')
        setReporters([])
    }

    return (
        <dialog
            ref={ref}
            className="p-6 rounded-lg w-5/6"
        >
            <div className="flex justify-start items-center gap-4 mb-2">
                <label htmlFor="companyName">媒體名稱</label>
                <input id="companyName" type='text' value={companyName} className="border border-gray-500 rounded-md p-2 flex-1" onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            {!reporters ? <></> :
                reporters.map((reporter, i) => {
                    return (
                        <div className="flex justify-start items-center gap-4 mb-2" key={`reporter${i}`}>
                            <label htmlFor={`reporter${i}`}>記者名稱</label>
                            <input
                                id={`reporter${i}`}
                                type='text'
                                className="border border-gray-500 rounded-md p-2 flex-1"
                                value={reporter}
                                onChange={(e) => {
                                    setReporters((prev) => {
                                        return prev.map((item: string, j: number) => i === j ? e.target.value : item)
                                    })
                                }} />
                        </div>
                    )
                }
                )}
            <RoundedButton onClick={addReporterField}>
                +新增記者
            </RoundedButton>
            <div className="flex justify-between items-center mt-6">
                <Button onClick={onSaveCompanyData}>
                    新增
                </Button>
                <Button sub onClick={() => {
                    onClose()
                    reset()
                }}>
                    關閉
                </Button>
            </div>
        </dialog >
    )
});

export default AddCompanyDialog