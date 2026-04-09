import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Minimal Student Store
 * Only retains the selectedClass, removing all interactive learning logic (XP, Mastery, etc.)
 */
const useStudentStore = create(
  persist(
    (set) => ({
      selectedClass: null,
      xp: 0,
      streak: 0,
      badges: 0,
      masteredTopicsCount: 0,
      completedTopicIds: [], // array of IDs for topics marked as finished
      topicProgress: {}, // map of topicId -> percentage progress
      
      // Setters
      setClass: (classLevel) => set({ selectedClass: classLevel }),
      
      addXP: (amount) => set((state) => ({ xp: (state.xp || 0) + amount })),
      
      completeTopic: (topicId) => set((state) => {
        const completedIds = state.completedTopicIds || [];
        if (!completedIds.includes(topicId)) {
          return { 
            completedTopicIds: [...completedIds, topicId],
            masteredTopicsCount: (state.masteredTopicsCount || 0) + 1
          }
        }
        return state;
      }),

      setTopicProgress: (topicId, progress) => set((state) => ({
        topicProgress: { ...state.topicProgress, [topicId]: progress }
      })),

      resetStudentData: () => {
        set({ 
          selectedClass: null, 
          xp: 0, 
          streak: 0, 
          badges: 0, 
          masteredTopicsCount: 0, 
          completedTopicIds: [],
          topicProgress: {}
        });
      }
    }),
    {
      name: 'student-progress-storage',
    }
  )
)

export default useStudentStore;
