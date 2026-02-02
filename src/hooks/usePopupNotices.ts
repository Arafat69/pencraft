import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PopupNotice {
  id: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  link_url: string | null;
  display_type: "text" | "image" | "both";
  is_active: boolean;
  button_text: string | null;
  created_at: string;
  updated_at: string;
}

export function usePopupNotices() {
  return useQuery({
    queryKey: ["popup-notices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popup_notices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PopupNotice[];
    },
  });
}

export function useActivePopupNotice() {
  return useQuery({
    queryKey: ["active-popup-notice"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popup_notices")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as PopupNotice | null;
    },
  });
}

export function useCreatePopupNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notice: Omit<PopupNotice, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("popup_notices")
        .insert(notice)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup-notices"] });
      queryClient.invalidateQueries({ queryKey: ["active-popup-notice"] });
    },
  });
}

export function useUpdatePopupNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PopupNotice> & { id: string }) => {
      const { data, error } = await supabase
        .from("popup_notices")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup-notices"] });
      queryClient.invalidateQueries({ queryKey: ["active-popup-notice"] });
    },
  });
}

export function useDeletePopupNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("popup_notices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup-notices"] });
      queryClient.invalidateQueries({ queryKey: ["active-popup-notice"] });
    },
  });
}
