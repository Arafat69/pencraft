import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Notice {
  id: string;
  content: string;
  is_active: boolean;
  display_order: number;
  bg_color: string | null;
  text_color: string | null;
  created_at: string;
  updated_at: string;
}

export function useNotices() {
  return useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Notice[];
    },
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notice: Omit<Notice, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("notices")
        .insert(notice)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast.success("Notice created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create notice: " + error.message);
    },
  });
}

export function useUpdateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Notice> & { id: string }) => {
      const { data, error } = await supabase
        .from("notices")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast.success("Notice updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update notice: " + error.message);
    },
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast.success("Notice deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete notice: " + error.message);
    },
  });
}
