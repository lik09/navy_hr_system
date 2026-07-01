import { create } from 'zustand';

const useProgressStore = create((set) => ({
  active: false,
  progress: 0,

  start: () => set({ active: true, progress: 0 }),

  update: (percent) => set({ progress: Math.min(percent, 99) }), // ដល់ 99% រហូតដល់ finish()

  finish: () =>
    set((state) => {
      // សម្រេចទៅ 100% មុនលាក់ ដើម្បីឲ្យអ្នកប្រើមើលឃើញថាចប់ពិតប្រាកដ
      setTimeout(() => useProgressStore.setState({ active: false, progress: 0 }), 400);
      return { progress: 100 };
    }),

  fail: () => set({ active: false, progress: 0 }),
}));

export default useProgressStore;