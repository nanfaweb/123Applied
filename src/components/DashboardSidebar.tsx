// import React from "react";
// import Link from "next/link";
// import Image from "next/image";

// const navItems = [
//   { name: "Home", icon: "home", href: "/dashboard" },
//   { name: "Cover Letters", icon: "file-text", href: "/dashboard/cover-letters" },
//   { name: "Applications", icon: "briefcase", href: "/dashboard/applications" },
//   { name: "Billing", icon: "credit-card", href: "/dashboard/billing" },
//   { name: "Settings", icon: "settings", href: "/dashboard/settings" },
// ];

// export default function DashboardSidebar() {
//   return (
//     <aside className="bg-gradient-to-b from-blue-200 via-blue-100 to-pink-100 w-64 min-h-screen flex flex-col gap-8">
//       <div className="flex items-center gap-3 mb-8 justify-center">
//         <Image src="/logo.png" alt="Logo" width={96} height={96} className="rounded-full shadow-lg" />
//       </div>
//       <nav className="flex flex-col gap-2">
//         {navItems.map((item) => (
//           <Link
//             key={item.name}
//             href={item.href}
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-black font-semibold hover:bg-pink-100 transition"
//           >
//             {/* Replace with icons as needed */}
//             <span className="text-lg">{item.name}</span>
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// }
