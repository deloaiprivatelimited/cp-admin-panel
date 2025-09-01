import React from "react";
import {
  Edit,
  MapPin,
  Hash,
  Building2,
  IdCard,
} from "lucide-react";

function CollegeInfo({ college }) {
  const formatAddress = (address) => {
    if (typeof address === "string") return address;
    const parts = [];
    if (address?.line1) parts.push(address.line1);
    if (address?.line2) parts.push(address.line2);
    if (address?.city) parts.push(address.city);
    if (address?.state) parts.push(address.state);
    if (address?.country) parts.push(address.country);
    if (address?.zip_code) parts.push(address.zip_code);
    return parts.join(", ") || "No address provided";
  };

  const statusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500";
      case "Lead":
        return "bg-blue-500";
      case "Fallowup":
      case "fallowup_2":
        return "bg-amber-500";
      default:
        return "bg-red-500";
    }
  };

  const statusTextColor = (status) => {
    switch (status) {
      case "Active":
        return "text-emerald-700 bg-emerald-50";
      case "Lead":
        return "text-blue-700 bg-blue-50";
      case "Fallowup":
      case "fallowup_2":
        return "text-amber-700 bg-amber-50";
      default:
        return "text-red-700 bg-red-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-2 md:p-4">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 p-4 bg-white/70 backdrop-blur-sm rounded-md border border-white/20 shadow-md">
          <div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              College Information
            </h2>
            <p className="text-slate-600 mt-1 text-sm md:text-base">
              Educational Institution Details
            </p>
          </div>
          <button
            onClick={() => alert("Edit functionality not implemented")}
            className="flex items-center text-white gap-2 px-4 py-2 rounded-md  bg-[#4CA466] hover:bg-[#3d8352] transition-all duration-300 shadow-md hover:shadow-lg transform  text-sm md:text-base"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-md border border-white/30 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="relative bg-[#4CA466] p-6 text-white">
            <div className="absolute inset-0"></div>
            <div className="relative flex items-center">
              <div className="p-3 bg-white/20 rounded-md backdrop-blur-sm mr-4">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  {college?.name || "Harvard University"}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold flex items-center ${statusTextColor(
                      college?.status || "Active"
                    )}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${statusColor(
                        college?.status || "Active"
                      )} mr-2`}
                    ></div>
                    {college?.status || "Active"}
                  </span>
                  <span className="px-3 py-1.5 rounded-full font-semibold bg-white/90 text-black text-xs md:text-sm flex items-center gap-2">
                    <IdCard className="w-4 h-4 text-red-500" />
                    {college?.college_id || "HRV001"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 md:p-6">
            {/* Address */}
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-md border border-slate-200">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg mr-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                  Address
                </h3>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                {college?.address
                  ? formatAddress(college.address)
                  : "Cambridge, MA 02138, United States"}
              </p>
            </div>

            {/* Notes */}
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-gray-100 rounded-md border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-sm md:text-base">
                <Hash className="w-5 h-5 mr-2 text-slate-600" />
                Additional Notes
              </h3>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                {college?.notes ||
                  "Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, Harvard is the oldest institution of higher education in the United States and among the most prestigious in the world."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeInfo;
