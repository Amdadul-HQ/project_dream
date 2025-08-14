import logo from "@/assets/logo/Logo.png";
import Image from "next/image";
import Link from "next/link";
const Logo = ({ width = 100, height = 80 }: { width?: number; height?: number }) => {
  return (
    <button>
      <Link href={"/"}>
        <Image src={logo} alt="logo" width={width} height={height} className="object-fill" />
      </Link>
    </button>
  );
};

export default Logo;
