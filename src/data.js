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
  { id: '201', type: 'VIP',      floor: 2, ward: 'Private', status: 'vacant',   patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 5, vacantDays: 8,  history: [{ patient: 'Ahmed Khan',      mrNumber: 'MR-00101', contactNumber: '0300-1234567', from: '2026-05-01', admitTime: '09:00', to: '2026-05-07', dischargeTime: '11:00', days: 6, procedure: 'LSCS' }, { patient: 'Sara Malik',  mrNumber: 'MR-00089', contactNumber: '0321-9876543', from: '2026-04-10', admitTime: '14:30', to: '2026-04-15', dischargeTime: '10:00', days: 5, procedure: 'SVD'  }] },
  { id: '202', type: 'VIP',      floor: 2, ward: 'Private', status: 'occupied', patient: 'Dr. Rizwan Ahmed', mrNumber: 'MR-00210', contactNumber: '0333-4567890', admitDate: '2026-06-02', admitTime: '08:30', checklist: freshChecklist(), allocations: 4, vacantDays: 5, history: [{ patient: 'Nadia Siddiqui', mrNumber: 'MR-00155', contactNumber: '0312-1112223', from: '2026-05-12', admitTime: '10:00', to: '2026-05-18', dischargeTime: '09:30', days: 6, procedure: 'DNC' }] },
  { id: '203', type: 'Standard', floor: 2, ward: 'Private', status: 'prep',     patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: { ...freshChecklist(), bedsheets: true, bed: true, floor: true }, allocations: 6, vacantDays: 12, history: [{ patient: 'Omar Sheikh', mrNumber: 'MR-00178', contactNumber: '0345-6667778', from: '2026-05-20', admitTime: '11:00', to: '2026-05-25', dischargeTime: '12:00', days: 5, procedure: 'HTX' }] },
  { id: '204', type: 'Standard', floor: 2, ward: 'Private', status: 'vacant',   patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 2, vacantDays: 18, history: [] },
  { id: '205', type: 'Standard', floor: 2, ward: 'Private', status: 'occupied', patient: 'Fatima Ali', mrNumber: 'MR-00203', contactNumber: '0301-2223334', admitDate: '2026-06-01', admitTime: '16:00', checklist: freshChecklist(), allocations: 3, vacantDays: 10, history: [{ patient: 'Bilal Qureshi', mrNumber: 'MR-00145', contactNumber: '0322-5556667', from: '2026-05-05', admitTime: '09:00', to: '2026-05-09', dischargeTime: '10:00', days: 4, procedure: 'STITCHING' }] },
  { id: '206', type: 'Semi-VIP', floor: 2, ward: 'Private', status: 'vacant',   patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 4, vacantDays: 7,  history: [{ patient: 'Maria Hassan', mrNumber: 'MR-00167', contactNumber: '0311-7778889', from: '2026-05-15', admitTime: '13:00', to: '2026-05-22', dischargeTime: '11:00', days: 7, procedure: 'SVD' }] },
  { id: '207', type: 'Standard', floor: 2, ward: 'Private', status: 'prep',     patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: { ...freshChecklist(), bedsheets: true, bed: true, furniture: true, floor: true, dustbin: true }, allocations: 7, vacantDays: 3, history: [{ patient: 'Usman Baig', mrNumber: 'MR-00211', contactNumber: '0344-9990001', from: '2026-06-01', admitTime: '20:00', to: '2026-06-03', dischargeTime: '08:30', days: 2, procedure: 'LSCS' }] },
  { id: 'C1',  type: 'Cabin',    floor: 1, ward: 'Ward',    status: 'occupied', patient: 'Tariq Mehmood', mrNumber: 'MR-00198', contactNumber: '0300-1112223', admitDate: '2026-06-03', admitTime: '10:15', checklist: freshChecklist(), allocations: 3, vacantDays: 9, history: [{ patient: 'Hina Javed', mrNumber: 'MR-00140', contactNumber: '0333-2223334', from: '2026-05-10', admitTime: '11:30', to: '2026-05-15', dischargeTime: '09:00', days: 5, procedure: 'DNC' }] },
  { id: 'C2',  type: 'Cabin',    floor: 1, ward: 'Ward',    status: 'vacant',   patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 2, vacantDays: 4, history: [{ patient: 'Hina Javed', mrNumber: 'MR-00140', contactNumber: '0333-2223334', from: '2026-05-28', admitTime: '14:00', to: '2026-06-01', dischargeTime: '10:00', days: 4, procedure: '' }] },
  { id: 'C3',  type: 'Cabin',    floor: 1, ward: 'Ward',    status: 'prep',     patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: { ...freshChecklist(), bedsheets: true, toilet: true, soap: true }, allocations: 5, vacantDays: 6, history: [{ patient: 'Zainab Rauf', mrNumber: 'MR-00205', contactNumber: '0321-4445556', from: '2026-05-31', admitTime: '19:00', to: '2026-06-04', dischargeTime: '11:30', days: 4, procedure: 'SVD' }] },
  { id: 'C4',  type: 'Cabin',    floor: 1, ward: 'Ward',    status: 'vacant',   patient: null, mrNumber: null, contactNumber: null, admitDate: null, admitTime: null, checklist: freshChecklist(), allocations: 1, vacantDays: 14, history: [] },
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
