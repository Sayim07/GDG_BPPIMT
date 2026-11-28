"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Ghost,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface CertificateData {
  certId: string;
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
  issuedDate: string;
  organizerName: string;
  organizerRole: string;
  chapterName: string;
}

export function CertificateClient() {
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get("eventId") || "";

  const [queryInput, setQueryInput] = useState("");
  const [lastSearched, setLastSearched] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper to render the certificate on canvas
  const drawCertificate = useCallback((cert: CertificateData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1920;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // 1. Solid Clean Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Subtle paper tint inside
    ctx.fillStyle = "#FCFDFF";
    ctx.fillRect(40, 40, width - 80, height - 80);

    // 2. Outer Deep Border
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 14;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    // Inner Accent Border
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 3;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // 3. Top Google Brand 4-Color Accent Bar
    const barY = 65;
    const barHeight = 8;
    const barWidth = (width - 150) / 4;
    const startX = 75;

    ctx.fillStyle = "#4285F4"; // Google Blue
    ctx.fillRect(startX, barY, barWidth, barHeight);
    ctx.fillStyle = "#EA4335"; // Google Red
    ctx.fillRect(startX + barWidth, barY, barWidth, barHeight);
    ctx.fillStyle = "#FBBC04"; // Google Yellow
    ctx.fillRect(startX + barWidth * 2, barY, barWidth, barHeight);
    ctx.fillStyle = "#34A853"; // Google Green
    ctx.fillRect(startX + barWidth * 3, barY, barWidth, barHeight);

    // 4. Header: GDG Logo Brackets & Organization Title
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Symbol: < / >
    const logoY = 165;
    ctx.font = "900 36px 'Courier New', monospace";
    ctx.fillStyle = "#EA4335";
    ctx.fillText("<", width / 2 - 28, logoY);
    ctx.fillStyle = "#4285F4";
    ctx.fillText("/", width / 2, logoY);
    ctx.fillStyle = "#34A853";
    ctx.fillText(">", width / 2 + 28, logoY);

    // Community Title
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.fillText("GOOGLE DEVELOPER GROUPS ON CAMPUS", width / 2, 220);

    // Chapter Name
    ctx.fillStyle = "#475569";
    ctx.font = "600 18px system-ui, -apple-system, sans-serif";
    ctx.fillText(
      "B.P. PODDAR INSTITUTE OF MANAGEMENT AND TECHNOLOGY, KOLKATA",
      width / 2,
      255
    );

    // Decorative Separator
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 240, 285);
    ctx.lineTo(width / 2 + 240, 285);
    ctx.stroke();

    // 5. Certificate Title
    ctx.fillStyle = "#0F172A";
    ctx.font = "900 48px system-ui, -apple-system, sans-serif";
    ctx.fillText("CERTIFICATE OF PARTICIPATION", width / 2, 355);

    // Present text
    ctx.fillStyle = "#64748B";
    ctx.font = "bold 17px system-ui, -apple-system, sans-serif";
    ctx.fillText("THIS CERTIFICATE IS PROUDLY PRESENTED TO", width / 2, 425);

    // 6. Recipient Name (Center, bold, elegant)
    ctx.fillStyle = "#1967D2"; // Google Deep Blue
    const displayName = cert.name.toUpperCase();
    const nameFontSize = displayName.length > 25 ? 48 : displayName.length > 18 ? 56 : 64;
    ctx.font = `900 ${nameFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(displayName, width / 2, 510);

    // Name underline with center diamond
    ctx.strokeStyle = "#4285F4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 320, 560);
    ctx.lineTo(width / 2 + 320, 560);
    ctx.stroke();

    // Small decorative dot in center of underline
    ctx.fillStyle = "#EA4335";
    ctx.beginPath();
    ctx.arc(width / 2, 560, 6, 0, Math.PI * 2);
    ctx.fill();

    // 7. Statement / Description
    ctx.fillStyle = "#334155";
    ctx.font = "500 23px system-ui, -apple-system, sans-serif";
    ctx.fillText(
      "for active attendance and valuable participation in the technical community workshop",
      width / 2,
      630
    );

    // Event Name Highlighted
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.fillText(`“${cert.eventName}”`, width / 2, 690);

    // Location & Date line
    ctx.fillStyle = "#475569";
    ctx.font = "500 21px system-ui, -apple-system, sans-serif";
    ctx.fillText(
      `organized by GDG on Campus BPPIMT, held on ${cert.eventDate} at the BPPIMT Campus.`,
      width / 2,
      745
    );

    // 8. Bottom Columns (Date, Golden Badge, Signature)
    const bottomBaseY = 960;

    // --- Left: Issue Date ---
    ctx.textAlign = "center";
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(220, bottomBaseY);
    ctx.lineTo(460, bottomBaseY);
    ctx.stroke();

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    ctx.fillText(cert.issuedDate, 340, bottomBaseY + 35);

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.fillText("DATE OF ISSUANCE", 340, bottomBaseY + 65);

    // --- Center: Golden Verified Badge Seal ---
    const sealX = width / 2;
    const sealY = bottomBaseY - 15;

    // Outer star/sun seal circle
    ctx.fillStyle = "#FEF3C7";
    ctx.beginPath();
    ctx.arc(sealX, sealY, 68, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 62, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#D97706";
    ctx.font = "bold 34px system-ui, -apple-system, sans-serif";
    ctx.fillText("★", sealX, sealY - 10);

    ctx.fillStyle = "#92400E";
    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.fillText("OFFICIAL", sealX, sealY + 16);
    ctx.fillText("VERIFIED", sealX, sealY + 30);

    // --- Right: Organizer Signature ---
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width - 460, bottomBaseY);
    ctx.lineTo(width - 220, bottomBaseY);
    ctx.stroke();

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 24px 'Brush Script MT', 'Segoe Script', cursive, sans-serif";
    ctx.fillText(cert.organizerName, width - 340, bottomBaseY - 20);

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    ctx.fillText(cert.organizerName, width - 340, bottomBaseY + 35);

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.fillText("GDG ON CAMPUS ORGANIZER", width - 340, bottomBaseY + 65);

    // 9. Bottom Footer: Credential ID & Authenticity note
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748B";
    ctx.font = "bold 14px 'Courier New', monospace";
    ctx.fillText(
      `CREDENTIAL ID: ${cert.certId}  •  VERIFIED VIA OFFICIAL BEVY ATTENDANCE ROSTER`,
      width / 2,
      height - 85
    );

    // Bottom Google color line
    const bottomBarY = height - 60;
    ctx.fillStyle = "#4285F4";
    ctx.fillRect(startX, bottomBarY, barWidth, 4);
    ctx.fillStyle = "#EA4335";
    ctx.fillRect(startX + barWidth, bottomBarY, barWidth, 4);
    ctx.fillStyle = "#FBBC04";
    ctx.fillRect(startX + barWidth * 2, bottomBarY, barWidth, 4);
    ctx.fillStyle = "#34A853";
    ctx.fillRect(startX + barWidth * 3, bottomBarY, barWidth, 4);
  }, []);

  // Redraw when certificate state updates
  useEffect(() => {
    if (certificate) {
      drawCertificate(certificate);
    }
  }, [certificate, drawCertificate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = queryInput.trim();
    if (!trimmed) {
      setLastSearched("");
      setErrorMsg("Please enter your registered email address or full name.");
      setErrorCode("EMPTY_INPUT");
      return;
    }

    setLastSearched(trimmed);
    setLoading(true);
    setErrorMsg(null);
    setErrorCode(null);

    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          email: trimmed,
          name: trimmed,
          eventId: eventIdParam,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.certificate) {
        setCertificate(data.certificate);
      } else {
        setCertificate(null);
        setErrorMsg(data.message || "No verified attendee record found.");
        setErrorCode(data.code || "NOT_FOUND");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setCertificate(null);
      setErrorMsg("Unable to connect to verification service. Please try again.");
      setErrorCode("NETWORK_ERROR");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !certificate) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeName = certificate.name.replace(/[^a-zA-Z0-9]/g, "_");
      link.download = `GDG_Certificate_${safeName}_${certificate.certId}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Failed to download canvas PNG:", e);
      alert("Please right click on the certificate and choose 'Save Image As'.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setCertificate(null);
    setErrorMsg(null);
    setErrorCode(null);
    setLastSearched("");
    setQueryInput("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <header className="space-y-3 text-center sm:text-left no-print">
        <h1 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight leading-tight">
          Download Your Event Certificate
        </h1>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 max-w-2xl font-medium">
          Enter your registered email address or your full name as submitted during attendance check-in.
          Once verified, your official certificate will be generated instantly.
        </p>
      </header>

      {/* Search & Verification Input Card (Shown when not yet verified) */}
      {!certificate && (
        <section className="p-6 sm:p-8 rounded-2xl border-[2.5px] border-black dark:border-white/80 bg-white dark:bg-zinc-900 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.75)] space-y-6 no-print">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label
                htmlFor="registeredQuery"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Registered Email Address or Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <input
                  id="registeredQuery"
                  type="text"
                  required
                  placeholder="e.g. Sayim Mullick or sayimmullick2005@gmail.com"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white font-medium text-sm sm:text-base focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border-2 border-black bg-[#4285F4] hover:bg-[#3367D6] disabled:bg-zinc-400 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Roster...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Verify & Generate</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Friendly Animated Error Message Box */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                key="certificate-error-box"
                initial={{ opacity: 0, scale: 0.98, y: 12 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  x: [0, -6, 6, -4, 4, 0],
                }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-6 sm:p-7 rounded-2xl border-2 border-black dark:border-white/30 bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] space-y-5"
              >
                {/* Top Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 text-xs sm:text-sm font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span>
                      {errorCode === "NOT_ATTENDED"
                        ? "Attendance Not Marked"
                        : errorCode === "EMPTY_INPUT"
                        ? "Input Required"
                        : "Record Not Found"}
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    Need help? Check below
                  </span>
                </div>

                {/* Main Content with Animated Emoji */}
                <div className="flex items-start gap-4 sm:gap-5">
                  {/* Friendly Animated Emoji Avatar */}
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -6, 6, 0],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-700/60 border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center flex-shrink-0 text-2xl sm:text-3xl select-none"
                  >
                    {errorCode === "NOT_ATTENDED" ? "📋" : errorCode === "EMPTY_INPUT" ? "✍️" : "🤔"}
                  </motion.div>

                  <div className="space-y-3 flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-black dark:text-white leading-snug">
                      {errorCode === "NOT_ATTENDED"
                        ? "Attendance not recorded for this event 📋"
                        : errorCode === "EMPTY_INPUT"
                        ? "Please enter your name or email first ✍️"
                        : "Oops! We couldn't find your name on the list 😅"}
                    </h4>

                    <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {errorCode === "NOT_ATTENDED" ? (
                        <>
                          Your registration was found, but physical attendance check-in wasn&apos;t marked for this event. Certificates are issued exclusively to attendees who checked in at the venue.
                        </>
                      ) : errorCode === "EMPTY_INPUT" ? (
                        <>
                          Please enter your registered email address or your full name before clicking verify.
                        </>
                      ) : (
                        <>
                          We checked for{" "}
                          <span className="font-semibold text-black dark:text-white bg-zinc-100 dark:bg-zinc-700 px-2.5 py-1 rounded border border-zinc-300 dark:border-zinc-600 break-all">
                            &quot;{lastSearched || queryInput}&quot;
                          </span>
                          , but couldn&apos;t find an attendance record for this event.
                        </>
                      )}
                    </p>

                    {/* Normal, clear helpful checklist */}
                    {errorCode !== "EMPTY_INPUT" && (
                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-700 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <p className="font-semibold text-black dark:text-white flex items-center gap-2">
                          <span>💡</span>
                          <span>Quick things to double-check:</span>
                        </p>
                        <ul className="space-y-1.5 pl-6 list-disc">
                          <li>
                            <strong>Check for typos:</strong> Make sure there are no spelling mistakes or extra spaces in your email.
                          </li>
                          <li>
                            <strong>Try your registered email:</strong> If you registered with your college email or an alternate ID, try searching with that.
                          </li>
                          <li>
                            <strong>Try your full name:</strong> Enter your real full name as written during the event attendance check-in.
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Friendly Help Box */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="space-y-1">
                    <p className="font-bold text-sm sm:text-base text-black dark:text-white">
                      &quot;Wait, but I was definitely there!&quot; 🙋‍♂️
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                      If you attended in person and think your attendance was missed, don&apos;t worry! Contact our organizing team and we&apos;ll verify and issue your certificate.
                    </p>
                  </div>

                  <Link
                    href="/team"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-black dark:border-white bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex-shrink-0"
                  >
                    <span>Contact Team</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Verified Certificate View */}
      {certificate && (
        <section className="space-y-6">
          {/* Success Banner & Actions Bar */}
          <div className="p-5 sm:p-6 rounded-2xl border-[2.5px] border-black dark:border-white/80 bg-[#E6F4EA] dark:bg-[#122416] shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.7)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#34A853] text-white border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                <CheckCircle2 className="w-3 h-3 text-white" />
                <span>ATTENDANCE VERIFIED</span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-black text-black dark:text-white">
                Certificate Ready for {certificate.name}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-mono">
                Credential ID: <span className="font-bold text-[#1967D2]">{certificate.certId}</span> • {certificate.eventName}
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-black bg-[#4285F4] hover:bg-[#3367D6] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-black bg-white dark:bg-zinc-800 text-black dark:text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:bg-zinc-100 dark:hover:bg-zinc-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border-2 border-black bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-mono font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-300 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check Another</span>
              </button>
            </div>
          </div>

          {/* Canvas Certificate Container */}
          <div className="certificate-print-area">
            <div className="relative w-full rounded-2xl border-[3px] border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] bg-white overflow-hidden">
              <canvas
                ref={canvasRef}
                width={1920}
                height={1200}
                className="w-full h-auto block select-none"
              />
            </div>
          </div>

          {/* Social Share & Verification Notice */}
          <div className="p-4 sm:p-5 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 text-center space-y-1 text-xs text-zinc-600 dark:text-zinc-400 no-print">
            <p className="font-bold text-black dark:text-white font-mono">
              Share your achievement on LinkedIn & tag GDG on Campus BPPIMT!
            </p>
            <p>
              Use hashtag <span className="font-semibold text-[#4285F4]">#GDGBPPIMT</span> and mention your organizers.
            </p>
          </div>
        </section>
      )}

      {/* Print CSS to isolate certificate */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print,
          header,
          footer,
          nav {
            display: none !important;
          }
          .certificate-print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .certificate-print-area canvas {
            max-width: 100% !important;
            max-height: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
