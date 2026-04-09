import { describe, it, expect, beforeEach } from 'vitest'
import useStudentStore from './studentStore'

describe('studentStore', () => {
  beforeEach(() => {
    useStudentStore.setState({
      selectedClass: null,
      xp: 0,
      streak: 0,
      badges: 0,
      masteredTopicsCount: 0,
      completedTopicIds: [],
      topicProgress: {},
    })
  })

  describe('initial state', () => {
    it('should start with zero values (no demo data)', () => {
      const state = useStudentStore.getState()
      expect(state.xp).toBe(0)
      expect(state.streak).toBe(0)
      expect(state.badges).toBe(0)
      expect(state.masteredTopicsCount).toBe(0)
    })
  })

  describe('setClass', () => {
    it('should set selected class', () => {
      useStudentStore.getState().setClass(10)
      expect(useStudentStore.getState().selectedClass).toBe(10)
    })
  })

  describe('addXP', () => {
    it('should add XP to current total', () => {
      useStudentStore.getState().addXP(100)
      expect(useStudentStore.getState().xp).toBe(100)

      useStudentStore.getState().addXP(50)
      expect(useStudentStore.getState().xp).toBe(150)
    })
  })

  describe('completeTopic', () => {
    it('should add topic to completed list and increment mastered count', () => {
      useStudentStore.getState().completeTopic('topic-1')

      const state = useStudentStore.getState()
      expect(state.completedTopicIds).toContain('topic-1')
      expect(state.masteredTopicsCount).toBe(1)
    })

    it('should not duplicate completed topics', () => {
      useStudentStore.getState().completeTopic('topic-1')
      useStudentStore.getState().completeTopic('topic-1')

      const state = useStudentStore.getState()
      expect(state.completedTopicIds).toHaveLength(1)
      expect(state.masteredTopicsCount).toBe(1)
    })
  })

  describe('setTopicProgress', () => {
    it('should set progress for a topic', () => {
      useStudentStore.getState().setTopicProgress('topic-1', 75)
      expect(useStudentStore.getState().topicProgress['topic-1']).toBe(75)
    })

    it('should preserve other topic progress', () => {
      useStudentStore.setState({ topicProgress: { 'topic-1': 50 } })
      useStudentStore.getState().setTopicProgress('topic-2', 80)

      expect(useStudentStore.getState().topicProgress).toEqual({
        'topic-1': 50,
        'topic-2': 80,
      })
    })
  })

  describe('resetStudentData', () => {
    it('should reset all student data', () => {
      useStudentStore.setState({
        selectedClass: 10,
        xp: 500,
        streak: 5,
        badges: 3,
        masteredTopicsCount: 10,
        completedTopicIds: ['t1', 't2'],
        topicProgress: { t1: 100 },
      })

      useStudentStore.getState().resetStudentData()

      const state = useStudentStore.getState()
      expect(state.selectedClass).toBeNull()
      expect(state.xp).toBe(0)
      expect(state.streak).toBe(0)
      expect(state.badges).toBe(0)
      expect(state.masteredTopicsCount).toBe(0)
      expect(state.completedTopicIds).toEqual([])
      expect(state.topicProgress).toEqual({})
    })
  })
})
