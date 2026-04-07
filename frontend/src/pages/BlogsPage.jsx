import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPublishedBlogs } from '@/api/blogApi';

const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

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
        <title>Blog - Stamp2Fly</title>
        <meta name="description" content="Read latest travel and visa insights from Stamp2Fly." />
      </Helmet>

      <Header />
      <main className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Stamp2Fly Blog</h1>
          <p className="text-slate-600 mb-8">Visa tips, country updates, and travel guidance from our team.</p>

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
                <article key={blog._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                  <img
                    src={blog.coverImage || fallbackImage}
                    alt={blog.title}
                    className="h-44 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                  <div className="p-5">
                    <p className="text-xs text-slate-500 mb-2">
                      {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Published'}
                    </p>
                    <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">{blog.title}</h2>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3">{blog.excerpt || 'Read full article for more insights.'}</p>
                    <Link to={`/blogs/${blog.slug}`} className="inline-flex mt-4 text-sm font-medium text-blue-700 hover:text-blue-800">
                      Read article
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
