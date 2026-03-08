export const PLACEHOLDER_POSTER = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <rect fill="#221012" width="300" height="450"/>
    <rect fill="#ec1325" opacity="0.1" width="300" height="450"/>
    <text fill="#ec1325" opacity="0.4" font-family="Arial" font-size="16" font-weight="bold" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">No Image</text>
  </svg>`
);

export const PLACEHOLDER_BACKDROP = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect fill="#221012" width="1280" height="720"/>
    <rect fill="#ec1325" opacity="0.05" width="1280" height="720"/>
  </svg>`
);

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
};

export const getYear = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
};

export const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

export const getTrailerKey = (videos) => {
    if (!videos?.results?.length) return null;
    const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    return trailer?.key || videos.results[0]?.key || null;
};

export const getRatingColor = (rating) => {
    if (rating >= 7) return 'text-green-400';
    if (rating >= 5) return 'text-yellow-400';
    return 'text-red-400';
};
