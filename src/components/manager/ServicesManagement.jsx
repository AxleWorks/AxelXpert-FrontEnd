import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, X as XIcon } from 'lucide-react';
import IconTextButton from '../../components/ui/iconButton';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { ConfirmationDialog } from '../../components/ui/dialog';
import { toast } from '../../components/ui/toast';

const servicesData = [
  { id: 1, name: 'Oil Change', duration: '30-45 mins', price: 49.99, category: 'Engine' },
  { id: 2, name: 'Brake Service', duration: '1-2 hrs', price: 149.99, category: 'Brakes' },
  { id: 3, name: 'Battery Replacement', duration: '30 mins', price: 129.99, category: 'Electrical' },
  { id: 4, name: 'Tire Rotation', duration: '45 mins', price: 39.99, category: 'Tires' },
  { id: 5, name: 'AC Service', duration: '1-1.5 hrs', price: 99.99, category: 'Electrical' },
  { id: 6, name: 'Engine Diagnostics', duration: '1 hr', price: 89.99, category: 'Engine' },
  { id: 7, name: 'Transmission Service', duration: '2-3 hrs', price: 199.99, category: 'Engine' },
  { id: 8, name: 'Wheel Alignment', duration: '1 hr', price: 79.99, category: 'Tires' },
];

export default function ServicesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState(servicesData);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  // confirmation removed; delete is immediate

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddService = (newService) => {
    setServices((prev) => [...prev, { ...newService, id: Date.now() }]);
    toast.success('Service added!', { description: 'New service has been added successfully.' });
    setIsAddOpen(false);
  };

  const handleEditServiceSave = (updates) => {
    setServices((prev) => prev.map((s) => (s.id === updates.id ? updates : s)));
    toast.success('Service updated!', { description: 'Service details have been updated successfully.' });
    setIsEditOpen(false);
    setEditService(null);
  };

  // Delete immediately without confirmation (per request)
  const handleRequestDelete = (service) => {
    setServices((prev) => prev.filter((s) => s.id !== service.id));
    toast.success('Service deleted!', { description: `${service.name} has been removed from the system.` });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Services Management</h1>
          <div style={{ color: 'rgba(0,0,0,0.6)' }}>Manage service offerings and pricing</div>
        </div>

        <div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus size={16} />
            <span style={{ marginLeft: 8 }}>Add Service</span>
          </Button>
        </div>
      </div>

      {/* Search Card */}
      <Card>
        <CardContent>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.4)' }} />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ paddingLeft: '40px' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>All Services ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <th style={{ padding: '12px 8px' }}>Service Name</th>
                  <th style={{ padding: '12px 8px' }}>Duration</th>
                  <th style={{ padding: '12px 8px' }}>Price</th>
                  <th style={{ padding: '12px 8px' }}>Category</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service) => (
                  <tr key={service.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '14px 8px' }}>{service.name}</td>
                    <td style={{ padding: '14px 8px' }}>{service.duration}</td>
                    <td style={{ padding: '14px 8px' }}>${service.price}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 16, background: '#ffffff', color: 'rgba(0,0,0,0.75)', border: '1px solid rgba(0,0,0,0.08)', fontSize: '0.85rem', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.01)'}}>
                        {service.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <IconTextButton
                          icon={<Edit size={14} />}
                          text="Edit"
                          variant="outline"
                          size="sm"
                          onClick={() => { setEditService(service); setIsEditOpen(true); }}
                        />
                        <IconTextButton
                          icon={<Trash2 size={14} />}
                          text="Delete"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRequestDelete(service)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog - simple inline form */}
      {isAddOpen && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* dark blurred backdrop - clicks should not close modal */}
          <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.45)', pointerEvents: 'auto' }} />
          <div onClick={(e) => e.stopPropagation()} style={{ width: 520, background: 'white', borderRadius: 12, boxShadow: '0 18px 50px rgba(2,6,23,0.35)', padding: 24, position: 'relative', zIndex: 2 }}>
            <button onClick={() => setIsAddOpen(false)} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, border: 'none', background: 'transparent', cursor: 'pointer', padding: 6 }}>
              <XIcon size={18} />
            </button>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Add New Service</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <Label>Service Name</Label>
                <Input placeholder="e.g., Oil Change" id="add-name" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
              </div>

              <div>
                <Label>Category</Label>
                <Input placeholder="Select category" id="add-category" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Label>Duration</Label>
                  <Input placeholder="e.g., 30-45 mins" id="add-duration" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
                </div>
                <div style={{ width: 160 }}>
                  <Label>Price ($)</Label>
                  <Input type="number" placeholder="49.99" id="add-price" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Input placeholder="Service description..." id="add-desc" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
              </div>

              <div>
                <Button onClick={() => {
                  const name = document.getElementById('add-name').value;
                  const category = document.getElementById('add-category').value;
                  const duration = document.getElementById('add-duration').value;
                  const price = parseFloat(document.getElementById('add-price').value || 0);
                  if (!name) { toast.error('Service name is required'); return; }
                  handleAddService({ name, category, duration, price });
                }} sx={{ width: '100%', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}>Add Service</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog - simple inline form */}
      {isEditOpen && editService && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* dark blurred backdrop - clicks should not close modal */}
          <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.45)', pointerEvents: 'auto' }} />
          <div onClick={(e) => e.stopPropagation()} style={{ width: 520, background: 'white', borderRadius: 12, boxShadow: '0 18px 50px rgba(2,6,23,0.35)', padding: 24, position: 'relative', zIndex: 2 }}>
            <button onClick={() => { setIsEditOpen(false); setEditService(null); }} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, border: 'none', background: 'transparent', cursor: 'pointer', padding: 6 }}>
              <XIcon size={18} />
            </button>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Edit Service</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <Label>Service Name</Label>
                <Input defaultValue={editService.name} id="edit-name" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
              </div>

              <div>
                <Label>Category</Label>
                <Input defaultValue={editService.category} id="edit-category" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Label>Duration</Label>
                  <Input defaultValue={editService.duration} id="edit-duration" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
                </div>
                <div style={{ width: 160 }}>
                  <Label>Price ($)</Label>
                  <Input type="number" defaultValue={editService.price} id="edit-price" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8 } }} />
                </div>
              </div>

              <div>
                <Button onClick={() => {
                  const name = document.getElementById('edit-name').value;
                  const category = document.getElementById('edit-category').value;
                  const duration = document.getElementById('edit-duration').value;
                  const price = parseFloat(document.getElementById('edit-price').value || 0);
                  if (!name) { toast.error('Service name is required'); return; }
                  handleEditServiceSave({ id: editService.id, name, category, duration, price });
                }} sx={{ width: '100%', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation dialog removed - delete is immediate */}
    </div>
  );
}
