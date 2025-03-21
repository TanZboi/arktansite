window.getImageFiles = async function() {
    try {
        const response = await fetch("/art/art-list.json");
        if (!response.ok) throw new Error("Failed to load image list");

        const data = await response.json();
        return data.images.map(img => `/art/${img}`);
    } catch (error) {
        console.error("Error loading images:", error);
        return [];
    }
};


