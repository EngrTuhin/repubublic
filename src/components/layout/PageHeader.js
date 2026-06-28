import React from "react";

export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center">{actions}</div>}
    </div>
  );
}
