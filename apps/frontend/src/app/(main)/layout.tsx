import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="bg-hover">{children}</div>
      </div>
      <Footer />
    </>
  );
}
