import React from "react";
import Image from "next/image";
import { FileText, Briefcase, User, Settings, CreditCard, Home, Calendar, TrendingUp, Plus } from "lucide-react";

const files = [
  { name: "resume.pdf", uploaded: "2 days ago", size: "1.2 MB", type: "PDF" },
  { name: "linkedin_profile.pdf", uploaded: "4 days ago", size: "890 KB", type: "PDF" },
];

const applications: Array<{
  company: string;
  position: string;
  status: StatusType;
  appliedDate: string;
  salary: string;
}> = [
  { company: "Spotify", position: "Senior Frontend Developer", status: "In Review", appliedDate: "Jun 25, 2025", salary: "$120k" },
  { company: "Microsoft", position: "Product Manager", status: "Interview", appliedDate: "Jun 22, 2025", salary: "$140k" },
  { company: "Google", position: "Software Engineer", status: "Rejected", appliedDate: "Jun 18, 2025", salary: "$160k" },
];

type StatusType = "In Review" | "Interview" | "Rejected";

const statusConfig: Record<StatusType, { bg: string; text: string; border: string }> = {
  "In Review": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Interview": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Rejected": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard", active: true },
  { name: "Cover Letters", icon: FileText, href: "/dashboard/cover-letters" },
  { name: "Applications", icon: Briefcase, href: "/dashboard/applications" },
  { name: "Analytics", icon: TrendingUp, href: "/dashboard/analytics" },
  { name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

function DashboardSidebar() {
  return (
    <aside className="bg-gradient-to-b from-blue-200 via-blue-100 to-pink-100 w-72 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-8 border-b border-gray-100 flex items-center gap-3">
        <Image src="/logo.png" alt="Logo" width={56} height={56} className="rounded-xl shadow-lg" />
        <div>
          {/* Remove JobFlow text, keep only logo for branding */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "text-gray-700 hover:bg-pink-50 hover:text-black"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </a>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Afnan</p>
            <p className="text-xs text-gray-500">afnan@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Afnan </h1>
              <p className="text-gray-600 mt-1">Track your job applications and manage your career journey</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Today</p>
                <p className="text-xs text-gray-500">Friday, June 27</p>
              </div>
              
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-600 font-medium">+2 this week</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Next: Monday 10 AM</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cover Letters Left</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">10</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Basic Plan</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Documents Section */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Documents</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your CV and LinkedIn profile</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Upload New
                </button>
              </div>

              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{file.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">Uploaded {file.uploaded}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{file.size}</span>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Replace
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-600 mt-1">Start your next application</p>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl text-left hover:from-blue-100 hover:to-purple-100 transition-all">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Generate Cover Letter</h3>
                    <p className="text-sm text-gray-600">AI-powered personalized cover letters</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-xl text-left hover:from-emerald-100 hover:to-blue-100 transition-all">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Apply to Job</h3>
                    <p className="text-sm text-gray-600">Submit application with one click</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl text-left hover:from-purple-100 hover:to-pink-100 transition-all">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">View Analytics</h3>
                    <p className="text-sm text-gray-600">Track your application success rate</p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* Recent Applications */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <p className="text-sm text-gray-600 mt-1">Track the status of your job applications</p>
              </div>
              <a href="/dashboard/applications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Company</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Position</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Applied</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.company} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-25">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{app.company}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-700">{app.position}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[app.status].bg} ${statusConfig[app.status].text} ${statusConfig[app.status].border}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-600 text-sm">{app.appliedDate}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900 font-medium">{app.salary}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}