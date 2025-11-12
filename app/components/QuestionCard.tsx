"use client";

import type { Question } from "@/app/types/cbt";

type QuestionCardProps = {
  question: Question;
  questionNumber: number;
  selectedAnswerId: string | null;
  onSelectAnswer: (questionId: string, answerId: string, answerText: string) => void;
  apiBaseUrl: string;
};

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswerId,
  onSelectAnswer,
  apiBaseUrl,
}: QuestionCardProps) {
  return (
    <div>
      <div className="mb-4 sm:mb-5">
        <span className="bg-blue-100 border border-blue-200 text-blue-700 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-sm font-medium">
          Soal No. {questionNumber}
        </span>
      </div>

      {/* STIMULUS */}

      {/* Stimulus Teks */}
      {question.stimulus && question.stimulus_type === "text" && (
        <div className="bg-blue-50 border border-blue-200 p-4 sm:p-5 rounded-xl mb-4 sm:mb-6 leading-relaxed text-gray-700 text-sm sm:text-[15px]">
          {question.stimulus}
        </div>
      )}

      {/* Stimulus Gambar */}
      {question.stimulus && question.stimulus_type === "image" && (
        <div className="flex justify-center mb-4 sm:mb-6">
          {/* Handle both full URLs and relative paths */}
          <img
            src={question.stimulus.startsWith('http')
              ? question.stimulus
              : question.stimulus.startsWith('/storage/')
                ? `${apiBaseUrl}${question.stimulus}`
                : question.stimulus.startsWith('/images/')
                  ? `${apiBaseUrl}/storage${question.stimulus}`
                  : `${apiBaseUrl}/storage/images/${question.stimulus}`}
            alt="Stimulus Gambar"
            className="rounded-xl border border-gray-200 shadow-sm object-contain max-w-full bg-slate-50 max-h-60 sm:max-h-80 w-full sm:w-auto"
            onError={(e) => {
              console.error('Image failed to load:', question.stimulus);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* TEKS SOAL */}
      <p className="text-gray-800 text-sm sm:text-[16px] font-medium mb-4 sm:mb-6 leading-relaxed">
        {question.question_text}
      </p>

      {/* PILIHAN JAWABAN */}
      <div role="radiogroup" className="space-y-2 sm:space-y-3">
        {question.answers.map((opt) => (
          <label
            key={opt.id}
            className={`block border rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 cursor-pointer text-gray-700 text-sm sm:text-[15px] transition ${
              selectedAnswerId === opt.id
                ? "bg-orange-50 border-orange-400 text-orange-600 ring-2 ring-orange-200"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name={`question-${question.id}`}
                className="mt-0.5 sm:mt-1 accent-orange-500 flex-shrink-0"
                checked={selectedAnswerId === String(opt.id)}
                onChange={() => onSelectAnswer(String(question.id), String(opt.id), opt.answer_text)}
              />
              <div className="flex-1 min-w-0">
                {opt.answer_text || <span className="text-gray-400 italic">(Pilihan kosong)</span>}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Pembahasan (explanation) */}
      {question.explanation && (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
          <div className="font-semibold mb-2 text-sm sm:text-base">Pembahasan:</div>
          <div className="text-sm sm:text-[15px] leading-relaxed">{question.explanation}</div>
        </div>
      )}
    </div>
  );
}