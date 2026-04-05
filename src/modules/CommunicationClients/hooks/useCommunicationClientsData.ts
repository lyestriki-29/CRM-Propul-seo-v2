import { useSupabaseClientPosts } from '../../../hooks/supabase';
import { useClientPostsCRUD } from '../../../hooks/supabase';
import { useSupabaseUsers } from '../../../hooks/supabase';
import { useSupabaseContacts } from '../../../hooks/supabase';
import { useStore } from '../../../store';

export function useCommunicationClientsData() {
  const { currentUser } = useStore();
  const { data: posts, loading: postsLoading, error: postsError, refetch: refetchPosts } = useSupabaseClientPosts();
  const {
    createPost, updatePost, deletePost,
    addComment, deleteComment,
    uploadAsset, addExternalAsset, deleteAsset,
    loading: crudLoading
  } = useClientPostsCRUD();
  const { data: users } = useSupabaseUsers();
  const { data: contacts } = useSupabaseContacts();

  return {
    posts,
    postsLoading,
    postsError,
    refetchPosts,
    createPost, updatePost, deletePost,
    addComment, deleteComment,
    uploadAsset, addExternalAsset, deleteAsset,
    crudLoading,
    users,
    contacts,
    currentUser,
  };
}

export type CommunicationClientsData = ReturnType<typeof useCommunicationClientsData>;
