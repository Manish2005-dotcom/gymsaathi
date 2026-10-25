import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Upload,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileText,
  Play,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { PublicExercise } from '../../types/admin';

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'gif' | 'image' | 'svg';
  exerciseName?: string;
  uploadedAt: string;
}

export const AdminMediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    const exercises = await AdminService.getExercises(true);
    const mediaList: MediaAsset[] = [];

    exercises.forEach((ex) => {
      if (ex.demonstrationUrl) {
        const isVideo = ex.demonstrationUrl.includes('.mp4') || ex.demonstrationUrl.includes('.webm') || ex.demonstrationType === 'video';
        const isGif = ex.demonstrationUrl.includes('.gif') || ex.demonstrationType === 'gif';
        mediaList.push({
          id: ex.id,
          name: `${ex.name} Demonstration`,
          url: ex.demonstrationUrl,
          type: isVideo ? 'video' : isGif ? 'gif' : 'image',
          exerciseName: ex.name,
          uploadedAt: ex.updatedAt,
        });
      }
    });

    // Also include default demo assets
    if (mediaList.length === 0) {
      mediaList.push({
        id: 'sample-1',
        name: 'Bicep Curl 2D Animation Blueprint',
        url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        exerciseName: 'Dumbbell Bicep Curl',
        uploadedAt: new Date().toISOString(),
      });
    }

    setAssets(mediaList);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const result = await AdminService.uploadMediaAsset(file);
    setUploading(false);

    if (result.success && result.url) {
      setUploadSuccess(`Asset "${file.name}" uploaded successfully!`);
      const isVideo = file.type.startsWith('video');
      const isGif = file.type === 'image/gif';
      const newAsset: MediaAsset = {
        id: `upload-${Date.now()}`,
        name: file.name,
        url: result.url,
        type: isVideo ? 'video' : isGif ? 'gif' : 'image',
        uploadedAt: new Date().toISOString(),
      };
      setAssets((prev) => [newAsset, ...prev]);
    } else {
      setUploadError(result.error || 'Upload failed.');
    }
  };

  const handleDelete = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (previewAsset?.id === id) setPreviewAsset(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-lime-400" />
            <span>Animation & Demonstration Media Library</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Store and manage GIFs, video clips, and demonstration graphics in Supabase Storage with automatic size/format validation.
          </p>
        </div>

        <button
          onClick={fetchMedia}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-lime-400' : ''}`} />
        </button>
      </div>

      {/* Upload Dropzone */}
      <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-lime-500/50 rounded-2xl p-8 cursor-pointer bg-zinc-900/30 hover:bg-zinc-900/60 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-lime-500/10 text-lime-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-white">
            {uploading ? 'Validating and uploading media...' : 'Upload New Exercise Demonstration'}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Drag and drop or browse GIF, MP4, WebM, SVG, or PNG files (up to 15MB)
          </p>
          <input
            type="file"
            accept="image/gif,image/svg+xml,image/png,image/jpeg,video/mp4,video/webm"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Gallery Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Demonstration Assets ({assets.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl bg-zinc-950/70 border border-zinc-800 overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition-all"
            >
              <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
                {asset.type === 'video' ? (
                  <video src={asset.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="p-2 rounded-xl bg-lime-400 text-black font-bold text-xs flex items-center gap-1 shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Preview</span>
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 px-2 py-0.5 rounded bg-lime-500/10 border border-lime-500/20">
                    {asset.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(asset.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white truncate">{asset.name}</h3>
                {asset.exerciseName && (
                  <p className="text-[11px] text-zinc-400">Attached to: {asset.exerciseName}</p>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewAsset(asset)}
                  className="text-zinc-400 hover:text-white text-[11px] font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400"
                  title="Remove Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#111513] border border-zinc-800 rounded-2xl p-6 max-w-xl w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{previewAsset.name}</h3>
              <button onClick={() => setPreviewAsset(null)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black max-h-96 flex items-center justify-center">
              {previewAsset.type === 'video' ? (
                <video src={previewAsset.url} controls autoPlay loop className="max-h-80 w-full" />
              ) : (
                <img src={previewAsset.url} alt={previewAsset.name} className="max-h-80 object-contain mx-auto" />
              )}
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-400">Type: {previewAsset.type.toUpperCase()}</span>
              <button
                onClick={() => setPreviewAsset(null)}
                className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
