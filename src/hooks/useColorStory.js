// useColorStory.js — Manages active color story + injects CSS vars

import { useState, useCallback } from 'react';
import { COLOR_STORIES, DEFAULT_STORY } from '../data/colorStories';

export function useColorStory() {
  const [activeStory, setActiveStory] = useState(DEFAULT_STORY);

  const setStory = useCallback((storyId) => {
    const story = COLOR_STORIES.find(s => s.id === storyId) || DEFAULT_STORY;
    setActiveStory(story);

    // Inject CSS custom properties so all UI updates automatically
    const root = document.documentElement;
    root.style.setProperty('--story-primary',   story.primary);
    root.style.setProperty('--story-secondary', story.secondary);
    root.style.setProperty('--story-accent',    story.accent);
  }, []);

  return {
    activeStory,
    setStory,
    allStories: COLOR_STORIES,
    defaultColor: activeStory.primary,
  };
}
