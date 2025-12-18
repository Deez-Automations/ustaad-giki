"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { deleteAccount } from "@/actions/delete-account";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";

export default function DeleteAccountButton() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleDelete = async () => {
        if (confirmText !== "DELETE") {
            setError("Please type DELETE to confirm");
            return;
        }

        setIsDeleting(true);
        setError("");

        const result = await deleteAccount();

        if (result.error) {
            setError(result.error);
            setIsDeleting(false);
        } else {
            // Sign out and redirect to homepage
            await signOut({ redirect: false });
            router.push("/");
        }
    };

    return (
        <>
            {/* Delete Account Button */}
            <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
                <Trash2 className="w-4 h-4" />
                Delete Account
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Delete Account</h3>
                                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    setConfirmText("");
                                    setError("");
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-700">
                                    <strong>Warning:</strong> This will permanently delete:
                                </p>
                                <ul className="text-sm text-red-600 mt-2 space-y-1 ml-4 list-disc">
                                    <li>Your profile and all personal data</li>
                                    <li>All your timetables</li>
                                    <li>All bookings (past and pending)</li>
                                    <li>All reviews you've given or received</li>
                                    <li>All SOS alerts</li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <strong>DELETE</strong> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowConfirm(false);
                                        setConfirmText("");
                                        setError("");
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting || confirmText !== "DELETE"}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5" />
                                            Delete Forever
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
