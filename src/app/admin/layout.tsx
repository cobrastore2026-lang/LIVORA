import React from "react";
import AdminLayoutClient from "./AdminLayoutClient";
import { getCurrentAdmin } from "@/lib/auth";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  return (
    <AdminLayoutClient admin={admin as any}>
      {children}
    </AdminLayoutClient>
  );
}
