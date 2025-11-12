'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuthRaw } from '@/app/utils/api';
import { useAuthStore } from '@/app/stores/auth';
import { ClipboardList } from 'lucide-react';

interface Test {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  total_attempts: number;
  completed_attempts: number;
  average_score: number;
}

export default function AdminDashboard() {
  const [tests, setTests] = useState<Test[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/dashboard/student');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    const loadTests = async () => {
      try {
  const res = await fetchWithAuthRaw('/admin/tests');
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Failed to load tests (${res.status}) ${text}`);
        }
        const data = await res.json();
        setTests(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error loading tests:', error);
      }
    };

    loadTests();
  }, []);

  if (error) return <div>Error loading tests: {error}</div>;
  
  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardList className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Tests
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {tests.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Tests
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Overview of all CBT tests in the system.
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {tests.length === 0 ? (
            <li className="px-4 py-4 sm:px-6">
              <p className="text-gray-500 text-center">No tests available</p>
            </li>
          ) : (
            tests.map((test) => (
              <li key={test.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {test.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </p>
                      </div>
                    </div>
                    {test.description && (
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {test.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>Duration: {test.duration_minutes} min</span>
                      <span className="mx-2">•</span>
                      <span>Attempts: {test.total_attempts}</span>
                      <span className="mx-2">•</span>
                      <span>Avg Score: {Number(test.average_score ?? 0).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}