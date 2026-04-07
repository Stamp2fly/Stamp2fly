import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Save, Trash2, Edit, PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBlogPost, deleteBlogPost, getAllBlogsAdmin, updateBlogPost } from '@/api/adminApi';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: '',
  status: 'draft',
};

const BlogManagementView = () => {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const sortedBlogs = useMemo(
    () => [...blogs].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)),
    [blogs]
  );

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllBlogsAdmin();
      setBlogs(data || []);
    } catch (error) {
      toast({
        title: 'Failed to load blogs',
        description: error?.response?.data?.message || 'Could not load blog posts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const selectForEdit = (blog) => {
    setEditingId(blog._id);
    setForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      status: blog.status || 'draft',
    });
  };

  const handleSave = async () => {
    const title = form.title.trim();
    const content = form.content.trim();

    if (!title || !content) {
      toast({
        title: 'Missing required fields',
        description: 'Title and content are required.',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      title,
      excerpt: form.excerpt.trim(),
      content,
      coverImage: form.coverImage.trim(),
      status: form.status,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      setIsSaving(true);
      if (editingId) {
        await updateBlogPost(editingId, payload);
        toast({
          title: 'Blog updated',
          description: 'Changes are now saved.',
          className: 'bg-emerald-600 text-white',
        });
      } else {
        await createBlogPost(payload);
        toast({
          title: 'Blog created',
          description: 'New blog post has been created.',
          className: 'bg-emerald-600 text-white',
        });
      }
      await fetchBlogs();
      resetForm();
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error?.response?.data?.message || 'Could not save blog post.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlogPost(id);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      if (editingId === id) {
        resetForm();
      }
      toast({
        title: 'Blog deleted',
        description: 'The blog post has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error?.response?.data?.message || 'Could not delete this blog.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Blog Management</h1>
        <div className="flex items-center gap-3">
          {editingId && (
            <Button variant="outline" onClick={resetForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Blog
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="bg-slate-800 hover:bg-slate-900 text-white">
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Blog'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <Input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Blog title"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Excerpt</label>
            <Input
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              placeholder="Short summary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Cover Image URL</label>
            <Input
              value={form.coverImage}
              onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tags (comma separated)</label>
            <Input
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              placeholder="visa, travel, checklist"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
            <textarea
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              rows={16}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write blog content here..."
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Existing Blogs</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading blogs...</p>
          ) : sortedBlogs.length === 0 ? (
            <p className="text-sm text-slate-500">No blog posts yet.</p>
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {sortedBlogs.map((blog) => (
                <div key={blog._id} className="rounded-xl border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-2">{blog.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {blog.status === 'published' ? 'Published' : 'Draft'} · {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full ${blog.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {blog.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => selectForEdit(blog)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(blog._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogManagementView;
