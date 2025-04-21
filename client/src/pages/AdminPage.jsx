const districts = [
  { name: "Alluri Sitharama Raju", centers: 20 },
  { name: "Anakapalli", centers: 25 },
  { name: "Ananthapuramu", centers: 20 },
  { name: "Annamayya", centers: 27 },
  { name: "Bapatla", centers: 30 },
  { name: "Chittoor", centers: 20 },
  { name: "East Godavari", centers: 25 },
  { name: "Eluru", centers: 20 },
  { name: "Guntur", centers: 27 },
  { name: "Kadapa", centers: 20 },
  { name: "Kakinada", centers: 30 },
  { name: "Konaseema", centers: 20 },
  { name: "Krishna", centers: 25 },
  { name: "Kurnool", centers: 20 },
  { name: "Manyam", centers: 27 },
  { name: "Nandyal", centers: 20 },
  { name: "NTR", centers: 30 },
  { name: "Palnadu", centers: 20 },
  { name: "Parvathipuram", centers: 25 },
  { name: "Prakasam", centers: 20 },
  { name: "Srikakulam", centers: 27 },
  { name: "Sri Sathya Sai", centers: 20 },
  { name: "Tirupati", centers: 30 },
  { name: "Visakhapatnam", centers: 20 },
  { name: "Vizianagaram", centers: 25 },
  { name: "West Godavari", centers: 20 },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Control Panel</h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold">Name: M.V.Mohan</p>
            <p>ID: HOAP2025</p>
          </div>
          <img src="/placeholder.svg" alt="Admin" className="w-16 h-16 rounded-full" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Districts of Andhra Pradesh</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {districts.map((district) => (
          <div key={district.name} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold">{district.name}</h3>
            </div>
            <div className="p-4">
              <p>Centers: {district.centers}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

