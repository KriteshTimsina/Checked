import { entries as entrySchema, IEntry } from '@/db/schema';
import { getDb } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { create } from 'zustand';

interface EntriesState {
  entries: IEntry[];
  createEntry: (data: Pick<IEntry, 'title' | 'project_id'>) => Promise<boolean>;
  getEntries: (project_id: string) => void;
}

const db = getDb();

const useEntriesStore = create<EntriesState>()(set => ({
  entries: [],
  getEntries: async projectId => {
    const allEntries = await db.query.entries.findMany({
      where: eq(entrySchema.project_id, Number(projectId)),
    });

    set({
      entries: allEntries,
    });
  },
  createEntry: async data => {
    const [newEntry] = await db
      .insert(entrySchema)
      .values({ project_id: data.project_id, title: data.title, createdAt: new Date() })
      .returning({
        id: entrySchema.id,
        title: entrySchema.title,
        createdAt: entrySchema.createdAt,
        completed: entrySchema.completed,
        project_id: entrySchema.project_id,
      });

    if (newEntry) {
      set(state => ({
        entries: [...state.entries, newEntry],
      }));
    }
    return false;
  },
}));

export const useEntries = () => {
  const entries = useEntriesStore(state => state.entries);
  const getEntries = useEntriesStore(state => state.getEntries);
  const createEntry = useEntriesStore(state => state.createEntry);

  return {
    entries,
    getEntries,
    createEntry,
  };
};
