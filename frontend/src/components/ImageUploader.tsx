import { ImageIcon, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
  imagePreview: string | null;
  selectedFile: File | null;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
  onValidationError: (message: string) => void;
  error?: string;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE_MB = 5;

export function ImageUploader({ imagePreview, selectedFile, onFileSelected, onRemove, onValidationError, error }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error('Please upload a PNG, JPEG, or WebP image.');
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`Please upload an image smaller than ${MAX_SIZE_MB} MB.`);
    }

    onFileSelected(file);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      validateFile(file);
    } catch (uploadError) {
      onValidationError(uploadError instanceof Error ? uploadError.message : 'Invalid file.');
    }
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    try {
      validateFile(file);
    } catch (uploadError) {
      onValidationError(uploadError instanceof Error ? uploadError.message : 'Invalid file.');
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed p-6 text-center transition',
          isDragging
            ? 'border-violet-400 bg-violet-500/8'
            : 'border-slate-700 bg-slate-900/60 hover:border-violet-500/50 hover:bg-slate-900'
        ].join(' ')}
      >
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleChange} />

        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Uploaded preview" className="h-56 w-full rounded-2xl object-cover shadow-xl" />
            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 backdrop-blur-sm">
              <div className="flex min-w-0 items-center gap-2 text-left">
                <ImageIcon className="h-4 w-4 text-violet-300" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-white">{selectedFile?.name ?? 'Uploaded image'}</p>
                  <p className="text-[10px] text-slate-400">{selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Ready'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25">
              <UploadCloud className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium text-white">Drop an image here</p>
            <p className="mt-1 text-sm text-slate-400">PNG, JPG, or WebP up to 5 MB</p>
            <span className="mt-4 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300">Browse files</span>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}
