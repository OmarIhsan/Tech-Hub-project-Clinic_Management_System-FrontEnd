import { Expense } from '../types';

interface CreateExpenseData {
  category: string;
  amount: number;
  expense_date: string;
  reason?: string;
  staff_id: number;
}

interface UpdateExpenseData {
  category?: string;
  amount?: number;
  expense_date?: string;
  reason?: string;
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    expense_id: 1,
    category: 'Medical Supplies',
    amount: 2500.00,
    expense_date: '2024-01-15',
    reason: 'Surgical instruments and disposables',
    staff_id: 1
  },
  {
    id: '2',
    expense_id: 2,
    category: 'Equipment Maintenance',
    amount: 1800.00,
    expense_date: '2024-01-16',
    reason: 'Annual maintenance of MRI machine',
    staff_id: 2
  },
  {
    id: '3',
    expense_id: 3,
    category: 'Office Supplies',
    amount: 450.00,
    expense_date: '2024-01-17',
    reason: 'Paper, pens, and administrative materials',
    staff_id: 3
  },
  {
    id: '4',
    expense_id: 4,
    category: 'Utilities',
    amount: 3200.00,
    expense_date: '2024-01-18',
    reason: 'Monthly electricity and water bills',
    staff_id: 4
  },
  {
    id: '5',
    expense_id: 5,
    category: 'Staff Training',
    amount: 1200.00,
    expense_date: '2024-01-19',
    reason: 'CPR and emergency response training',
    staff_id: 1
  },
  {
    id: '6',
    expense_id: 6,
    category: 'Medications',
    amount: 5600.00,
    expense_date: '2024-01-20',
    reason: 'Monthly pharmaceutical inventory',
    staff_id: 2
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseService = {
  getAll: async (): Promise<{ data: Expense[] }> => {
    try {
      await delay(500);
      return { data: mockExpenses };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw new Error('Failed to fetch expenses');
    }
  },

  getById: async (id: string): Promise<{ data: Expense }> => {
    try {
      await delay(300);
      const expense = mockExpenses.find(e => e.id === id);
      if (!expense) {
        throw new Error('Expense not found');
      }
      return { data: expense };
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  },

  getByCategory: async (category: string): Promise<{ data: Expense[] }> => {
    try {
      await delay(400);
      const expenses = mockExpenses.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
      return { data: expenses };
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw new Error('Failed to fetch expenses by category');
    }
  },

  getByStaffId: async (staffId: number): Promise<{ data: Expense[] }> => {
    try {
      await delay(400);
      const expenses = mockExpenses.filter(e => e.staff_id === staffId);
      return { data: expenses };
    } catch (error) {
      console.error('Error fetching expenses by staff:', error);
      throw new Error('Failed to fetch expenses by staff');
    }
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<{ data: Expense[] }> => {
    try {
      await delay(400);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const expenses = mockExpenses.filter(e => {
        const expenseDate = new Date(e.expense_date);
        return expenseDate >= start && expenseDate <= end;
      });
      return { data: expenses };
    } catch (error) {
      console.error('Error fetching expenses by date range:', error);
      throw new Error('Failed to fetch expenses for date range');
    }
  },

  getByAmountRange: async (minAmount: number, maxAmount: number): Promise<{ data: Expense[] }> => {
    try {
      await delay(400);
      const expenses = mockExpenses.filter(e => e.amount >= minAmount && e.amount <= maxAmount);
      return { data: expenses };
    } catch (error) {
      console.error('Error fetching expenses by amount range:', error);
      throw new Error('Failed to fetch expenses for amount range');
    }
  },

  create: async (expenseData: CreateExpenseData): Promise<{ data: Expense }> => {
    try {
      await delay(800);
      const newExpense: Expense = {
        ...expenseData,
        id: Date.now().toString(),
        expense_id: mockExpenses.length + 1,
      };
      mockExpenses.push(newExpense);
      return { data: newExpense };
    } catch (error) {
      console.error('Error creating expense:', error);
      throw new Error('Failed to create expense');
    }
  },

  update: async (id: string, expenseData: UpdateExpenseData): Promise<{ data: Expense }> => {
    try {
      await delay(800);
      const index = mockExpenses.findIndex(e => e.id === id);
      if (index === -1) {
        throw new Error('Expense not found');
      }
      mockExpenses[index] = { ...mockExpenses[index], ...expenseData };
      return { data: mockExpenses[index] };
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await delay(500);
      const index = mockExpenses.findIndex(e => e.id === id);
      if (index === -1) {
        throw new Error('Expense not found');
      }
      mockExpenses.splice(index, 1);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  getTotalExpensesByCategory: async (): Promise<{ data: { category: string; total: number }[] }> => {
    try {
      await delay(300);
      const categoryTotals = mockExpenses.reduce((acc, expense) => {
        const existing = acc.find(item => item.category === expense.category);
        if (existing) {
          existing.total += expense.amount;
        } else {
          acc.push({ category: expense.category, total: expense.amount });
        }
        return acc;
      }, [] as { category: string; total: number }[]);
      return { data: categoryTotals };
    } catch (error) {
      console.error('Error calculating category totals:', error);
      throw new Error('Failed to calculate category totals');
    }
  },

  getTotalExpensesByMonth: async (year: number): Promise<{ data: { month: string; total: number }[] }> => {
    try {
      await delay(300);
      const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'long' }),
        total: 0
      }));

      mockExpenses.forEach(expense => {
        const expenseDate = new Date(expense.expense_date);
        if (expenseDate.getFullYear() === year) {
          const monthIndex = expenseDate.getMonth();
          monthlyTotals[monthIndex].total += expense.amount;
        }
      });

      return { data: monthlyTotals };
    } catch (error) {
      console.error('Error calculating monthly totals:', error);
      throw new Error('Failed to calculate monthly totals');
    }
  }
};

export default expenseService;