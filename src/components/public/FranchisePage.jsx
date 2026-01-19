import React from 'react';
import { Map, TrendingUp, Cpu, Building, Users } from 'lucide-react';

export const FranchisePage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pt-20">
            {/* Header */}
            <section className="bg-[#0f172a] py-20 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#C9B47C]/10 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-4 block">For Visionary Educators</span>
                    <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
                        Open a University School <br />
                        <span className="text-[#C9B47C]">Enrichment Center.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl">
                        Bring the "Matrix" technology to your community. Empower high-agency students to skip the conveyor belt and accelerate their future.
                    </p>

                    <div className="flex gap-4 mt-8">
                        <button className="bg-[#C9B47C] hover:bg-[#b09b63] text-slate-900 px-6 py-3 rounded-lg font-bold transition-colors">
                            Request Franchise Info
                        </button>
                        <button className="border border-slate-600 hover:border-white text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            View Territory Map
                        </button>
                    </div>
                </div>
            </section>

            {/* The Opportunity */}
            <section className="py-24 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-white mb-6">The Micro-School Revolution</h2>
                            <p className="text-slate-400 text-lg mb-6">
                                Parents are opting out of broken public systems. University School offers a turnkey "school-in-a-box" solution:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Proprietary 'Matrix' Curriculum Engine",
                                    "UC Berkeley Supervised Pathways",
                                    "Hardware-ready (VR, Robotics, 3D Printing) specs",
                                    "Global Accreditation Network"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <CheckCircle className="text-[#C9B47C]" size={20} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-700">
                                <TrendingUp className="text-[#C9B47C] mb-4" size={32} />
                                <div className="text-3xl font-bold text-white mb-1">$450k</div>
                                <div className="text-sm text-slate-500">Avg. Annual Revenue</div>
                            </div>
                            <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-700">
                                <Users className="text-[#C9B47C] mb-4" size={32} />
                                <div className="text-3xl font-bold text-white mb-1">12-15</div>
                                <div className="text-sm text-slate-500">Max Class Size</div>
                            </div>
                            <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-700">
                                <Cpu className="text-[#8B2332] mb-4" size={32} />
                                <div className="text-3xl font-bold text-white mb-1">AI</div>
                                <div className="text-sm text-slate-500">Navigator-Led</div>
                            </div>
                            <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-700">
                                <Building className="text-[#8B2332] mb-4" size={32} />
                                <div className="text-3xl font-bold text-white mb-1">1,200</div>
                                <div className="text-sm text-slate-500">Sq. Ft. Required</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Helper component
const CheckCircle = ({ className, size }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);
