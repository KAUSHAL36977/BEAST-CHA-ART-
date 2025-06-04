// API Utilities

// Base URL for API endpoints
const BASE_URL = 'http://localhost:7000';

// Default headers
const defaultHeaders = {
    'Content-Type': 'application/json'
};

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// API methods
export const api = {
    // Get user profile
    getProfile: async (userId) => {
        return fetchAPI(`/api/profile/${userId}`);
    },

    // Update user profile
    updateProfile: async (userId, data) => {
        return fetchAPI(`/api/profile/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // Get user attributes
    getAttributes: async (userId) => {
        return fetchAPI(`/api/attributes/${userId}`);
    },

    // Update attribute
    updateAttribute: async (userId, attributeId, value) => {
        return fetchAPI(`/api/attributes/${userId}/${attributeId}`, {
            method: 'PUT',
            body: JSON.stringify({ value })
        });
    },

    // Add new attribute
    addAttribute: async (userId, attribute) => {
        return fetchAPI(`/api/attributes/${userId}`, {
            method: 'POST',
            body: JSON.stringify(attribute)
        });
    },

    // Get progress log
    getProgressLog: async (userId) => {
        return fetchAPI(`/api/progress/${userId}`);
    },

    // Add progress entry
    addProgressEntry: async (userId, entry) => {
        return fetchAPI(`/api/progress/${userId}`, {
            method: 'POST',
            body: JSON.stringify(entry)
        });
    },

    // Get achievements
    getAchievements: async (userId) => {
        return fetchAPI(`/api/achievements/${userId}`);
    },

    // Unlock achievement
    unlockAchievement: async (userId, achievementId) => {
        return fetchAPI(`/api/achievements/${userId}/${achievementId}`, {
            method: 'POST'
        });
    },

    // Get motivational quotes
    getQuotes: async () => {
        return fetchAPI('/api/quotes');
    },

    // Save user preferences
    savePreferences: async (userId, preferences) => {
        return fetchAPI(`/api/preferences/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
    }
};

// WebSocket connection
export const connectWebSocket = () => {
    const socket = new WebSocket(`ws://${window.location.hostname}:7000`);

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Handle real-time updates
        handleWebSocketMessage(data);
    };

    socket.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
    };

    return socket;
};

// Handle WebSocket messages
const handleWebSocketMessage = (data) => {
    switch (data.type) {
        case 'attributeUpdate':
            // Update attribute in UI
            updateAttributeUI(data.attributeId, data.value);
            break;
        case 'achievementUnlocked':
            // Show achievement notification
            showAchievementNotification(data.achievement);
            break;
        case 'progressUpdate':
            // Update progress in UI
            updateProgressUI(data.progress);
            break;
        default:
            console.log('Unknown message type:', data.type);
    }
}; 