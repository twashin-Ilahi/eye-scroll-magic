import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

interface DownloadStats {
  total: number;
  mac: number;
  windows: number;
}

export const useDownloadStats = () => {
  return useQuery<DownloadStats>({
    queryKey: ["download-stats"],
    queryFn: async () => {
      const downloadsRef = collection(db, "downloads");
      const snapshot = await getDocs(downloadsRef);
      
      const docs = snapshot.docs.map(doc => doc.data());
      
      const stats = {
        total: docs.length,
        mac: docs.filter((d) => d.platform === "mac").length,
        windows: docs.filter((d) => d.platform === "windows").length,
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
      const downloadsRef = collection(db, "downloads");
      await addDoc(downloadsRef, {
        platform,
        downloaded_at: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["download-stats"] });
    },
  });
};
