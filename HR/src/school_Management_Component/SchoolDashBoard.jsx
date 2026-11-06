import React from 'react'
import { Users, Building2, Laptop, GraduationCap, TrendingUp, TrendingDown } from 'lucide-react'

// Metrics configuration with compact sub-info
const metrics = [
  {
    id: 'ongoing',
    title: 'Ongoing Students',
    count: '1,200',
    change: '+12%',
    isPositive: true,
    icon: GraduationCap,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    animationClass: 'animate-slide-up1',
    info: [
      { label: 'Male', value: '620' },
      { label: 'Female', value: '580' },
    ],
  },
  {
    id: 'on-campus',
    title: 'On Campus',
    count: '850',
    change: '+5%',
    isPositive: true,
    icon: Building2,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    animationClass: 'animate-slide-up2',
    info: [
      { label: 'Present', value: '95%' },
      { label: 'Absent', value: '5%' },
    ],
  },
  {
    id: 'online',
    title: 'Online Students',
    count: '350',
    change: '-2%',
    isPositive: false,
    icon: Laptop,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    animationClass: 'animate-slide-up1',
    info: [
      { label: 'Live', value: '240' },
      { label: 'Recorded', value: '110' },
    ],
  },
  {
    id: 'faculty',
    title: 'Faculty & Staff',
    count: '96',
    change: '+4%',
    isPositive: true,
    icon: Users,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    animationClass: 'animate-slide-up2',
    info: [
      { label: 'Teachers', value: '72' },
      { label: 'Support', value: '24' },
    ],
  },
]

const SchoolDashBoard = () => {
  return (
    // items-start prevents columns from stretching to match the tallest sibling's height
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.5fr_1fr] items-start gap-4 p-4 bg-slate-50 min-h-screen">
      
      {/* 1. Main Content / School Table Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-3">School Table</h2>
        <div className="text-sm text-slate-500 h-64">
          List of classes, recent enrollments, or active courses.
        </div>
      </div>

      {/* 2. Compact Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
        {metrics.map((card) => {
          const IconComponent = card.icon
          return (
            <div
              key={card.id}
              className={`rounded-xl bg-white border border-slate-200/80 p-3.5 shadow-sm hover:shadow transition-all duration-200 ${card.animationClass}`}
            >
              {/* Header: Mini Icon + Trend Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${card.bgColor}`}>
                  <IconComponent className={card.iconColor} size={18} />
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    card.isPositive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                  }`}
                >
                  {card.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {card.change}
                </span>
              </div>

              {/* Title & Count */}
              <div className="mb-2">
                <p className="text-xs font-medium text-slate-500 tracking-tight">
                  {card.title}
                </p>
                <p className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  {card.count}
                </p>
              </div>

              {/* Sub-Info Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {card.info.map((item, idx) => (
                  <span key={idx} className="text-slate-500">
                    {item.label}: <strong className="font-semibold text-slate-700">{item.value}</strong>
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Quick Info Sidebar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-3">Quick Info</h2>
        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="font-semibold text-slate-800 text-xs mb-0.5">Campus Capacity</p>
            <p className="text-xs text-slate-500">Currently at 71% occupancy</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="font-semibold text-slate-800 text-xs mb-0.5">Upcoming Event</p>
            <p className="text-xs text-slate-500">Mid-term Examinations starting next week</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SchoolDashBoard