window.getImageFiles = async function() {
    try {
        const response = await fetch('/art/art-list.json'); // Fetch from correct location
        if (!response.ok) {
            console.error("Failed to fetch art-list.json");
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching artworks:", error);
        return [];
    }
};
