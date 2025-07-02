import Link from "next/link";

const BillingButton = () => (
  <Link href="/dashboard/billing">
    <button className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-[#e61c71] text-white hover:shadow-lg hover:shadow-[#e61c71]/20 transition-all duration-300">
      Go to Billing
    </button>
  </Link>
);

export default BillingButton;
