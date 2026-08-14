import React from 'react';

const Sitemap = () => {
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scentifypurfume.com/</loc>
    <lastmod>2026-08-14</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.scentifypurfume.com/products</loc>
    <lastmod>2026-08-14</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.scentifypurfume.com/about</loc>
    <lastmod>2026-08-14</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.scentifypurfume.com/contact</loc>
    <lastmod>2026-08-14</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.scentifypurfume.com/wishlist</loc>
    <lastmod>2026-08-14</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.scentifypurfume.com/cart</loc>
    <lastmod>2026-08-14</lastmod>
    <priority>0.7</priority>
  </url>
</urlset>`;

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sitemapXML }} 
      style={{ 
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        padding: '20px'
      }}
    />
  );
};

export default Sitemap;