// Simple mock data that's easy to replace with backend responses
export const tasks = [
  { id: 'task-101', title: 'Oil change', description: 'Change engine oil for Vehicle A', status: 'Completed', priority: 'Low', due_at: '2025-09-01', started_at: '2025-08-31', complete_at: '2025-09-01' },
  { id: 'task-102', title: 'Replace brake pads', description: 'Replace front brake pads Vehicle B', status: 'Pending', priority: 'High', due_at: '2025-09-10', started_at: null, complete_at: null },
  { id: 'task-201', title: 'Battery check', description: 'Full battery diagnostic', status: 'In Progress', priority: 'Medium', due_at: '2025-09-05', started_at: '2025-09-03', complete_at: null },
  { id: 'task-401', title: 'Engine diagnostics', description: 'Run full diagnostics on Vehicle C', status: 'Pending', priority: 'High', due_at: '2025-09-15', started_at: null, complete_at: null },
];

export const employees = [
  { id: 1, name: 'Michael Chen', email: 'michael.chen@axlexpert.com', role: 'Senior Technician', branch: 'Downtown', status: 'Active', tasksCompleted: 145, rating: 4.8, taskIds: ['task-101','task-102'] },
  { id: 2, name: 'Sarah Wilson', email: 'sarah.wilson@axlexpert.com', role: 'Technician', branch: 'Downtown', status: 'Active', tasksCompleted: 98, rating: 4.6, taskIds: ['task-201'] },
  { id: 3, name: 'David Martinez', email: 'david.martinez@axlexpert.com', role: 'Junior Technician', branch: 'Downtown', status: 'On Leave', tasksCompleted: 54, rating: 4.5, taskIds: [] },
  { id: 4, name: 'Emily Thompson', email: 'emily.thompson@axlexpert.com', role: 'Technician', branch: 'Downtown', status: 'Active', tasksCompleted: 112, rating: 4.9, taskIds: ['task-401'] },
];

// helper: get tasks by ids
export function getTasksByIds(ids = []) {
  return tasks.filter((t) => ids.includes(t.id));
}

// helper: simulate fetching employees (can be replaced by real fetch)
export function getEmployees() {
  return employees;
}
