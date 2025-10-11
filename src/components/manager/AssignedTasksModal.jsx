import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';

export default function AssignedTasksModal({ open, onClose, employee }) {
  // For now, use employee.assignedTasks || sample
  const tasks = employee?.assignedTasks || employee?.tasks || [];

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Assigned Tasks</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">{employee?.name || 'Employee'}</Typography>
          <Typography variant="body2" color="text.secondary">Tasks assigned to this employee</Typography>
        </Box>

        <List>
          {tasks.length === 0 && <Typography color="text.secondary">No tasks assigned.</Typography>}
          {tasks.map((t) => (
            <ListItem key={t.id} divider alignItems="flex-start">
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{t.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{t.description}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 700 }}>{t.status}</Typography>
                      <Typography variant="caption" color="text.secondary">{t.priority}</Typography>
                    </Box>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">Due: {t.due_at || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>Started: {t.started_at || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>Completed: {t.complete_at || '—'}</Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
