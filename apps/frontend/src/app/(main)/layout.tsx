import Navbar from "@/components/shared/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-7xl mx-auto">
    <Navbar />
      <div className="bg-hover">
        {children}
      </div>

    </div>
  );
}