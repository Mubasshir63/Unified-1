import React, { useState, useMemo } from 'react';
import { StaffMember } from '../../../types';
import { SearchIcon } from '../../../components/icons/NavIcons';

interface StaffTableProps<T extends StaffMember> {
    title: string;
    data: T[];
    columns: { header: string; accessor: keyof T | ((item: T) => React.ReactNode) }[];
    isLoading: boolean;
}

const TableSkeleton: React.FC = () => (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 animate-shimmer">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-slate-700 rounded w-full mb-4"></div>
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-700 rounded w-full"></div>
            ))}
        </div>
    </div>
);

const StaffTable = <T extends StaffMember>({ title, data, columns, isLoading }: StaffTableProps<T>) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [data, searchQuery]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h3 className="font-bold text-slate-200 text-lg mb-2 sm:mb-0">{title}</h3>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset page on new search
                        }}
                        className="w-full sm:w-64 bg-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                        <tr>
                            {columns.map(col => (
                                <th key={col.header} scope="col" className="px-4 py-3">{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item) => (
                            <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                {columns.map(col => (
                                    <td key={col.header} className="px-4 py-3 whitespace-nowrap">
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(item)
                                            : String(item[col.accessor])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                 <div className="flex justify-between items-center pt-3 text-sm">
                    <span className="text-slate-400">Page {currentPage} of {totalPages}</span>
                    <div className="flex space-x-2">
                        <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1 bg-slate-700 rounded-md disabled:opacity-50">Prev</button>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-3 py-1 bg-slate-700 rounded-md disabled:opacity-50">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffTable;
