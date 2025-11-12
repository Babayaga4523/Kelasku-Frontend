"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/app/utils/api";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useAuthStore } from '@/app/stores/auth';

export default function CreateQuestionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    stimulus_type: 'none' as 'none' | 'text' | 'image',
    stimulus: '',
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
    duration: 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetchWithAuth('/admin/questions', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      router.push('/dashboard/admin/questions');
    } catch (error) {
      console.error('Error creating question:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat soal';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/dashboard/admin/questions"
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tambah Soal Baru</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Buat soal CBT baru dengan mudah</p>
              </div>
            </div>
            <Link
              href="/dashboard/admin/questions"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors text-sm sm:text-base"
            >
              Batal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl shadow-blue-100/50 border border-blue-100 rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
            {/* Stimulus Type */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Tipe Stimulus
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: 'none', label: 'Tanpa Stimulus', desc: 'Soal langsung tanpa bacaan/gambar' },
                  { value: 'text', label: 'Stimulus Teks', desc: 'Dengan bacaan pendukung' },
                  { value: 'image', label: 'Stimulus Gambar', desc: 'Dengan gambar pendukung' },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleInputChange('stimulus_type', option.value)}
                    className={`cursor-pointer border-2 rounded-xl p-4 sm:p-6 text-center transition-all hover:shadow-md ${
                      formData.stimulus_type === option.value
                        ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-25 shadow-lg scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{option.label}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{option.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stimulus Content */}
            {formData.stimulus_type !== 'none' && (
              <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {formData.stimulus_type === 'text' ? 'Bacaan Pendukung' : 'URL Gambar'}
                </label>
                {formData.stimulus_type === 'text' ? (
                  <textarea
                    value={formData.stimulus}
                    onChange={(e) => handleInputChange('stimulus', e.target.value)}
                    rows={4}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base bg-white text-black placeholder-black resize-none"
                    placeholder="Masukkan bacaan pendukung..."
                    required
                  />
                ) : (
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={formData.stimulus}
                      onChange={(e) => handleInputChange('stimulus', e.target.value)}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base bg-white text-black placeholder-black"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    <p className="text-xs sm:text-sm text-gray-500">
                      Masukkan URL gambar yang valid
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Question */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pertanyaan
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                rows={4}
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base bg-white text-black placeholder-black resize-none"
                placeholder="Masukkan pertanyaan..."
                required
              />
            </div>

            {/* Answer Options */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pilihan Jawaban
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { key: 'option_a', label: 'A', color: 'bg-blue-50 border-blue-200' },
                  { key: 'option_b', label: 'B', color: 'bg-green-50 border-green-200' },
                  { key: 'option_c', label: 'C', color: 'bg-yellow-50 border-yellow-200' },
                  { key: 'option_d', label: 'D', color: 'bg-red-50 border-red-200' },
                ].map((option) => (
                  <div key={option.key} className={`border-2 rounded-xl p-4 ${option.color} transition-all hover:shadow-md`}>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="correct_answer"
                          value={option.label}
                          checked={formData.correct_answer === option.label}
                          onChange={(e) => handleInputChange('correct_answer', e.target.value)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                          title={`Pilih jawaban ${option.label} sebagai jawaban benar`}
                        />
                        <label className="ml-2 block text-sm font-semibold text-gray-700">
                          {option.label}
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formData[option.key as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(option.key, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base bg-white text-black placeholder-black"
                        placeholder={`Pilihan ${option.label}...`}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Penjelasan/Pembahasan
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => handleInputChange('explanation', e.target.value)}
                rows={3}
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base bg-white text-black placeholder-black resize-none"
                placeholder="Masukkan penjelasan jawaban yang benar..."
              />
            </div>

            {/* Duration */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Durasi Pengerjaan (detik)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                min="30"
                max="300"
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base bg-white text-black"
                title="Durasi pengerjaan soal dalam detik"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Waktu yang disarankan untuk menjawab soal ini (30-300 detik)
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0 pt-4">
              <Link
                href="/dashboard/admin/questions"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 transition-all"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Menyimpan...' : 'Simpan Soal'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}