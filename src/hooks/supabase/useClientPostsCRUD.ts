import { useState } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type {
  ClientPostRow, ClientPostInsert, ClientPostUpdate,
  ClientPostAssetRow, ClientPostCommentRow,
  CRUDResult
} from '../../types/supabase-types';

// Hook CRUD pour les posts clients
export function useClientPostsCRUD() {
  const [loading, setLoading] = useState(false);

  const createPost = async (postData: ClientPostInsert): Promise<CRUDResult<ClientPostRow>> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;
      toast.success('Post client créé avec succès');
      return { success: true, data: data as ClientPostRow };
    } catch (error) {
      const err = error as Error;
      logger.error('Error creating client post:', err);
      toast.error('Erreur lors de la création du post client');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, updates: ClientPostUpdate): Promise<CRUDResult<ClientPostRow>> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Post client mis à jour');
      return { success: true, data: data as ClientPostRow };
    } catch (error) {
      const err = error as Error;
      logger.error('Error updating client post:', err);
      toast.error('Erreur lors de la mise à jour');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string): Promise<CRUDResult<void>> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('client_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Post client supprimé');
      return { success: true };
    } catch (error) {
      const err = error as Error;
      logger.error('Error deleting client post:', err);
      toast.error('Erreur lors de la suppression');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId: string, authorId: string, comment: string): Promise<CRUDResult<ClientPostCommentRow>> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_post_comments')
        .insert([{ post_id: postId, author_id: authorId, comment }])
        .select('*, users(name, email)')
        .single();

      if (error) throw error;
      toast.success('Commentaire ajouté');
      return { success: true, data: data as ClientPostCommentRow };
    } catch (error) {
      const err = error as Error;
      logger.error('Error adding comment:', err);
      toast.error("Erreur lors de l'ajout du commentaire");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id: string): Promise<CRUDResult<void>> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('client_post_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      const err = error as Error;
      logger.error('Error deleting comment:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const uploadAsset = async (
    postId: string,
    file: File,
    assetType: 'image' | 'video' | 'document'
  ): Promise<CRUDResult<ClientPostAssetRow>> => {
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${postId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('client-post-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('client-post-assets')
        .getPublicUrl(filePath);

      const { data, error } = await supabase
        .from('client_post_assets')
        .insert([{
          post_id: postId,
          asset_url: urlData.publicUrl,
          storage_path: filePath,
          asset_type: assetType,
          file_name: file.name,
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Fichier uploadé');
      return { success: true, data: data as ClientPostAssetRow };
    } catch (error) {
      const err = error as Error;
      logger.error('Error uploading asset:', err);
      toast.error("Erreur lors de l'upload");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addExternalAsset = async (
    postId: string,
    url: string,
    assetType: 'image' | 'video' | 'document',
    fileName?: string
  ): Promise<CRUDResult<ClientPostAssetRow>> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_post_assets')
        .insert([{
          post_id: postId,
          asset_url: url,
          asset_type: assetType,
          file_name: fileName || url.split('/').pop() || 'Fichier externe',
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Lien ajouté');
      return { success: true, data: data as ClientPostAssetRow };
    } catch (error) {
      const err = error as Error;
      logger.error('Error adding external asset:', err);
      toast.error("Erreur lors de l'ajout du lien");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (id: string, storagePath?: string | null): Promise<CRUDResult<void>> => {
    setLoading(true);
    try {
      if (storagePath) {
        await supabase.storage.from('client-post-assets').remove([storagePath]);
      }

      const { error } = await supabase
        .from('client_post_assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Fichier supprimé');
      return { success: true };
    } catch (error) {
      const err = error as Error;
      logger.error('Error deleting asset:', err);
      toast.error('Erreur lors de la suppression');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createPost, updatePost, deletePost,
    addComment, deleteComment,
    uploadAsset, addExternalAsset, deleteAsset,
    loading
  };
}
