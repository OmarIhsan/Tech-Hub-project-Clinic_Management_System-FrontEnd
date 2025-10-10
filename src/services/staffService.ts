import { Staff } from '../types';

interface CreateStaffData {
  full_name: string;
  phone?: string;
  email?: string;
  hire_date?: string;
}

interface UpdateStaffData {
  full_name?: string;
  phone?: string;
  email?: string;
  hire_date?: string;
}

const mockStaff: Staff[] = [
  {
    id: '1',
    staff_id: 1,
    full_name: 'Sarah Johnson',
    phone: '555-0101',
    email: 'sarah.johnson@clinic.com',
    hire_date: '2020-03-15'
  },
  {
    id: '2',
    staff_id: 2,
    full_name: 'Michael Chen',
    phone: '555-0102',
    email: 'michael.chen@clinic.com',
    hire_date: '2019-08-22'
  },
  {
    id: '3',
    staff_id: 3,
    full_name: 'Emily Rodriguez',
    phone: '555-0103',
    email: 'emily.rodriguez@clinic.com',
    hire_date: '2021-01-10'
  },
  {
    id: '4',
    staff_id: 4,
    full_name: 'David Thompson',
    phone: '555-0104',
    email: 'david.thompson@clinic.com',
    hire_date: '2018-11-05'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const staffService = {
  getAll: async (): Promise<{ data: Staff[] }> => {
    try {
      await delay(500);
      return { data: mockStaff };
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw new Error('Failed to fetch staff');
    }
  },

  getById: async (id: string): Promise<{ data: Staff }> => {
    try {
      await delay(300);
      const staff = mockStaff.find(s => s.id === id);
      if (!staff) {
        throw new Error('Staff member not found');
      }
      return { data: staff };
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  },

  create: async (staffData: CreateStaffData): Promise<{ data: Staff }> => {
    try {
      await delay(800);
      const newStaff: Staff = {
        ...staffData,
        id: Date.now().toString(),
        staff_id: mockStaff.length + 1,
      };
      mockStaff.push(newStaff);
      return { data: newStaff };
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw new Error('Failed to create staff member');
    }
  },

  update: async (id: string, staffData: UpdateStaffData): Promise<{ data: Staff }> => {
    try {
      await delay(800);
      const index = mockStaff.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error('Staff member not found');
      }
      mockStaff[index] = { ...mockStaff[index], ...staffData };
      return { data: mockStaff[index] };
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await delay(500);
      const index = mockStaff.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error('Staff member not found');
      }
      mockStaff.splice(index, 1);
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  },

  getByHireDateRange: async (startDate: string, endDate: string): Promise<{ data: Staff[] }> => {
    try {
      await delay(400);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const staff = mockStaff.filter(s => {
        if (!s.hire_date) return false;
        const hireDate = new Date(s.hire_date);
        return hireDate >= start && hireDate <= end;
      });
      return { data: staff };
    } catch (error) {
      console.error('Error fetching staff by hire date range:', error);
      throw new Error('Failed to fetch staff for date range');
    }
  }
};

export default staffService;