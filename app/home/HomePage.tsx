'use client';

import { Button } from '@/app/components/ui/button';

export default function HomePage() {
  return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center w-full">
      <div className='w-full h-screen flex flex-col items-center'>
      <nav className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-lg font-semibold">DataSheetz</h1>
        <div className="space-x-4">
          <Button variant="outline">Sign in</Button>
          <Button> Create account </Button>
        </div>
      </nav>
      <div className="mt-20 w-full h-full p-10">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-base font-medium">Introducing DataSheetz</span>
        <h2 className="text-5xl font-extrabold mt-6">Real-time Google Sheets integration for your data</h2>
        <p className="text-gray-700 mt-4 text-lg">
          Create dynamic tables connected to Google Sheets. Add custom columns, track changes in real-time, and visualize your data efficiently.
        </p>
        <div className="mt-10 space-x-4">
          <Button className="px-6 py-3 text-lg">Get Started →</Button>
          <Button variant="outline" className="px-6 py-3 text-lg">Learn More</Button>
        </div>
      </div>
      </div>
    </div>
  );
}
