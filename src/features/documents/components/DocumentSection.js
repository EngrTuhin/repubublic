"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetDocumentsQuery,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} from "../documentsApi";

export default function DocumentSection({
  documentableType = "PremBill",
  documentableId,
  initialDocuments = [],
  addDocument = true,
  addDocoment = true,
  allowAdd = true,
}) {
  const canAdd = addDocument !== false && addDocoment !== false && allowAdd !== false;

  const [filterStatus, setFilterStatus] = useState("all");
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [remarksInput, setRemarksInput] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState(null);
  const [previewDocTitle, setPreviewDocTitle] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);

  // Fetch live documents if documentableId is present
  const { data: fetchedData, isLoading } = useGetDocumentsQuery(
    { documentable_type: documentableType, documentable_id: documentableId },
    { skip: !documentableId }
  );

  const [approveDocument, { isLoading: isApproving }] = useApproveDocumentMutation();
  const [rejectDocument, { isLoading: isRejecting }] = useRejectDocumentMutation();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  const documentsList = fetchedData?.data || fetchedData || initialDocuments || [];

  const filteredDocs = documentsList.filter((doc) => {
    if (filterStatus === "all") return true;
    return (doc.status || "Pending").toLowerCase() === filterStatus.toLowerCase();
  });

  const countApproved = documentsList.filter((d) => (d.status || "").toLowerCase() === "approved").length;
  const countRejected = documentsList.filter((d) => (d.status || "").toLowerCase() === "rejected").length;
  const countPending = documentsList.filter((d) => (d.status || "pending").toLowerCase() === "pending").length;

  const handleApprove = async (docId) => {
    try {
      await approveDocument({ id: docId, remarks: "Approved by underwriter" }).unwrap();
    } catch (err) {
      console.error("Failed to approve document:", err);
    }
  };

  const handleRejectDirect = async (docId) => {
    try {
      await rejectDocument({ id: docId, remarks: "Rejected by underwriter" }).unwrap();
    } catch (err) {
      console.error("Failed to reject document:", err);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile || !documentableId) return;

    const formData = new FormData();
    formData.append("documentable_type", documentableType);
    formData.append("documentable_id", String(documentableId));
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle || uploadFile.name);

    try {
      await uploadDocument(formData).unwrap();
      setShowUploadModal(false);
      setUploadTitle("");
      setUploadFile(null);
    } catch (err) {
      console.error("Failed to upload document:", err);
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(docId).unwrap();
      } catch (err) {
        console.error("Failed to delete document:", err);
      }
    }
  };

  const quickReasons = [
    "Illegible or blurry document",
    "Expired vehicle registration",
    "Mismatched engine / chassis number",
    "Incorrect vehicle classification",
    "Missing official seal / stamp",
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Clean & Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <LucideIcons.FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Attached Documents
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                {documentsList.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Review and maintain approval status for proposal document attachments.
            </p>
          </div>
        </div>

        {/* Filter Buttons & Upload Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl text-xs font-medium text-slate-600">
            {["all", "pending", "approved", "rejected"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${filterStatus === st
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "hover:text-slate-900"
                  }`}
              >
                {st}
              </button>
            ))}
          </div>

          {documentableId && canAdd && (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
            >
              <LucideIcons.Plus className="w-4 h-4" /> Add Document
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
          <LucideIcons.Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">Loading documents...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredDocs.length === 0 && (
        <div className="text-center py-10 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <LucideIcons.FileSearch className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No documents found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterStatus === "all"
              ? "No file attachments have been uploaded for this policy yet."
              : `No documents matching status '${filterStatus}'.`}
          </p>
        </div>
      )}

      {/* Documents List */}
      {!isLoading && filteredDocs.length > 0 && (
        <div className="divide-y divide-slate-100">
          {filteredDocs.map((doc) => {
            const status = (doc.status || "Pending").toLowerCase();
            const isApproved = status === "approved";
            const isRejected = status === "rejected";

            return (
              <div
                key={doc.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-all rounded-2xl px-3"
              >
                {/* File Details */}
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl shrink-0 mt-0.5">
                    {doc.file_type?.includes("image") ? (
                      <LucideIcons.Image className="w-5 h-5 text-indigo-500" />
                    ) : doc.file_type?.includes("pdf") ? (
                      <LucideIcons.FileCode className="w-5 h-5 text-rose-500" />
                    ) : (
                      <LucideIcons.FileText className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {doc.title || doc.file_name || "Document"}
                      </h4>

                      {/* Status Badges */}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
                          <LucideIcons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Approved
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-semibold">
                          <LucideIcons.XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Rejected
                        </span>
                      )}
                      {!isApproved && !isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-semibold">
                          <LucideIcons.Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Review
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{doc.file_name}</span>
                      {doc.created_at && (
                        <span>• {new Date(doc.created_at).toLocaleDateString()}</span>
                      )}
                    </p>

                    {doc.remarks && (
                      <p className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg mt-2 inline-block">
                        <strong>Remarks:</strong> {doc.remarks}
                      </p>
                    )}
                  </div>
                </div>

                {/* Maintenance Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewDocUrl(doc.file_url);
                      setPreviewDocTitle(doc.title || doc.file_name);
                    }}
                    className="p-2 text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
                    title="Quick Preview"
                  >
                    <LucideIcons.Eye className="w-4 h-4" />
                  </button>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
                    title="Open in new tab"
                  >
                    <LucideIcons.ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Approve Button */}
                  <button
                    type="button"
                    disabled={isApproved || isApproving}
                    onClick={() => handleApprove(doc.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${isApproved
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      }`}
                  >
                    <LucideIcons.Check className="w-3.5 h-3.5" />
                    {isApproved ? "Approved" : "Approve"}
                  </button>

                  {/* Reject Button */}
                  <button
                    type="button"
                    disabled={isRejected || isRejecting}
                    onClick={() => handleRejectDirect(doc.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${isRejected
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                      }`}
                  >
                    <LucideIcons.X className="w-3.5 h-3.5" />
                    {isRejected ? "Rejected" : "Reject"}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="Delete document"
                  >
                    <LucideIcons.Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Lightbox Preview Modal */}
      <AnimatePresence>
        {previewDocUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <LucideIcons.FileText className="w-5 h-5 text-blue-600" />
                  {previewDocTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewDocUrl(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all"
                >
                  <LucideIcons.X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center min-h-[50vh] bg-slate-50 rounded-2xl p-2 border border-slate-200">
                {previewDocUrl.endsWith(".pdf") ? (
                  <iframe src={previewDocUrl} className="w-full h-[65vh] rounded-xl" />
                ) : (
                  <img src={previewDocUrl} alt={previewDocTitle} className="max-h-[65vh] max-w-full object-contain rounded-xl" />
                )}
              </div>

              <div className="flex justify-end pt-2">
                <a
                  href={previewDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <LucideIcons.Download className="w-4 h-4" /> Download File
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Remarks Modal */}
      <AnimatePresence>
        {rejectingDocId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <LucideIcons.XCircle className="w-5 h-5 text-rose-600" />
                  Reject Document
                </h3>
                <button
                  type="button"
                  onClick={() => setRejectingDocId(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <LucideIcons.X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Quick Rejection Reasons
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {quickReasons.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setRemarksInput(reason)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 rounded-lg text-[11px] font-medium transition-all"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Reason for Rejection / Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={remarksInput}
                    onChange={(e) => setRemarksInput(e.target.value)}
                    placeholder="Enter reason why this document is rejected..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectingDocId(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRejecting}
                    className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm"
                  >
                    {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <LucideIcons.Upload className="w-5 h-5 text-blue-600" />
                  Upload New Document
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <LucideIcons.X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. BRTA Registration Card, Driving License..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select File (PDF or Image)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                  >
                    {isUploading ? "Uploading..." : "Upload Document"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
