

import React from 'react';
// FIX: The mock data is exported from mockApi.ts, not the empty homeData.ts file.
import { mockResolvedIssues } from '../../api/mockApi';
import { ResolvedIssue } from '../../types';
import ServicePageLayout from '../services/ServicePageLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { CheckCircleIcon } from '../../components/icons/NavIcons';

const ResolvedIssueCard: React.FC<{ issue: ResolvedIssue }> = ({ issue }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-3 flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
             <CheckCircleIcon />
        </div>
        <div>
            <p className="font-semibold text-gray-800">{issue.title}</p>
            <p className="text-xs text-gray-500">{issue.category} · {issue.resolvedDate}</p>
        </div>
    </div>
);

const AllResolvedIssuesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <ServicePageLayout
            title={t('recentlyResolved')}
            subtitle="A log of all civic issues resolved recently"
            onBack={onBack}
        >
            <div className="space-y-3">
                {mockResolvedIssues.map(issue => <ResolvedIssueCard key={issue.id} issue={issue} />)}
            </div>
        </ServicePageLayout>
    );
};

export default AllResolvedIssuesPage;