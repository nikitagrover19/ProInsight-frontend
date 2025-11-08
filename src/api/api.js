// Central API service for all FastAPI backend calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://proinsight-backend.onrender.com';

// API endpoints configuration
const ENDPOINTS = {
  HOME: '/',
  HEALTH: '/health',
  PROJECT_INSIGHTS: '/project_insights',
  PREDICT_SUCCESS: '/predict_project_success',
  PREDICT_BATCH: '/predict_batch', 
  PROJECT_ANALYSIS: '/project_analysis',
  GRAPH_DATA: '/graph',
  INTERACTIVE_GRAPH: '/interactive_graph',
  SEND_EMAILS: '/emails',
  EXPORT_ANALYSIS: '/export_analysis'
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  return response.json();
};

// Project insights analysis (main endpoint - returns project_id)
export const analyzeProjectInsights = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROJECT_INSIGHTS}`, {
      method: 'POST',
      body: formData, // FormData with project_name, text_content, files
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Project insights analysis failed:', error);
    throw error;
  }
};

// Predict project success probability
export const predictProjectSuccess = async (projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PREDICT_SUCCESS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Project success prediction failed:', error);
    throw error;
  }
};

// Batch prediction for multiple projects
export const predictBatch = async (projectsData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PREDICT_BATCH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectsData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Batch prediction failed:', error);
    throw error;
  }
};

// Get detailed project analysis by ID (from in-memory storage)
export const getProjectAnalysis = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROJECT_ANALYSIS}/${projectId}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Project analysis retrieval failed:', error);
    throw error;
  }
};

// Get knowledge graph data by project ID
export const getGraphData = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GRAPH_DATA}/${projectId}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Graph data retrieval failed:', error);
    throw error;
  }
};

// Get recent projects (new endpoint)
export const getRecentProjects = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.RECENT_PROJECTS}?limit=${limit}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Recent projects retrieval failed:', error);
    throw error;
  }
};

// Send emails based on analysis
export const sendEmails = async (emailData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_EMAILS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Generic API call function for custom endpoints
export const makeApiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

// Get interactive graph data by project ID
export const getInteractiveGraph = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INTERACTIVE_GRAPH}/${projectId}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Interactive graph retrieval failed:', error);
    throw error;
  }
};

// Export analysis results by project ID
export const exportAnalysis = async (projectId, format = 'json') => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EXPORT_ANALYSIS}/${projectId}?format=${format}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Export analysis failed:', error);
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HEALTH}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Export endpoints for direct access
export const API_ENDPOINTS = ENDPOINTS;
