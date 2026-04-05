import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { CommunicationClientsHeader } from './components/CommunicationClientsHeader';
import { CommunicationClientsFilters } from './components/CommunicationClientsFilters';
import { KanbanBoardClient } from './components/KanbanBoardClient';
import { CalendarViewClient } from './components/CalendarViewClient';
import { CalendarPostDrawerClient } from './components/CalendarPostDrawerClient';
import { DashboardViewClient } from './components/DashboardViewClient';
import { PostDetailClient } from './components/PostDetailClient';
import { PostFormClient } from './components/PostFormClient';
import type { CommunicationClientsData } from './hooks/useCommunicationClientsData';
import type { ViewMode, PostFormData, PostRow } from './types';
import type { PostType, PostPlatform, PostStatus } from '../../types/supabase-types';
import type { SortOrder } from './hooks/useCommunicationClientsFilters';

interface CommunicationClientsPageProps {
  data: CommunicationClientsData;
  filteredPosts: PostRow[];
  typeFilter: PostType | 'all';
  platformFilter: PostPlatform | 'all';
  responsibleFilter: string;
  statusFilter: PostStatus | 'all';
  searchQuery: string;
  sortOrder: SortOrder;
  setTypeFilter: (v: PostType | 'all') => void;
  setPlatformFilter: (v: PostPlatform | 'all') => void;
  setResponsibleFilter: (v: string) => void;
  setStatusFilter: (v: PostStatus | 'all') => void;
  setSearchQuery: (v: string) => void;
  setSortOrder: (v: SortOrder) => void;
  resetFilters: () => void;
}

export function CommunicationClientsPage({
  data, filteredPosts,
  typeFilter, platformFilter, responsibleFilter, statusFilter, searchQuery, sortOrder,
  setTypeFilter, setPlatformFilter, setResponsibleFilter, setStatusFilter, setSearchQuery, setSortOrder, resetFilters,
}: CommunicationClientsPageProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('kanban');
  const [selectedPost, setSelectedPost] = useState<PostRow | null>(null);
  const [drawerPost, setDrawerPost] = useState<PostRow | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<PostRow | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>('');

  const isMobile = useIsMobile();
  const hasActiveFilters = typeFilter !== 'all' || platformFilter !== 'all' || responsibleFilter !== 'all' || statusFilter !== 'all' || searchQuery !== '' || sortOrder !== 'newest';

  const handleCreatePost = async (formData: PostFormData) => {
    const currentDbUser = data.currentUser?.email
      ? data.users.find(u => u.email === data.currentUser!.email)
      : null;

    const result = await data.createPost({
      title: formData.title, type: formData.type, platform: formData.platform,
      status: formData.status || 'idea',
      strategic_angle: formData.strategic_angle || null, hook: formData.hook || null,
      content: formData.content || null, objective: formData.objective || null,
      scheduled_at: formData.scheduled_at || null,
      responsible_user_id: formData.responsible_user_id || currentDbUser?.id || null,
      client_id: formData.client_id || null,
    });
    if (result.success) { setShowPostForm(false); setDefaultDate(''); data.refetchPosts(); }
  };

  const handleUpdatePost = async (formData: PostFormData) => {
    if (!editingPost) return;
    const result = await data.updatePost(editingPost.id, {
      title: formData.title, type: formData.type, platform: formData.platform,
      strategic_angle: formData.strategic_angle || null, hook: formData.hook || null,
      content: formData.content || null, objective: formData.objective || null,
      scheduled_at: formData.scheduled_at || null,
      responsible_user_id: formData.responsible_user_id || null, client_id: formData.client_id || null,
    });
    if (result.success) { setEditingPost(null); data.refetchPosts(); }
  };

  const handleDeletePost = async (id: string) => {
    const result = await data.deletePost(id);
    if (result.success) { setSelectedPost(null); setDrawerPost(null); data.refetchPosts(); }
  };

  const handleUpdateSchedule = async (postId: string, newDate: string) => {
    const result = await data.updatePost(postId, { scheduled_at: newDate });
    if (result.success) data.refetchPosts();
  };

  if (selectedPost) {
    const currentPost = data.posts.find(p => p.id === selectedPost.id) || selectedPost;
    return (
      <div className="min-h-screen">
        <PostDetailClient post={currentPost} data={data} onBack={() => setSelectedPost(null)} onEdit={(post) => { setSelectedPost(null); setEditingPost(post); }} onDelete={handleDeletePost} />
      </div>
    );
  }

  const usersList = data.users.map(u => ({ id: u.id, name: u.name }));

  return (
    <div className="p-3 md:p-6 space-y-3 md:space-y-4 min-h-screen pb-24 md:pb-6">
      <div className="sticky top-0 z-10 -mx-3 px-3 md:-mx-6 md:px-6 pt-1 pb-3 bg-surface-1/95 backdrop-blur-sm space-y-2 md:space-y-3">
        <CommunicationClientsHeader currentView={currentView} onViewChange={setCurrentView} onNewPost={() => setShowPostForm(true)} postCount={data.posts.length} isMobile={isMobile} />
        <CommunicationClientsFilters
          typeFilter={typeFilter} platformFilter={platformFilter} responsibleFilter={responsibleFilter} statusFilter={statusFilter} searchQuery={searchQuery} sortOrder={sortOrder}
          users={usersList}
          onTypeChange={setTypeFilter} onPlatformChange={setPlatformFilter} onResponsibleChange={setResponsibleFilter} onStatusChange={setStatusFilter} onSearchChange={setSearchQuery} onSortChange={setSortOrder}
          onReset={resetFilters} hasActiveFilters={hasActiveFilters}
        />
      </div>

      {currentView === 'kanban' && (
        <KanbanBoardClient posts={filteredPosts} onRefresh={data.refetchPosts} onViewPost={setSelectedPost} onEditPost={(post) => setEditingPost(post)} onDeletePost={(post) => { if (confirm('Supprimer ce post ?')) handleDeletePost(post.id); }} />
      )}
      {currentView === 'calendar' && (
        <CalendarViewClient
          posts={filteredPosts}
          users={usersList}
          onPostClick={setDrawerPost}
          onDateClick={(dateStr) => {
            setDefaultDate(dateStr + 'T09:00');
            setShowPostForm(true);
          }}
          onUpdateSchedule={handleUpdateSchedule}
        />
      )}
      {currentView === 'dashboard' && <DashboardViewClient posts={filteredPosts} onPostClick={setSelectedPost} />}

      <CalendarPostDrawerClient
        post={drawerPost}
        users={usersList}
        onClose={() => setDrawerPost(null)}
        onViewFull={(post) => { setDrawerPost(null); setSelectedPost(post); }}
        onEdit={(post) => { setDrawerPost(null); setEditingPost(post); }}
        onDelete={handleDeletePost}
      />

      {(showPostForm || editingPost) && (
        <PostFormClient
          post={editingPost}
          defaultDate={!editingPost ? defaultDate : undefined}
          users={usersList}
          clients={data.contacts.map(c => ({ id: c.id, name: c.name, company: c.company }))}
          onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
          onCancel={() => { setShowPostForm(false); setEditingPost(null); setDefaultDate(''); }}
          loading={data.crudLoading}
        />
      )}

      {isMobile && (
        <button onClick={() => setShowPostForm(true)} className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
