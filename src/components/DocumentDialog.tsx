import { forwardRef } from "react"
import { copyToClipboard } from "../utils/clipboard";
import Button from "./Button";

const DocumentDialog = forwardRef(({ text, onClose }: { text: string, onClose: () => void }, ref: any) => {

    function copyText() {
        copyToClipboard(text);
    }

    return (
        <dialog
            ref={ref}
            className="p-6 rounded-lg w-5/6"
        >
            <textarea
                defaultValue={text}
                rows={20}
                className="w-full"
            />
            <div className="flex justify-between items-center mt-4">
                <Button onClick={copyText}>
                    複製
                </Button>
                <Button sub onClick={onClose}>
                    關閉
                </Button>
            </div>
        </dialog>
    )
})

export default DocumentDialog;