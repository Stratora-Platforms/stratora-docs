// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Stratora Docs',
  tagline: 'Operator-first infrastructure monitoring for IT/OT environments',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://docs.stratora.io',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'Stratora-Platforms',
  projectName: 'stratora-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/Stratora-Platforms/stratora-docs/edit/main/',
        },
        blog: {
          blogTitle: 'Release Notes',
          blogDescription: 'Stratora release notes and announcements',
          blogSidebarTitle: 'Recent Releases',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/Stratora-Platforms/stratora-docs/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/stratora-logo-transparent.png',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Stratora Docs',
        logo: {
          alt: 'Stratora Logo',
          src: 'img/favicon.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Release Notes', position: 'left'},
          {
            href: 'https://github.com/Stratora-Platforms/stratora-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Release Notes',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Stratora-Platforms/stratora-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Stratora. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
