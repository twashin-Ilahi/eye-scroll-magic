import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DownloadStats {
  total: number;
  mac: number;
  windows: number;
}

export const useDownloadStats = () => {
  return useQuery<DownloadStats>({
    queryKey: ["download-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloads")
        .select("platform");

      if (error) throw error;

      const stats = {
        total: data?.length ?? 0,
        mac: data?.filter((d) => d.platform === "mac").length ?? 0,
        windows: data?.filter((d) => d.platform === "windows").length ?? 0,
      };

      return stats;
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useRecordDownload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (platform: "mac" | "windows") => {
      const { error } = await supabase
        .from("downloads")
        .insert({ platform });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["download-stats"] });
    },
  });
};
