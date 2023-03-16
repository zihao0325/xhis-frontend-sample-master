import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'en-US',
  title: 'AICS xHIS',
  description: 'AICS xHIS UI & Widget Tutorial',
  themeConfig: {
    sidebar: {
      '/tutorial/': [
        {
          text: 'xHIS Widget Tutorial',
          items: [
            { text: 'Outline', link: '/tutorial/index.md' },
            { text: 'Prerequisite', link: '/tutorial/prerequisite.md' },
            { text: 'Environment Setup', link: '/tutorial/tutorial-1.md' },
            { text: 'Basic xUI components', link: '/tutorial/tutorial-2.md' },
            { text: 'Advanced xUI components', link: '/tutorial/tutorial-3.md' },
            { text: 'Widget and Layout', link: '/tutorial/tutorial-4.md' },
            { text: 'Rule Engine', link: '/tutorial/tutorial-5.md' },
            { text: 'Form Builder', link: '/tutorial/tutorial-6.md' },
            { text: 'Final Project', link: '/tutorial/tutorial-7.md' },
          ],
        },
      ],
      'zh/tutorial/': [
        {
          text: 'xHIS Widget 教學',
          items: [
            { text: 'Outline', link: '/zh/tutorial/index.md' },
            { text: 'Prerequisite', link: '/zh/tutorial/prerequisite.md' },
            { text: 'Environment Setup', link: '/zh/tutorial/tutorial-1.md' },
            { text: 'Basic xUI components', link: '/zh/tutorial/tutorial-2.md' },
            { text: 'Advanced xUI components', link: '/zh/tutorial/tutorial-3.md' },
            { text: 'Widget and Layout', link: '/zh/tutorial/tutorial-4.md' },
            { text: 'Rule Engine', link: '/zh/tutorial/tutorial-5.md' },
            { text: 'Form Builder', link: '/zh/tutorial/tutorial-6.md' },
            { text: 'Final Project', link: '/zh/tutorial/tutorial-7.md' },
          ],
        },
      ],
    },
    outline: [2, 3],
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    zh: {
      label: '繁體中文',
      lang: 'zh-Hant',
    },
  },
});
