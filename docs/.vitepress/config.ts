export default {
  base: "/qalendar/",
  title: "Qalendar",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide" },
      { text: "Migration guides", link: "/migration" },
      { text: "Roadmap", link: "https://github.com/tomosterlund/qalendar/projects/1" },
      { text: "Github", link: "https://github.com/tomosterlund/qalendar" },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Tom Österlund'
    },
    logo: {
      light: 'https://discover-test-files.s3.eu-central-1.amazonaws.com/Q+MAIN.png',
      dark: 'https://discover-test-files.s3.eu-central-1.amazonaws.com/qalendar-dark-mode.svg'
    },
  },
  // appearance: false,
};
