"use client";
// Image field for the admin forms. Accepts a pasted URL or a local file.
//
// On upload it POSTs the file to /api/upload:
//   - If Vercel Blob is configured, the file is stored in object storage and
//     only the returned CDN URL is saved in Neon (recommended for production).
//   - If Blob is NOT configured (route returns 501), it falls back to inlining
//     the image as a data URL so local dev still works.
import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Upload, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const TOKEN_KEY = "owshie-celeste-admin-token";

const ImageInput = ({ value, onChange, label = "Image" }: Props) => {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: file,
      });

      if (res.ok) {
        const { url } = (await res.json()) as { url: string };
        onChange(url);
        return;
      }

      // 501 = Blob not configured -> fall back to inline data URL.
      const dataUrl = await readAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      const dataUrl = await readAsDataUrl(file);
      onChange(dataUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
        <div className="flex gap-1 bg-muted rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-1 rounded text-[10px] uppercase tracking-wide flex items-center gap-1 ${
              mode === "upload" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Upload size={11} /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-1 rounded text-[10px] uppercase tracking-wide flex items-center gap-1 ${
              mode === "url" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Link2 size={11} /> URL
          </button>
        </div>
      </div>

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-border/50 mb-2">
          <img src={value} alt="preview" className="w-full h-36 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full p-1 text-foreground hover:text-destructive"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        mode === "upload" && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="w-full h-36 border-2 border-dashed border-border/60 rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors mb-2 disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus size={22} />
                <span className="text-xs">Click to upload</span>
              </>
            )}
          </button>
        )
      )}

      {mode === "upload" ? (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      ) : (
        <input
          type="url"
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-muted border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      )}
    </div>
  );
};

export default ImageInput;
