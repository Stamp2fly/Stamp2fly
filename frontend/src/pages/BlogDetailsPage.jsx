import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPublishedBlogBySlug } from '@/api/blogApi';
import { ArrowLeft } from 'lucide-react';

const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getPublishedBlogBySlug(slug);
        setBlog(data);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{blog?.title ? `${blog.title} | Stamp2Fly Blog` : 'Blog | Stamp2Fly'}</title>
        <meta name="description" content={blog?.excerpt || 'Read latest visa tips and travel insights from Stamp2Fly.'} />
        {blog && <link rel="canonical" href={`https://www.stamp2fly.com/blogs/${slug}`} />}
        {blog && <meta property="og:title" content={`${blog.title} | Stamp2Fly Blog`} />}
        {blog && <meta property="og:description" content={blog.excerpt || 'Read the full article on Stamp2Fly.'} />}
        {blog && <meta property="og:type" content="article" />}
        {blog && <meta property="og:url" content={`https://www.stamp2fly.com/blogs/${slug}`} />}
        {blog?.coverImage && <meta property="og:image" content={blog.coverImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        {blog && <meta name="twitter:title" content={`${blog.title} | Stamp2Fly Blog`} />}
        {blog && <meta name="twitter:description" content={blog.excerpt || 'Read the full article on Stamp2Fly.'} />}
        {blog?.coverImage && <meta name="twitter:image" content={blog.coverImage} />}
        {blog && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: blog.title,
            description: blog.excerpt,
            ...(blog.coverImage && { image: blog.coverImage }),
            datePublished: blog.publishedAt,
            author: {
              "@type": "Person",
              name: blog.authorName || "Stamp2Fly Team",
            },
            publisher: {
              "@type": "Organization",
              name: "Stamp2Fly",
              logo: {
                "@type": "ImageObject",
                url: "https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/d29307835e7b5249a2e33659a636a269.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.stamp2fly.com/blogs/${slug}`,
            },
          })}</script>
        )}
      </Helmet>

      <Header />
      <main className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blogs" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to blogs
          </Link>

          {loading ? (
            <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
          ) : !blog ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              Blog not found.
            </div>
          ) : (
            <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={blog.coverImage || fallbackImage}
                alt={blog.title}
                className="h-72 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = fallbackImage;
                }}
              />
              <div className="p-8">
                <p className="text-xs text-slate-500 mb-3">
                  {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : ''}
                  {blog.authorName ? ` · ${blog.authorName}` : ''}
                </p>
                <h1 className="text-3xl font-bold text-slate-900">{blog.title}</h1>
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">#{tag}</span>
                    ))}
                  </div>
                )}
                <div
                  className="prose max-w-none mt-6 text-slate-700 prose-headings:text-slate-900 prose-img:rounded-2xl prose-img:shadow-sm"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(blog.content || ''),
                  }}
                />
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogDetailsPage;
