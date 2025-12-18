
import React from 'react';
import { DetailedReport } from '../../types';
import ServicePageLayout from '../services/ServicePageLayout';
import { useTranslation } from '../../hooks/useTranslation';
import ReportCard from '../../components/ReportCard';

interface AllReportsPageProps {
    reports: DetailedReport[];
    onBack: () => void;
    onSelectReport: (report: DetailedReport) => void;
}

const AllReportsPage: React.FC<AllReportsPageProps> = ({ reports, onBack, onSelectReport }) => {
    const { t } = useTranslation();
    return (
        <ServicePageLayout
            title={t('myReports')}
            subtitle="All your submitted reports and their status"
            onBack={onBack}
        >
            <div className="space-y-3">
                {reports.map(report => (
                    <ReportCard
                        key={report.id}
                        report={report}
                        onClick={() => onSelectReport(report)}
                    />
                ))}
            </div>
        </ServicePageLayout>
    );
};

export default AllReportsPage;
