const API_BASE = '/api';
const LOCAL_STORAGE_KEY = 'inmarc_projects_mock';

// Helper to get local data
const getLocalProjects = () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveLocalProjects = (projects) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
};

const DataService = {
    // Projects CRUD
    getProjects: async () => {
        try {
            const response = await fetch(`${API_BASE}/projects.php`);
            if (!response.ok) throw new Error('API unreachable');
            return await response.json();
        } catch (e) {
            console.warn('Using LocalStorage fallback for projects');
            return getLocalProjects();
        }
    },

    getProjectById: async (id) => {
        try {
            const response = await fetch(`${API_BASE}/projects.php?id=${id}`);
            return await response.json();
        } catch (e) {
            const projects = getLocalProjects();
            return projects.find(p => p.id == id);
        }
    },

    addProject: async (project) => {
        try {
            const response = await fetch(`${API_BASE}/projects.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project)
            });
            return await response.json();
        } catch (e) {
            const projects = getLocalProjects();
            const now = new Date().toISOString();
            const newProject = { 
                ...project, 
                id: Date.now(), 
                createdAt: now,
                updatedAt: now 
            };
            projects.push(newProject);
            saveLocalProjects(projects);
            return { success: true, project: newProject };
        }
    },

    updateProject: async (id, updatedData) => {
        try {
            const response = await fetch(`${API_BASE}/projects.php?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        } catch (e) {
            const projects = getLocalProjects();
            const index = projects.findIndex(p => p.id == id);
            if (index !== -1) {
                projects[index] = { 
                    ...projects[index], 
                    ...updatedData,
                    updatedAt: new Date().toISOString()
                };
                saveLocalProjects(projects);
            }
            return { success: true };
        }
    },

    deleteProject: async (id) => {
        try {
            const response = await fetch(`${API_BASE}/projects.php?id=${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        } catch (e) {
            const projects = getLocalProjects();
            const filtered = projects.filter(p => p.id != id);
            saveLocalProjects(filtered);
            return { success: true };
        }
    },
    // ... (rest of the service)

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
