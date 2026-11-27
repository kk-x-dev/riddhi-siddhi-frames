"use client";

import { CldUploadWidget, getCldImageUrl } from "next-cloudinary";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  showUrl?: boolean;
  buttonClassName?: string;
}

interface UploadResultInfo {
  public_id?: string;
  secure_url?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "frames-store/groups",
  label = "Upload Image",
  showUrl = true,
  buttonClassName,
}: ImageUploaderProps) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
    return (
      <p className="text-sm !text-red-600">
        Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{
          folder,
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
        }}
        onSuccess={(result) => {
          const info = result.info as UploadResultInfo | undefined;
          if (!info) return;

          const cleanUrl = info.public_id
            ? getCldImageUrl({
                src: info.public_id,
                format: "auto",
                quality: "auto",
              })
            : info.secure_url;

          if (cleanUrl) {
            onChange(cleanUrl);
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className={
              buttonClassName ||
              "cursor-pointer inline-flex items-center gap-2 border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground hover:border-foreground transition-colors"
            }
          >
            <Upload className="w-4 h-4" />
            <span>{value ? "Change Image" : label}</span>
          </button>
        )}
      </CldUploadWidget>

      {showUrl && value && (
        <p className="break-all text-xs !text-neutral-600">Saved URL: {value}</p>
      )}
    </div>
  );
}
