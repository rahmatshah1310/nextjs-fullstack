import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  fromColor: string;
  toColor: string;
  textColor?: string;
  colSpan?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, fromColor, toColor, textColor = "text-white", colSpan = "" }) => {
  return (
    <div
      className={`bg-gradient-to-br from-${fromColor} to-${toColor} ${colSpan} 
      rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 card-hover`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColor} text-sm font-medium`}>{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
