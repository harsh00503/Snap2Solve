import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EmptyState } from './components/EmptyState';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisModeSelector } from './components/AnalysisModeSelector';
import { QuestionInput } from './components/QuestionInput';
import { LoadingState } from './components/LoadingState';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeImage, getServiceHealth } from './services/api';
import type { AnalysisMode, AnalysisResult } from './types/analysis';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mode, setMode] = useState<AnalysisMode>('DEBUG');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'ready' | 'needs-key' | 'offline'>('checking');

  useEffect(() => {
    getServiceHealth()
      .then((health) => setServiceStatus(health.configured ? 'ready' : 'needs-key'))
      .catch(() => setServiceStatus('offline'));
  }, []);

  const featureCards = useMemo(
    () => [
      { title: 'Debug Errors', description: 'Understand error messages and likely causes.', icon: 'alert' },
      { title: 'Understand Content', description: 'Explain notices, interfaces, and documents.', icon: 'docs' },
      { title: 'Take Action', description: 'Convert visual information into next steps.', icon: 'spark' }
    ],
    []
  );

  const handleFileSelected = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError('The selected image exceeds the 5 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result));
    };

    reader.readAsDataURL(file);
    setSelectedFile(file);
    setError('');
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !imagePreview) {
      setError('Upload a screenshot before analyzing.');
      return;
    }

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError('Add a clear question so the AI can focus on the right details.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await analyzeImage({
        imageDataUrl: imagePreview,
        question: trimmedQuestion,
        mode,
        fileName: selectedFile.name
      });
      setAnalysisResult(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong while analyzing the image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-slate-100">
      <div className="mx-auto flex max-w-[1500px] flex-col xl:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 xl:p-10">
          <Header serviceStatus={serviceStatus} />

          <section className="mt-8 space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => (
                <div key={card.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm shadow-slate-950/40">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20">
                    {card.icon === 'alert' && <span className="text-lg">⚠</span>}
                    {card.icon === 'docs' && <span className="text-lg">📄</span>}
                    {card.icon === 'spark' && <span className="text-lg">⚡</span>}
                  </div>
                  <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{card.description}</p>
                </div>
              ))}
            </div>

            {!analysisResult && !isLoading && (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4 md:p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">Upload your screenshot</h2>
                </div>
                <div className="space-y-6">
                  <ImageUploader
                    imagePreview={imagePreview}
                    selectedFile={selectedFile}
                    onFileSelected={handleFileSelected}
                    onRemove={handleRemove}
                    onValidationError={setError}
                    error={error}
                  />
                  <AnalysisModeSelector mode={mode} onChange={setMode} />
                  <QuestionInput value={question} onChange={setQuestion} onSubmit={handleAnalyze} isLoading={isLoading} />
                </div>
              </div>
            )}

            {isLoading && <LoadingState />}

            {!isLoading && analysisResult && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4 md:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Updated analysis</p>
                      <h2 className="text-xl font-semibold text-white">{selectedFile?.name ?? 'Your screenshot'}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAnalysisResult(null);
                        setQuestion('');
                        handleRemove();
                      }}
                      className="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
                    >
                      New analysis
                    </button>
                  </div>

                  <ImageUploader
                    imagePreview={imagePreview}
                    selectedFile={selectedFile}
                    onFileSelected={handleFileSelected}
                    onRemove={handleRemove}
                    onValidationError={setError}
                    error={error}
                  />
                </div>

                <AnalysisResults answer={analysisResult.answer} summary={analysisResult.summary} mode={analysisResult.mode} />
              </div>
            )}

            {!analysisResult && !isLoading && !selectedFile && <EmptyState />}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
