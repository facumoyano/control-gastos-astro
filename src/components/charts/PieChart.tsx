import { useEffect, useState } from 'react';
import { db } from '../../config/firebase-client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';

ChartJS.register(ArcElement, Tooltip, Legend);

const options: ChartOptions = {
  plugins: {
    legend: {
      position: 'right',
    },
  },
};

const PieChart = () => {
  const [data, setData] = useState<{ [category: string]: number }>({});
  const [labels, setLabels] = useState<string[]>([]);
  const [type, setType] = useState<'expenses' | 'incomes'>('expenses');

  useEffect(() => {
      const getData = async () => {
          const dataCol = collection(db, type);
          const dataSnapshot = await getDocs(dataCol);
          const data = dataSnapshot.docs.reduce((acc, doc) => {
              const category = doc.data().category;
              if (!acc[category]) {
                  acc[category] = 0;
              }
              acc[category] += doc.data().amount;
              return acc;
          }, {} as { [category: string]: number });
          setData(data);
          setLabels(Object.keys(data));
      };

      getData();
  }, [type]);

  const chartData = {
      labels,
      datasets: [
          {
              label: type.charAt(0).toUpperCase() + type.slice(1),
              data: labels.map(label => data[label] || 0),
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
          },
      ],
  };

  return (
    <div className='max-h-80'>
      <div>
      <span className='text-sm mr-2'>Filtrar por:</span>
      <select value={type} onChange={(e) => setType(e.target.value as 'expenses' | 'incomes')} className='text-sm bg-white dark:bg-zinc-800 border dark:border-border-zinc-800 border-slate-400 rounded-lg py-1 px-2'>
        <option value="expenses">Gastos</option>
        <option value="incomes">Ingresos</option>
      </select>
      </div>
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default PieChart