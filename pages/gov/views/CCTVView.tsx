import React from 'react';

const CameraCard: React.FC<{ id: number; location: string }> = ({ id, location }) => (
    <div className="relative aspect-video bg-slate-900 rounded-md overflow-hidden border border-slate-700/80 group">
        <img src={`https://picsum.photos/seed/cctv-grid-${id}/800/450`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={`Camera ${id}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-2 left-3 text-white">
            <p className="font-bold text-sm drop-shadow-md">CAM-{String(id).padStart(2, '0')}</p>
            <p className="text-xs drop-shadow-md">{location}</p>
        </div>
        <div className="absolute top-2 right-2 flex items-center space-x-1.5 text-red-400 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span>REC</span>
        </div>
    </div>
);

const CCTVView: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const cameras = [
        { id: 1, location: 'T. Nagar Junction' }, { id: 2, location: 'Marina Beach Promenade' },
        { id: 3, location: 'Central Station Entry' }, { id: 4, location: 'Koyambedu Market' },
        { id: 5, location: 'Anna Salai' }, { id: 6, location: 'Guindy National Park' },
        { id: 7, location: 'Sector V, Salt Lake' }, { id: 8, location: 'Howrah Bridge Entry' },
        { id: 9, location: 'Connaught Place' }, { id: 10, location: 'India Gate Circle' },
        { id: 11, location: 'Bandra-Worli Sea Link' }, { id: 12, location: 'Majestic Bus Stand' },
    ];

    if (isLoading) {
        return (
            <div className="p-4 md:p-6 animate-shimmer">
                <div className="h-8 bg-slate-700 rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-video bg-slate-700 rounded-md"></div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 md:p-6 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-slate-100 mb-6">Live CCTV Grid</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cameras.map((cam, index) => (
                    <div key={cam.id} className="animate-scaleIn" style={{animationDelay: `${index * 50}ms`}}>
                        <CameraCard {...cam} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CCTVView;
