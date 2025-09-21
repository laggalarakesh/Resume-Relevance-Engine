import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Configure the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

interface InputSectionProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  resumeText: string;
  setResumeText: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  setError: (message: string | null) => void;
}

// --- ICONS ---
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const PdfFileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18V12H10.5C10.2348 12 9.98043 12.1054 9.79289 12.2929C9.60536 12.4804 9.5 12.7348 9.5 13V15C9.5 15.2652 9.60536 15.5196 9.79289 15.7071C9.98043 15.8946 10.2348 16 10.5 16H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 18V12H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14.5 12H15.5C15.7652 12 16.0196 12.1054 16.2071 12.2929C16.3946 12.4804 16.5 12.7348 16.5 13V17C16.5 17.2652 16.3946 17.5196 16.2071 17.7071C16.0196 17.8946 15.7652 18 15.5 18H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const DocxFileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 15H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 18H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const FileIcon: React.FC<{ file: File } & React.SVGProps<SVGSVGElement>> = ({ file, ...props }) => {
  const { type: fileType, name: fileName } = file;

  if (fileType === 'application/pdf') {
    return <PdfFileIcon {...props} className={`${props.className} text-red-600 dark:text-red-400`} />;
  }

  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
    return <DocxFileIcon {...props} className={`${props.className} text-blue-600 dark:text-blue-400`} />;
  }

  const genericFileIcon = <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {genericFileIcon}
    </svg>
  );
};


const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


// --- FILE PREVIEW COMPONENT ---
interface FilePreviewProps {
    file: File;
    onClear: () => void;
    isParsing: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClear, isParsing }) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    return (
        <div className="relative mt-2 p-2.5 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center gap-3 text-sm animate-fade-in">
             {isParsing && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400">
                         <SpinnerIcon className="w-5 h-5" />
                         <span>Parsing file...</span>
                    </div>
                </div>
            )}
            <FileIcon file={file} className="w-8 h-8 text-slate-500 flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
                <p className="font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
            </div>
            <button 
                onClick={onClear} 
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove file"
                disabled={isParsing}
            >
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

// --- IMAGE PREVIEW COMPONENT ---
interface ImagePreviewProps {
    src: string;
    alt: string;
    onClear: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, onClear }) => (
    <div className="mt-2 p-2.5 bg-slate-100 dark:bg-slate-700/50 rounded-lg relative group animate-fade-in">
        <img src={src} alt={alt} className="rounded-md max-h-48 w-full object-contain" />
        <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
            aria-label="Remove image"
        >
            <XCircleIcon className="w-6 h-6" />
        </button>
    </div>
);


export const InputSection: React.FC<InputSectionProps> = ({
  jobDescription,
  setJobDescription,
  resumeText,
  setResumeText,
  onAnalyze,
  isLoading,
  setError,
}) => {
    const [isParsingJD, setIsParsingJD] = useState<boolean>(false);
    const [isParsingResume, setIsParsingResume] = useState<boolean>(false);

    const [jdFile, setJdFile] = useState<File | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const [jdImagePreview, setJdImagePreview] = useState<string | null>(null);
    const [resumeImagePreview, setResumeImagePreview] = useState<string | null>(null);
    
    const jdInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Cleanup object URLs to prevent memory leaks
        return () => {
            if (jdImagePreview) URL.revokeObjectURL(jdImagePreview);
            if (resumeImagePreview) URL.revokeObjectURL(resumeImagePreview);
        };
    }, [jdImagePreview, resumeImagePreview]);


    const handleFileChange = async (
        file: File | null,
        textSetter: (text: string) => void,
        fileSetter: (file: File | null) => void,
        setIsParsing: (isParsing: boolean) => void,
        inputRef: React.RefObject<HTMLInputElement>,
        imagePreviewSetter: (url: string | null) => void
    ) => {
        // Always clear previous state for a new file selection
        textSetter('');
        fileSetter(null);
        imagePreviewSetter(null);
        setError(null);

        if (!file) {
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

        fileSetter(file);
        
        // --- File Type Handling ---
        if (file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            imagePreviewSetter(previewUrl);
            setError('Image-to-text conversion is not yet supported. Please use a PDF or DOCX file.');
            return; 
        }

        const allowedMimeTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const allowedExtensions = ['.pdf', '.docx'];
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

        if (!allowedMimeTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            setError('Unsupported file type. Please upload a PDF or DOCX file.');
            fileSetter(null);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            return;
        }

        setIsParsing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            if (file.type === 'application/pdf') {
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
                    fullText += '\n'; 
                }
                textSetter(fullText);
            } else {
                const result = await mammoth.extractRawText({ arrayBuffer });
                textSetter(result.value);
            }
        } catch (err) {
            console.error('Error parsing file:', err);
            const fileTypeName = file.type === 'application/pdf' ? 'PDF' : 'DOCX';
            setError(`Failed to read the ${fileTypeName} file. It may be corrupted or password-protected.`);
            textSetter('');
            fileSetter(null);
            if (inputRef.current) {
              inputRef.current.value = '';
            }
        } finally {
            setIsParsing(false);
        }
    };

    const handleClearFile = (
        fileSetter: React.Dispatch<React.SetStateAction<File | null>>,
        textSetter: (text: string) => void,
        inputRef: React.RefObject<HTMLInputElement>,
        imagePreviewSetter: (url: string | null) => void
    ) => {
        fileSetter(null);
        textSetter('');
        imagePreviewSetter(null);
        setError(null); // Also clear any associated errors
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const fileInputAccept = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*";

    const isAppBusy = isLoading || isParsingJD || isParsingResume;
    const hasIncompleteInputs = !jobDescription.trim() || !resumeText.trim();
    const isAnalyzeDisabled = isAppBusy || hasIncompleteInputs;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="job-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Job Description
                </label>
                <label 
                    htmlFor="jd-file-upload" 
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        isAppBusy
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/70'
                    }`}
                >
                    {isParsingJD ? (
                        <><SpinnerIcon className="w-4 h-4" /> Parsing...</>
                    ) : (
                        <><UploadIcon className="w-4 h-4" /> Upload File</>
                    )}
                </label>
                 <input
                    id="jd-file-upload"
                    ref={jdInputRef}
                    type="file"
                    className="hidden"
                    accept={fileInputAccept}
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null, setJobDescription, setJdFile, setIsParsingJD, jdInputRef, setJdImagePreview)}
                    disabled={isAppBusy}
                />
            </div>
            {jdImagePreview ? (
              <ImagePreview src={jdImagePreview} alt="Job Description Preview" onClear={() => handleClearFile(setJdFile, setJobDescription, jdInputRef, setJdImagePreview)} />
            ) : jdFile ? (
              <FilePreview file={jdFile} onClear={() => handleClearFile(setJdFile, setJobDescription, jdInputRef, setJdImagePreview)} isParsing={isParsingJD} />
            ) : null}
          <textarea
            id="job-description"
            rows={15}
            className={`w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 transition ${(jdFile || jdImagePreview) ? 'mt-2' : ''}`}
            placeholder="Paste the full job description here, or upload a file above."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isAppBusy}
          />
        </div>
        <div>
            <div className="flex justify-between items-center mb-2">
                 <label htmlFor="resume-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Resume Text
                </label>
                <label 
                    htmlFor="resume-file-upload" 
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        isAppBusy
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/70'
                    }`}
                >
                    {isParsingResume ? (
                        <><SpinnerIcon className="w-4 h-4" /> Parsing...</>
                    ) : (
                        <><UploadIcon className="w-4 h-4" /> Upload File</>
                    )}
                </label>
                 <input
                    id="resume-file-upload"
                    ref={resumeInputRef}
                    type="file"
                    className="hidden"
                    accept={fileInputAccept}
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null, setResumeText, setResumeFile, setIsParsingResume, resumeInputRef, setResumeImagePreview)}
                    disabled={isAppBusy}
                />
            </div>
            {resumeImagePreview ? (
              <ImagePreview src={resumeImagePreview} alt="Resume Preview" onClear={() => handleClearFile(setResumeFile, setResumeText, resumeInputRef, setResumeImagePreview)} />
            ) : resumeFile ? (
              <FilePreview file={resumeFile} onClear={() => handleClearFile(setResumeFile, setResumeText, resumeInputRef, setResumeImagePreview)} isParsing={isParsingResume} />
            ) : null}
          <textarea
            id="resume-text"
            rows={15}
            className={`w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 transition ${(resumeFile || resumeImagePreview) ? 'mt-2' : ''}`}
            placeholder="Paste the full resume text here, or upload a file above."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isAppBusy}
          />
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzeDisabled}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            'Analyzing...'
          ) : (
             <>
               <SparklesIcon className="w-5 h-5" />
               Analyze Relevance
            </>
          )}
        </button>
      </div>
    </div>
  );
};