const API_BASE = '/api';

const DataService = {
    // Projects CRUD
    getProjects: async () => {
        const response = await fetch(`${API_BASE}/projects.php`);
        return await response.json();
    },

    getProjectById: async (id) => {
        const response = await fetch(`${API_BASE}/projects.php?id=${id}`);
        return await response.json();
    },

    addProject: async (project) => {
        const response = await fetch(`${API_BASE}/projects.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });
        return await response.json();
    },

    updateProject: async (id, updatedData) => {
        await fetch(`${API_BASE}/projects.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
    },

    deleteProject: async (id) => {
        await fetch(`${API_BASE}/projects.php?id=${id}`, {
            method: 'DELETE'
        });
    },

    // Contacts
    getContacts: async () => {
        const response = await fetch(`${API_BASE}/contacts.php`);
        return await response.json();
    },

    saveContact: async (contact) => {
        const response = await fetch(`${API_BASE}/contacts.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });
        return await response.json();
    }
};

export default DataService;
