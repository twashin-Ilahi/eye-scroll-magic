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

      if (error) {
        console.error("Error fetching download stats:", error);
        return { total: 0, mac: 0, windows: 0 };
      }

      const stats = {
        total: data.length,
        mac: data.filter((d) => d.platform === "mac").length,
        windows: data.filter((d) => d.platform === "windows").length,
      };

      return stats;
    },
    staleTime: 30000,
  });
};

export const useRecordDownload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (platform: "mac" | "windows") => {
      const { error } = await supabase
        .from("downloads")
        .insert({ platform });

      if (error) {
        console.error("Error recording download:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["download-stats"] });
    },
  });
};
