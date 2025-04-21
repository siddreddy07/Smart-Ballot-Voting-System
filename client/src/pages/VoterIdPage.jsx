"use client"

import { useState } from "react"

export default function VoterIDApplication() {
  const [file, setFile] = useState(null)

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-lg bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Voter ID Application</h1>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Application Type:
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select application type</option>
              <option value="new">New ID Card</option>
              <option value="lost">Lost ID Card</option>
              <option value="correction">Correction in ID Card</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="document" className="block text-sm font-medium text-gray-700">
              Upload Supporting Document:
            </label>
            <div className="grid w-full items-center gap-1.5">
              <input
                id="document"
                type="file"
                className="cursor-pointer rounded-md border border-gray-300 px-3 py-2"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

