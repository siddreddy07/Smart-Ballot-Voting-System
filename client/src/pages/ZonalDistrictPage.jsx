import { Link, useParams } from 'react-router-dom';

const centers = [
  { number: 1, name: "Anakapalli Town Hall" },
  { number: 2, name: "Gavarapalem High School" },
  { number: 3, name: "NTR Stadium" },
  { number: 4, name: "RTC Complex" },
  { number: 5, name: "Old Bus Stand" },
  { number: 6, name: "Kasimkota High School" },
  { number: 7, name: "Revidi Community Hall" },
  { number: 8, name: "Chodavaram Junction" },
  { number: 9, name: "Yelamanchili Municipal Office" },
  { number: 10, name: "Nakkapalli ZP School" },
  { number: 11, name: "Parawada Engineering College" },
  { number: 12, name: "Devapuram Panchayat Office" },
  { number: 13, name: "Tuni Junction" },
  { number: 14, name: "Anakapalli Girls School" },
  { number: 15, name: "Gopalapatnam Community Hall" },
  { number: 16, name: "Pendurthi Market Yard" },
  { number: 17, name: "Payakaraopeta Government School" },
  { number: 18, name: "Sabbavaram ZP High School" },
  { number: 19, name: "Thagarapuvalasa Community Center" },
  { number: 20, name: "Anandapuram ZP High School" },
];

export default function ZonalDistrictPage() {
  const { district } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Centers in {decodeURIComponent(district)}</h1>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {centers.map((center) => (
          <Link to={`/center/${center.number}`} key={center.number}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Center Number: {center.number}</h3>
                <p className="text-sm text-gray-500">{center.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
