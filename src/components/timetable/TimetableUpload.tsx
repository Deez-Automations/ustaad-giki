"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, Loader2, CheckCircle2 } from "lucide-react";
import { processUploadedTimetable } from "@/actions/process-timetable";
import type { ExtractedTimeSlot } from "@/lib/ocr-service";

interface TimetableUploadProps {
    onExtracted: (timeSlots: ExtractedTimeSlot[]) => void;
}

export default function TimetableUpload({ onExtracted }: TimetableUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        maxSize: 5 * 1024 * 1024,
        multiple: false,
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];

            // Show preview
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);

            //Process via server action
            setIsProcessing(true);
            setStatus("processing");
            setErrorMessage("");

            try {
                const formData = new FormData();
                formData.append('timetable', file);

                const result = await processUploadedTimetable(formData);

                if (result.error) {
                    setStatus("error");
                    setErrorMessage(result.error);
                } else if (result.timeSlots && result.timeSlots.length > 0) {
                    setStatus("success");
                    onExtracted(result.timeSlots);
                } else {
                    setStatus("error");
                    setErrorMessage("No timetable data found. Please ensure the image is clear and contains a structured timetable.");
                }
            } catch (error) {
                console.error("[Upload]", error);
                setStatus("error");
                setErrorMessage("Failed to process image. Please try again.");
            } finally {
                setIsProcessing(false);
            }
        },
    });

    return (
        <div className="w-full">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Timetable Image</h3>
                <p className="text-sm text-gray-600">
                    Upload a clear photo of your GIKI timetable. We'll automatically extract the schedule data.
                </p>
            </div>

            {/* Upload Zone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragActive
                        ? "border-giki-blue bg-blue-50"
                        : status === "success"
                            ? "border-green-500 bg-green-50"
                            : status === "error"
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 hover:border-giki-blue hover:bg-gray-50"
                    }`}
            >
                <input {...getInputProps()} />

                {/* Icon */}
                <div className="mb-4">
                    {status === "processing" && (
                        <Loader2 className="w-12 h-12 mx-auto text-giki-blue animate-spin" />
                    )}
                    {status === "success" && (
                        <CheckCircle2 className="w-12 h-12 mx-auto text-green-600" />
                    )}
                    {status === "error" && (
                        <FileImage className="w-12 h-12 mx-auto text-red-600" />
                    )}
                    {status === "idle" && (
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    )}
                </div>

                {/* Message */}
                {status === "processing" && (
                    <div>
                        <p className="text-giki-blue font-semibold mb-1">Extracting timetable data...</p>
                        <p className="text-sm text-gray-600">This may take a few seconds</p>
                    </div>
                )}
                {status === "success" && (
                    <div>
                        <p className="text-green-600 font-semibold mb-1">Successfully extracted!</p>
                        <p className="text-sm text-gray-600">Review and edit the extracted schedule below</p>
                    </div>
                )}
                {status === "error" && (
                    <div>
                        <p className="text-red-600 font-semibold mb-1">Extraction failed</p>
                        <p className="text-sm text-gray-600">{errorMessage}</p>
                        <p className="text-xs text-gray-500 mt-2">Try uploading a clearer image</p>
                    </div>
                )}
                {status === "idle" && (
                    <div>
                        {isDragActive ? (
                            <p className="text-giki-blue font-semibold">Drop your timetable here</p>
                        ) : (
                            <>
                                <p className="text-gray-700 font-semibold mb-1">
                                    Drag & drop your timetable image
                                </p>
                                <p className="text-sm text-gray-500">or click to browse</p>
                                <p className="text-xs text-gray-400 mt-2">PNG, JPG (max 5MB)</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Preview */}
            {preview && (
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Image</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="Timetable preview"
                            className="w-full h-auto max-h-96 object-contain bg-gray-50"
                        />
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for best results:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Ensure the timetable is well-lit and in focus</li>
                    <li>• Include day labels (Monday, Tuesday, etc.)</li>
                    <li>• Make sure time labels are visible</li>
                    <li>• Avoid shadows or glare on the timetable</li>
                </ul>
            </div>
        </div>
    );
}
