"use client";
// Image field for the admin forms. Accepts a pasted URL or a local file
// (encoded as a data URL for the MVP). In production this would upload to
// object storage (e.g. Cloudflare R2 / S3) and store the returned URL.
import { useRef, useState } from "react";
import { ImagePlus, Link2, Upload, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const ImageInput = ({ value, onChange, label = "Image" }: Props) => {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
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
            onClick={() => fileRef.current?.click()}
            className="w-full h-36 border-2 border-dashed border-border/60 rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors mb-2"
          >
            <ImagePlus size={22} />
            <span className="text-xs">Click to upload</span>
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
            if (file) handleFile(file);
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
