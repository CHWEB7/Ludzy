import { FloatingHeader } from "@/components/FloatingHeader";

export default function LegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingHeader />
      {children}
    </>
  );
}
