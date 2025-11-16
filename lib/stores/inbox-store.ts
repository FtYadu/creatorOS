import { create } from 'zustand';
import { Inquiry, ParsedData } from '@/types';
import { mockInquiries } from '@/lib/utils/mock-data';
import { parseInquiry, calculateLeadScore, generateBrief } from '@/lib/utils/parser';

interface InboxState {
  inquiries: Inquiry[];
  currentParsedData: ParsedData | null;
  currentLeadScore: number | null;
  currentBrief: string | null;
  isLoading: boolean;
  setInquiries: (inquiries: Inquiry[]) => void;
  addInquiry: (inquiry: Inquiry) => void;
  parseEmail: (emailText: string) => void;
  generateClientBrief: () => void;
  clearCurrent: () => void;
  setLoading: (loading: boolean) => void;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  inquiries: mockInquiries,
  currentParsedData: null,
  currentLeadScore: null,
  currentBrief: null,
  isLoading: false,

  setInquiries: (inquiries) => set({ inquiries }),

  addInquiry: (inquiry) => set((state) => ({
    inquiries: [inquiry, ...state.inquiries]
  })),

  parseEmail: (emailText: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      const parsedData = parseInquiry(emailText);
      const scoreBreakdown = calculateLeadScore(parsedData);

      set({
        currentParsedData: parsedData,
        currentLeadScore: scoreBreakdown.total,
        isLoading: false
      });
    }, 800);
  },

  generateClientBrief: () => {
    const { currentParsedData } = get();
    if (currentParsedData) {
      const brief = generateBrief(currentParsedData);
      set({ currentBrief: brief });
    }
  },

  clearCurrent: () => set({
    currentParsedData: null,
    currentLeadScore: null,
    currentBrief: null
  }),

  setLoading: (loading) => set({ isLoading: loading })
}));
