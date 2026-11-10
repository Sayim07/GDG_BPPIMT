import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-subtle border border-border-subtle text-text-secondary mb-4">
        <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
        <span>404 &bull; Page Not Found</span>
      </div>

      <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-text-primary tracking-tight">
        Lost in the <span className="text-[#4285F4]">Cloud</span>?
      </h1>
      <p className="text-sm sm:text-base text-text-secondary mt-3 max-w-md">
        The page you are looking for doesn't exist or has been relocated within the GDG on Campus chapter.
      </p>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary-hover font-semibold text-sm transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}

