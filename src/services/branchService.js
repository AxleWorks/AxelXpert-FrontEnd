import { authenticatedAxios as axios } from '../utils/axiosConfig';

// Base API URL for branch endpoints
const BRANCH_API = '/api/branches';

/**
 * Branch Service
 * Handles all branch-related API calls
 */
export const branchService = {  // Get all branches
  getAllBranches: async () => {
    try {
      const response = await axios.get(`${BRANCH_API}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  // Get branch by ID
  getBranchById: async (id) => {
    try {
      const response = await axios.get(`${BRANCH_API}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch by ID:', error);
      throw error;
    }
  },

  // Get employees by branch
  getEmployeesByBranch: async (branchId) => {
    try {
      const response = await axios.get(`${BRANCH_API}/${branchId}/employees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees by branch:', error);
      throw error;
    }
  },

  // Map branch ID to branch name (utility function)
  getBranchNameById: async (branchId, branches = []) => {
    if (branches.length === 0) {
      branches = await branchService.getAllBranches();
    }
    
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  }
};

export default branchService;
