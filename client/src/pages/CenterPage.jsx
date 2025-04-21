"use client"

import { useState } from "react"

const boothData = [
  { number: 1, registered: 5000, counted: 4397 },
  { number: 2, registered: 5000, counted: 2369 },
  { number: 3, registered: 5000, counted: 2829 },
  { number: 4, registered: 5000, counted: 1266 },
  { number: 5, registered: 5000, counted: 4070 },
  { number: 6, registered: 5000, counted: 4345 },
  { number: 7, registered: 5000, counted: 4797 },
  { number: 8, registered: 5000, counted: 3568 },
  { number: 9, registered: 5000, counted: 4017 },
  { number: 10, registered: 5000, counted: 570 },
  { number: 11, registered: 5000, counted: 563 },
  { number: 12, registered: 5000, counted: 663 },
  { number: 13, registered: 5000, counted: 3523 },
  { number: 14, registered: 5000, counted: 2562 },
  { number: 15, registered: 5000, counted: 757 },
]

export default function CenterDashboard() {
  const [booths] = useState(boothData)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Higher Official Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold">Name: M Raghavendra</p>
            <p>ID: HO12345</p>
          </div>
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Booth Overview</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mb-8">
        {booths.map((booth) => (
          <div key={booth.number} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold mb-2">Booth {booth.number}</h3>
            <p>Registered Voters: {booth.registered}</p>
            <p>Votes Counted: {booth.counted}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow mb-8 p-4">
        <h3 className="text-xl font-bold mb-2">Total Booths in Center</h3>
        <p className="text-4xl font-bold">{booths.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-4">Votes Per Booth</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booth Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered Voters
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Votes Counted
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {booths.map((booth) => (
              <tr key={booth.number}>
                <td className="px-6 py-4 whitespace-nowrap">Booth {booth.number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booth.registered}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booth.counted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-right">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
      </div>
    </div>
  )
}

