import { OtherIncome } from '../types';

interface CreateOtherIncomeData {
  source: string;
  amount: number;
  income_date: string;
  staff_id?: number;
  patient_id?: number;
}

interface UpdateOtherIncomeData {
  source?: string;
  amount?: number;
  income_date?: string;
  staff_id?: number;
  patient_id?: number;
}

const mockOtherIncomes: OtherIncome[] = [
  {
    id: '1',
    income_id: 1,
    source: 'Insurance Reimbursement',
    amount: 15000.00,
    income_date: '2024-01-15',
    staff_id: 1,
    patient_id: 1
  },
  {
    id: '2',
    income_id: 2,
    source: 'Government Grant',
    amount: 25000.00,
    income_date: '2024-01-16',
    staff_id: 2
  },
  {
    id: '3',
    income_id: 3,
    source: 'Private Donation',
    amount: 5000.00,
    income_date: '2024-01-17',
    staff_id: 3
  },
  {
    id: '4',
    income_id: 4,
    source: 'Equipment Rental',
    amount: 3500.00,
    income_date: '2024-01-18',
    staff_id: 4
  },
  {
    id: '5',
    income_id: 5,
    source: 'Consultation Fee',
    amount: 800.00,
    income_date: '2024-01-19',
    staff_id: 1,
    patient_id: 2
  },
  {
    id: '6',
    income_id: 6,
    source: 'Training Workshop',
    amount: 2200.00,
    income_date: '2024-01-20',
    staff_id: 2
  },
  {
    id: '7',
    income_id: 7,
    source: 'Medical Report Fee',
    amount: 150.00,
    income_date: '2024-01-21',
    staff_id: 3,
    patient_id: 3
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const otherIncomeService = {
  getAll: async (): Promise<{ data: OtherIncome[] }> => {
    try {
      await delay(500);
      return { data: mockOtherIncomes };
    } catch (error) {
      console.error('Error fetching other incomes:', error);
      throw new Error('Failed to fetch other incomes');
    }
  },

  getById: async (id: string): Promise<{ data: OtherIncome }> => {
    try {
      await delay(300);
      const income = mockOtherIncomes.find(i => i.id === id);
      if (!income) {
        throw new Error('Other income not found');
      }
      return { data: income };
    } catch (error) {
      console.error('Error fetching other income:', error);
      throw error;
    }
  },

  getBySource: async (source: string): Promise<{ data: OtherIncome[] }> => {
    try {
      await delay(400);
      const incomes = mockOtherIncomes.filter(i => i.source.toLowerCase().includes(source.toLowerCase()));
      return { data: incomes };
    } catch (error) {
      console.error('Error fetching incomes by source:', error);
      throw new Error('Failed to fetch incomes by source');
    }
  },

  getByStaffId: async (staffId: number): Promise<{ data: OtherIncome[] }> => {
    try {
      await delay(400);
      const incomes = mockOtherIncomes.filter(i => i.staff_id === staffId);
      return { data: incomes };
    } catch (error) {
      console.error('Error fetching incomes by staff:', error);
      throw new Error('Failed to fetch incomes by staff');
    }
  },

  getByPatientId: async (patientId: number): Promise<{ data: OtherIncome[] }> => {
    try {
      await delay(400);
      const incomes = mockOtherIncomes.filter(i => i.patient_id === patientId);
      return { data: incomes };
    } catch (error) {
      console.error('Error fetching incomes by patient:', error);
      throw new Error('Failed to fetch incomes by patient');
    }
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<{ data: OtherIncome[] }> => {
    try {
      await delay(400);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const incomes = mockOtherIncomes.filter(i => {
        const incomeDate = new Date(i.income_date);
        return incomeDate >= start && incomeDate <= end;
      });
      return { data: incomes };
    } catch (error) {
      console.error('Error fetching incomes by date range:', error);
      throw new Error('Failed to fetch incomes for date range');
    }
  },

  getByAmountRange: async (minAmount: number, maxAmount: number): Promise<{ data: OtherIncome[] }> => {
    try {
      await delay(400);
      const incomes = mockOtherIncomes.filter(i => i.amount >= minAmount && i.amount <= maxAmount);
      return { data: incomes };
    } catch (error) {
      console.error('Error fetching incomes by amount range:', error);
      throw new Error('Failed to fetch incomes for amount range');
    }
  },

  create: async (incomeData: CreateOtherIncomeData): Promise<{ data: OtherIncome }> => {
    try {
      await delay(800);
      const newIncome: OtherIncome = {
        ...incomeData,
        id: Date.now().toString(),
        income_id: mockOtherIncomes.length + 1,
      };
      mockOtherIncomes.push(newIncome);
      return { data: newIncome };
    } catch (error) {
      console.error('Error creating other income:', error);
      throw new Error('Failed to create other income');
    }
  },

  update: async (id: string, incomeData: UpdateOtherIncomeData): Promise<{ data: OtherIncome }> => {
    try {
      await delay(800);
      const index = mockOtherIncomes.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Other income not found');
      }
      mockOtherIncomes[index] = { ...mockOtherIncomes[index], ...incomeData };
      return { data: mockOtherIncomes[index] };
    } catch (error) {
      console.error('Error updating other income:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await delay(500);
      const index = mockOtherIncomes.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Other income not found');
      }
      mockOtherIncomes.splice(index, 1);
    } catch (error) {
      console.error('Error deleting other income:', error);
      throw error;
    }
  },

  getTotalIncomesBySource: async (): Promise<{ data: { source: string; total: number }[] }> => {
    try {
      await delay(300);
      const sourceTotals = mockOtherIncomes.reduce((acc, income) => {
        const existing = acc.find(item => item.source === income.source);
        if (existing) {
          existing.total += income.amount;
        } else {
          acc.push({ source: income.source, total: income.amount });
        }
        return acc;
      }, [] as { source: string; total: number }[]);
      return { data: sourceTotals };
    } catch (error) {
      console.error('Error calculating source totals:', error);
      throw new Error('Failed to calculate source totals');
    }
  },

  getTotalIncomesByMonth: async (year: number): Promise<{ data: { month: string; total: number }[] }> => {
    try {
      await delay(300);
      const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'long' }),
        total: 0
      }));

      mockOtherIncomes.forEach(income => {
        const incomeDate = new Date(income.income_date);
        if (incomeDate.getFullYear() === year) {
          const monthIndex = incomeDate.getMonth();
          monthlyTotals[monthIndex].total += income.amount;
        }
      });

      return { data: monthlyTotals };
    } catch (error) {
      console.error('Error calculating monthly totals:', error);
      throw new Error('Failed to calculate monthly totals');
    }
  },

  getPatientRelatedIncomes: async (): Promise<{ data: OtherIncome[] }> => {
    try {
      await delay(400);
      const patientIncomes = mockOtherIncomes.filter(i => i.patient_id !== undefined);
      return { data: patientIncomes };
    } catch (error) {
      console.error('Error fetching patient-related incomes:', error);
      throw new Error('Failed to fetch patient-related incomes');
    }
  }
};

export default otherIncomeService;