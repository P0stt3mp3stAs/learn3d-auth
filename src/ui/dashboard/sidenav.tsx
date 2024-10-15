import Link from "next/link";
import NavLinks from "@/ui/dashboard/nav-links";
import AcmeLogo from "@/ui/acme-logo";
import LogoutForm from "@/ui/dashboard/logout-form";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 text-black">
      <div className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <LogoutForm />
      </div>
    </div>
  );
}
