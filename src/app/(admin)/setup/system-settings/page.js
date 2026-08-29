"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/layout/PageHeader";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from "@/features/api/systemSettingsApi";
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Upload,
  Save,
  CheckCircle,
  RefreshCw,
  Image as ImageIcon,
  CheckSquare,
  Hash,
  Layers,
  HelpCircle,
} from "lucide-react";

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState("company");

  const { data: apiResponse, isLoading, refetch } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSystemSettingsMutation();

  const settings = apiResponse?.data || {};
  const examples = apiResponse?.examples || {};

  // Company Settings State
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [hotline, setHotline] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [certificateFooter, setCertificateFooter] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [sealFile, setSealFile] = useState(null);
  const [sealPreview, setSealPreview] = useState("");

  // Product Settings State (Enable/Disable Toggles)
  const [enableMotor, setEnableMotor] = useState(true);
  const [enableOmp, setEnableOmp] = useState(true);
  const [enablePa, setEnablePa] = useState(true);

  // Numbering Settings State (Prefixes & Formats)
  const [proposalPrefix, setProposalPrefix] = useState("PROP");
  const [proposalFormat, setProposalFormat] = useState("PROP-{YEAR}-{SEQ:5}");

  const [policyPrefix, setPolicyPrefix] = useState("POL");
  const [policyFormat, setPolicyFormat] = useState("POL-{YEAR}-{SEQ:5}");

  const [certPrefix, setCertPrefix] = useState("CERT");
  const [certFormat, setCertFormat] = useState("CERT-{YEAR}-{SEQ:5}");

  const [claimPrefix, setClaimPrefix] = useState("CLM");
  const [claimFormat, setClaimFormat] = useState("CLM-{YEAR}-{SEQ:5}");

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (apiResponse?.data) {
      // Company
      setCompanyName(settings.company_name || "");
      setAddress(settings.address || "");
      setHotline(settings.hotline || "");
      setEmail(settings.email || "");
      setWebsite(settings.website || "");
      setCertificateFooter(settings.certificate_footer || "");
      if (settings.logo) setLogoPreview(settings.logo);
      if (settings.signature_seal_image) setSealPreview(settings.signature_seal_image);

      // Product Toggles
      setEnableMotor(settings.enable_motor_insurance !== "false");
      setEnableOmp(settings.enable_omp_insurance !== "false");
      setEnablePa(settings.enable_pa_insurance !== "false");

      // Numbering
      setProposalPrefix(settings.proposal_number_prefix || "PROP");
      setProposalFormat(settings.proposal_number_format || "PROP-{YEAR}-{SEQ:5}");

      setPolicyPrefix(settings.policy_number_prefix || "POL");
      setPolicyFormat(settings.policy_number_format || "POL-{YEAR}-{SEQ:5}");

      setCertPrefix(settings.certificate_number_prefix || "CERT");
      setCertFormat(settings.certificate_number_format || "CERT-{YEAR}-{SEQ:5}");

      setClaimPrefix(settings.claim_number_prefix || "CLM");
      setClaimFormat(settings.claim_number_format || "CLM-{YEAR}-{SEQ:5}");
    }
  }, [apiResponse]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSealChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSealFile(file);
      setSealPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const formData = new FormData();
    // Company
    formData.append("company_name", companyName);
    formData.append("address", address);
    formData.append("hotline", hotline);
    formData.append("email", email);
    formData.append("website", website);
    formData.append("certificate_footer", certificateFooter);

    if (logoFile) formData.append("logo", logoFile);
    if (sealFile) formData.append("signature_seal_image", sealFile);

    // Products
    formData.append("enable_motor_insurance", enableMotor ? "true" : "false");
    formData.append("enable_omp_insurance", enableOmp ? "true" : "false");
    formData.append("enable_pa_insurance", enablePa ? "true" : "false");

    // Numbering
    formData.append("proposal_number_prefix", proposalPrefix);
    formData.append("proposal_number_format", proposalFormat);

    formData.append("policy_number_prefix", policyPrefix);
    formData.append("policy_number_format", policyFormat);

    formData.append("certificate_number_prefix", certPrefix);
    formData.append("certificate_number_format", certFormat);

    formData.append("claim_number_prefix", claimPrefix);
    formData.append("claim_number_format", claimFormat);

    try {
      await updateSettings(formData).unwrap();
      setSuccessMessage("System configuration settings updated successfully!");
      refetch();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Failed to save system settings:", err);
    }
  };

  // Helper function for local live example preview calculation
  const getPreviewExample = (prefix, format) => {
    const year = new Date().getFullYear();
    let res = format.replace("{YEAR}", year).replace("{PREFIX}", prefix);
    res = res.replace(/{SEQ:(\d+)}/, (_, len) => "1".padStart(parseInt(len), "0"));
    return res;
  };

  return (
    <div className="space-y-6">
      {/* Standard Corporate Page Header */}
      <PageHeader
        title="System Settings"
        description="Configure corporate entity identity, insurance product toggles, and document numbering sequence formats."
        actions={
          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-medium text-gray-700 shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            <span>Reload Settings</span>
          </button>
        }
      />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Configuration Tabs Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white p-2 rounded-lg shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${activeTab === "company"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <Building2 className="w-4 h-4" />
          <span>A. Company Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("product")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${activeTab === "product"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <Layers className="w-4 h-4" />
          <span>B. Product Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("numbering")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${activeTab === "numbering"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <Hash className="w-4 h-4" />
          <span>C. Numbering Settings</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading system configuration...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: COMPANY SETTINGS */}
          {activeTab === "company" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Company Identity & Contact Configuration</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Republic Insurance Limited"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>Head Office Address</span>
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Full corporate street address..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>Hotline / Phone</span>
                    </label>
                    <input
                      type="text"
                      value={hotline}
                      onChange={(e) => setHotline(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="+880 2-48317777"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span>Corporate Email</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="info@republicinsurancebd.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-gray-500" />
                    <span>Website URL</span>
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://republicinsurancebd.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>Certificate Footer Notice</span>
                  </label>
                  <textarea
                    rows={3}
                    value={certificateFooter}
                    onChange={(e) => setCertificateFooter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Notice printed at bottom of policy certificates..."
                  />
                </div>
              </div>

              {/* Logo & Seal Upload Side Panel */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Company Logo</span>
                  </h4>

                  <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center space-y-3">
                    {logoPreview ? (
                      <div className="flex justify-center">
                        <img
                          src={logoPreview}
                          alt="Company Logo Preview"
                          className="max-h-24 object-contain rounded border border-gray-200 bg-white p-2"
                        />
                      </div>
                    ) : (
                      <div className="p-4 text-gray-400 text-xs">No Logo Uploaded</div>
                    )}

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Logo File</span>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Signature / Seal Image</span>
                  </h4>

                  <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center space-y-3">
                    {sealPreview ? (
                      <div className="flex justify-center">
                        <img
                          src={sealPreview}
                          alt="Official Seal Preview"
                          className="max-h-24 object-contain rounded border border-gray-200 bg-white p-2"
                        />
                      </div>
                    ) : (
                      <div className="p-4 text-gray-400 text-xs">No Seal Uploaded</div>
                    )}

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Seal Image</span>
                      <input type="file" accept="image/*" onChange={handleSealChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT SETTINGS (ENABLE/DISABLE) */}
          {activeTab === "product" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Insurance Product Enable/Disable Configuration</span>
              </h3>

              <div className="space-y-4 max-w-2xl">
                {/* Motor Insurance Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Motor Insurance</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Comprehensive & Act Only Vehicle Coverages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableMotor}
                      onChange={(e) => setEnableMotor(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Overseas Mediclaim OMP Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Overseas Mediclaim (OMP)</h4>
                    <p className="text-xs text-gray-500 mt-0.5">International Travel Medical Policies</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableOmp}
                      onChange={(e) => setEnableOmp(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Personal Accident PA Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Personal Accident (PA)</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Individual & Group Accidental Protection</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enablePa}
                      onChange={(e) => setEnablePa(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NUMBERING SETTINGS (PREFIXES & FORMATS) */}
          {activeTab === "numbering" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-blue-600" />
                  <span>Document Sequence Numbering Formats</span>
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Tokens: <strong>{"{YEAR}"}</strong> = 2026, <strong>{"{SEQ:5}"}</strong> = 00001</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proposal Number Settings */}
                <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">Proposal Number</h4>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Example: {examples.proposal || getPreviewExample(proposalPrefix, proposalFormat)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-2xs font-bold text-gray-600 mb-1">Prefix</label>
                      <input
                        type="text"
                        value={proposalPrefix}
                        onChange={(e) => setProposalPrefix(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-2xs font-bold text-gray-600 mb-1">Format Pattern</label>
                      <input
                        type="text"
                        value={proposalFormat}
                        onChange={(e) => setProposalFormat(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Policy Number Settings */}
                <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">Policy Number</h4>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Example: {examples.policy || getPreviewExample(policyPrefix, policyFormat)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-2xs font-bold text-gray-600 mb-1">Prefix</label>
                      <input
                        type="text"
                        value={policyPrefix}
                        onChange={(e) => setPolicyPrefix(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-2xs font-bold text-gray-600 mb-1">Format Pattern</label>
                      <input
                        type="text"
                        value={policyFormat}
                        onChange={(e) => setPolicyFormat(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Certificate Number Settings */}
                <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">Certificate Number</h4>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Example: {examples.certificate || getPreviewExample(certPrefix, certFormat)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-2xs font-bold text-gray-600 mb-1">Prefix</label>
                      <input
                        type="text"
                        value={certPrefix}
                        onChange={(e) => setCertPrefix(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-2xs font-bold text-gray-600 mb-1">Format Pattern</label>
                      <input
                        type="text"
                        value={certFormat}
                        onChange={(e) => setCertFormat(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Claim Number Settings */}
                <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">Claim Number</h4>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Example: {examples.claim || getPreviewExample(claimPrefix, claimFormat)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-2xs font-bold text-gray-600 mb-1">Prefix</label>
                      <input
                        type="text"
                        value={claimPrefix}
                        onChange={(e) => setClaimPrefix(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-2xs font-bold text-gray-600 mb-1">Format Pattern</label>
                      <input
                        type="text"
                        value={claimFormat}
                        onChange={(e) => setClaimFormat(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Save Button Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Changes apply system-wide across all insurance underwriting models.
            </span>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? "Saving Configuration..." : "Save All Configuration"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
