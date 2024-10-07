import { forwardRef } from "react"
import { copyToClipboard } from "../utils/clipboard";

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
            <div className="flex justify-between items-center">
                <button
                    className="mt-4 border-none bg-gray-300"
                    onClick={copyText}
                >
                    複製
                </button>
                <button
                    className="mt-4 border-none bg-gray-300"
                    onClick={onClose}
                >
                    關閉
                </button>
            </div>
        </dialog>
    )
})

export default DocumentDialog;