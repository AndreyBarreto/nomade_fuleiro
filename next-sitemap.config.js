/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://deyzito.com',
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
}
