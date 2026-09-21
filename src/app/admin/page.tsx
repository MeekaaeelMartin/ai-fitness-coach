import type { Metadata } from "next";
import { AdminContent } from "@/components/admin/admin-content";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminContent />;
}
