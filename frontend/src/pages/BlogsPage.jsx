import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPublishedBlogs } from '@/api/blogApi';
import { ArrowRight, CalendarDays, User2 } from 'lucide-react';

const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

const getPreviewText = (blog) => {
  const source = blog.excerpt || blog.content || 'Read full article for more insights.';
  const plainText = DOMPurify.sanitize(source, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) {
    return 'Read full article for more insights.';
  }

  return plainText.length > 160 ? `${plainText.slice(0, 157).trim()}...` : plainText;
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getPublishedBlogs();
        setBlogs(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Helmet>
        <title>Visa Tips &amp; Travel Insights Blog | Stamp2Fly</title>
        <meta name="description" content="Explore visa tips, country-specific travel guides, and policy updates from Stamp2Fly's expert team. Stay informed for hassle-free international travel." />
        <link rel="canonical" href="https://www.stamp2fly.com/blogs" />
        <meta property="og:title" content="Visa Tips & Travel Insights Blog | Stamp2Fly" />
        <meta property="og:description" content="Explore visa tips, country-specific travel guides, and policy updates from Stamp2Fly's expert team." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.stamp2fly.com/blogs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Visa Tips & Travel Insights Blog | Stamp2Fly" />
        <meta name="twitter:description" content="Explore visa tips, country-specific travel guides, and policy updates from Stamp2Fly's expert team." />
      </Helmet>

      <Header />
      <main className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 md:p-10 text-white shadow-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Stamp2Fly Journal</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold max-w-3xl">Visa tips, travel guidance, and practical updates in one place.</h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Read short updates or open the full article to see formatted text, headings, and images.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="h-72 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              No blog posts published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <article key={blog._id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={blog.coverImage || fallbackImage}
                      alt={blog.title}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-xs text-white">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Published'}
                      </span>
                      {blog.authorName && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                          <User2 className="h-3.5 w-3.5" />
                          {blog.authorName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-900 line-clamp-2 leading-tight">{blog.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-4">{getPreviewText(blog)}</p>

                    {blog.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-blue-700"
                    >
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogsPage;
