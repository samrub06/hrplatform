import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - HR Platform",
  description: "Create your account on our HR platform",
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      {children}
    </div>
  );
}
