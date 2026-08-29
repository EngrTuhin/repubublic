"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/reports/proposal");
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-gray-500 font-medium">
      Redirecting to Reports Desk...
    </div>
  );
}
