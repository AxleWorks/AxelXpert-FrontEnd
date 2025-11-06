import React, { useState } from "react";
import { Typography, 
         Paper, 
         Box, 
         Chip, 
         LinearProgress,
         Collapse,
         List,
         ListItem,
         ListItemText,
         IconButton } from "@mui/material";
import { DirectionsCar as DirectionsCarIcon,
         ExpandMore as ExpandMoreIcon, 
         ExpandLess as ExpandLessIcon,
         CheckCircle as CheckCircleIcon,
         Schedule as ScheduleIcon,
         RadioButtonUnchecked as NotStartedIcon
         } from '@mui/icons-material';

const calculateProgress = (subTasks) => {
    if (!subTasks || subTasks.length === 0) return 0;

    const completedTasks = subTasks.filter(t => t.status === 'COMPLETED').length;
    return Math.round((completedTasks / subTasks.length) * 100);
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon color="success" />;
      case 'IN_PROGRESS':
        return <ScheduleIcon color="primary" />;
      case 'NOT_STARTED':
      default:
        return <NotStartedIcon color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      case 'NOT_STARTED':
      default:
        return 'default';
    }
  };

  const ManagerProgressTaskCard = ({task}) => {

  const [open, setOpen] = useState(false);
  const [openPhotos, setOpenPhotos] = useState(false);

  const progressPercentage = calculateProgress(task.subTasks);

  //Sorting map to give numbers
  const statusOrder = {
      'COMPLETED': 1,
      'IN_PROGRESS': 2,
      'NOT_STARTED': 3
    };

    // .slice to create a copy of the array
    const sortedSubTasks = (task.subTasks || []).slice().sort((a, b) => {
      const orderA = statusOrder[a.status];
      const orderB = statusOrder[b.status];
      return orderA - orderB;
    });

    return (
      <Paper sx={{ mb: 0 }}>
      {/* Clickable Header Section */}
      <ListItem
      onClick={() => setOpen(!open)} sx={{ cursor: 'pointer', py: 0, px: 0, minHeight: 60, '&:hover': { bgcolor: 'action.hover' } }}>

        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: 2, minWidth: '900px', px: 2, minHeight: 60 }}>
            <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
              <IconButton size="small" aria-label={open ? 'collapse' : 'expand'}>
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <Typography variant="body2">{task.id}</Typography>
            </Box>
            <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2">{task.vehicle}</Typography>
            </Box>
            <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2">{task.customerName}</Typography>
            </Box>
            <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2">{task.employeeName || 'N/A'}</Typography>
            </Box>
            <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
              <LinearProgress 
                variant="determinate"
                value={progressPercentage}
                sx={{ height: 8, borderRadius: 5, width: '100%' }}
              />
              <Typography variant="caption">{progressPercentage}%</Typography>
            </Box>
            <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2">
                {task.durationMinutes && ` ${new Date(new Date(task.startTime).getTime() + task.durationMinutes * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
              </Typography>
            </Box>
            <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Chip
                label={task.status.replace('_', ' ')}
                color={getStatusColor(task.status)}
                size="small"
                sx={{ fontWeight: 500, fontSize: '10px', height: 24, maxWidth: '100%', '& .MuiChip-label': { px: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }}/>
            </Box>
        </Box>
      </ListItem>

      {/* Collapsible Sub-Task List */}
      <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
        Tasks Progress
        </Typography>
        {/* dense make the list items a bit smaller */}
        <List dense>
        {sortedSubTasks.map((sub) => (
          <ListItem key={sub.id} sx={{ pl: 1, bgcolor: 'action.hover', p: 1, mb: 1, borderRadius: 10 }}>
          <Chip
            icon={getStatusIcon(sub.status)}
            size="small"
            color={getStatusColor(sub.status)}
            sx={{ 
            height: 24, 
            mr: 2,
            '& .MuiChip-icon': {
            marginLeft: '8px',
            marginRight: '-4px'
            }
            }}
            />
          <ListItemText 
            primary={sub.title} 
          />
          </ListItem>
          ))}
          </List>

          {/*Progress Photos Section with Dropdown*/}
          <Box sx={{ mb: 2 }}>
            <Box 
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setOpenPhotos(!openPhotos)}>
              <Typography variant="subtitle1" fontWeight="500" sx={{ mr: 1 }}>
                Progress Photos
              </Typography>
              <IconButton size="small" aria-label={openPhotos ? 'collapse' : 'expand'}>
                {openPhotos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={openPhotos} timeout="auto" unmountOnExit>
              <List dense sx={{ pl: 1, bgcolor: 'action.selected', p: 2, mt: 1, borderRadius: 2 }}>
                {task.progressPhotos && task.progressPhotos.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2,mt: 1}}>
                  {task.progressPhotos.map((photoUrl, index) => (
                <Box
                  key={index}
                  sx={{
                      position: 'relative',
                      paddingTop: '100%',
                      overflow: 'hidden',
                      borderRadius: 2,
                      boxShadow: 2,
                      bgcolor: 'background.default',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}>
                  <img
                    src={photoUrl}
                    alt={`Progress photo ${index + 1}`}
                    loading="lazy" 
                    style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                    }}
                    onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      color: #999;
                      text-align: center;
                      font-size: 12px;">
                      Image not available
                      </div>`;
                    }}
                  />
                  </Box>
                ))}
                </Box>
              ) : (
                <Box sx={{p: 2, bgcolor: 'action.hover', borderRadius: 2}}>
                  <Typography variant="body2" color="text.secondary">
                    No progress photos available yet
                  </Typography>
                </Box>
              )}
              </List>
            </Collapse>
          </Box>
      </Box>
      </Collapse>
      </Paper>
    );
  };

export default ManagerProgressTaskCard;
