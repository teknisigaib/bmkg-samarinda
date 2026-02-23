"use client";

import { useTransition } from "react";
import { Trash, Loader2 } from "lucide-react";
import { globalDelete } from "@/app/(admin)/admin/actions/global-delete"; 

interface ButtonProps {
  id: string;
  model: "post" | "flyer" | "publication" | "pegawai" | "kinerja" | "pdieDocument" | "iklim";
  fileUrl?: string | null;
  bucketName?: string;
  revalidateUrl: string;
  onSuccess?: () => void; 
}

export default function GlobalDeleteButton(props: ButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Yakin ingin menghapus data ini secara permanen beserta filenya?")) {
      startTransition(async () => {
        const res = await globalDelete(props);
        if (res.error) {
          alert(res.error);
        } else {
          // 3. Jika sukses dan ada perintah onSuccess, jalankan!
          if (props.onSuccess) {
            props.onSuccess();
          }
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`p-2 rounded transition-colors ${
        isPending ? "text-gray-400 bg-gray-50 cursor-not-allowed" : "text-red-500 hover:text-red-700 hover:bg-red-50"
      }`}
      title="Hapus Data"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
    </button>
  );
}