export const CHECKLIST_ITEMS = [
  { id: 'bedsheets',   label: 'Bedsheets & pillow covers changed', icon: '🛏' },
  { id: 'bed',         label: 'Bed clean and disinfected',         icon: '✨' },
  { id: 'furniture',   label: 'Furniture wiped and clean',         icon: '🪑' },
  { id: 'floor',       label: 'Floor mopped',                      icon: '🧹' },
  { id: 'disinfection',label: 'Room disinfected',                  icon: '🧴' },
  { id: 'dustbin',     label: 'Dustbin emptied and lined',         icon: '🗑' },
  { id: 'toilet',      label: 'Toilet cleaned',                    icon: '🚽' },
  { id: 'soap',        label: 'Soap available in toilet',          icon: '🧼' },
  { id: 'water',       label: 'Water supply available',            icon: '💧' },
  { id: 'lights',      label: 'Lights & fans operational',         icon: '💡' },
];

export const PROCEDURES = ['SVD', 'LSCS', 'DNC', 'HTX', 'STITCHING'];

export function freshChecklist() {
  const obj = {};
  CHECKLIST_ITEMS.forEach(c => (obj[c.id] = false));
  return obj;
}

export const INITIAL_ROOMS = [
  { id: '201', type: 'VIP',      floor: 2, ward: 'Private', status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: '202', type: 'VIP',      floor: 2, ward: 'Private', status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: '203', type: 'Standard', floor: 2, ward: 'Private', status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: '204', type: 'Standard', floor: 2, ward: 'Private', status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: '205', type: 'Standard', floor: 2, ward: 'Private', status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: '206', type: 'Semi-VIP', floor: 2, ward: 'Private', status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: '207', type: 'Standard', floor: 2, ward: 'Private', status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: 'C1',  type: 'Cabin',    floor: 1, ward: 'Ward',    status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: 'C2',  type: 'Cabin',    floor: 1, ward: 'Ward',    status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: 'C3',  type: 'Cabin',    floor: 1, ward: 'Ward',    status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
  { id: 'C4',  type: 'Cabin',    floor: 1, ward: 'Ward',    status: 'vacant', patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 0, vacantDays: 0, history: [] },
];

export const USERS = [
  { id: 1, username: 'admin',     password: 'admin123',     role: 'admin',     name: 'Admin',          avatar: 'AD' },
  { id: 2, username: 'reception', password: 'reception123', role: 'reception', name: 'Reception Desk', avatar: 'RD' },
];

export const STATUS_CONFIG = {
  occupied: { label: 'Occupied',  color: '#9b2226', bg: '#fde8e8', border: '#f5c6c6', dot: '#e53e3e' },
  vacant:   { label: 'Ready',     color: '#2d6a4f', bg: '#d8f3dc', border: '#b7e4c7', dot: '#38a169' },
  prep:     { label: 'Preparing', color: '#92400e', bg: '#fef3c7', border: '#fcd34d', dot: '#d97706' },
};

export const TYPE_CONFIG = {
  'VIP':      { color: '#7c3aed', bg: '#ede9fe' },
  'Semi-VIP': { color: '#1e40af', bg: '#dbeafe' },
  'Standard': { color: '#374151', bg: '#f3f4f6' },
  'Cabin':    { color: '#065f46', bg: '#d1fae5' },
};
