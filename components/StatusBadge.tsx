import React from 'react';
import { ReportStatus } from '../types';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
    const statusStyles = {
        [ReportStatus.Emergency]: 'bg-red-100 text-red-800',
        [ReportStatus.Resolved]: 'bg-green-100 text-green-800',
        [ReportStatus.UnderReview]: 'bg-yellow-100 text-yellow-800',
    };
    const sizeStyles = {
        sm: 'px-2 py-1 text-xs font-semibold',
        md: 'px-2.5 py-1 text-sm font-semibold',
    };
    return (
        <span className={`rounded-full ${statusStyles[status]} ${sizeStyles[size]}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
