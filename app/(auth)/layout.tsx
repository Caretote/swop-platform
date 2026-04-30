import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — SWOP Intelligence Platform",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--swop-bg)" }}>
      {children}
    </div>
  );
}
