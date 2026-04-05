import { useSupabaseData } from './useSupabaseQuery';
import type { ClientPostRow, ClientPostAssetRow, ClientPostCommentRow } from '../../types/supabase-types';

// Hook pour les posts clients
export function useSupabaseClientPosts() {
  return useSupabaseData<ClientPostRow>({
    table: 'client_posts',
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });
}

// Hook pour les assets d'un post client
export function useSupabaseClientPostAssets(postId?: string) {
  return useSupabaseData<ClientPostAssetRow>({
    table: 'client_post_assets',
    select: '*',
    filters: postId ? { post_id: postId } : {},
    orderBy: { column: 'created_at', ascending: false }
  });
}

// Hook pour les commentaires d'un post client
export function useSupabaseClientPostComments(postId?: string) {
  return useSupabaseData<ClientPostCommentRow>({
    table: 'client_post_comments',
    select: '*, users(name, email)',
    filters: postId ? { post_id: postId } : {},
    orderBy: { column: 'created_at', ascending: true }
  });
}
