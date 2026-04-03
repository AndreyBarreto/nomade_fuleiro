/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://deyzito.com',
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
}
