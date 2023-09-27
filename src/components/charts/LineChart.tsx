import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase-client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../config/firebase-client';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Resumen',
        },
    },
};

const LineChart = () => {
  const [expenses, setExpenses] = useState<{ [date: string]: number }>({});
  const [incomes, setIncomes] = useState<{ [date: string]: number }>({});
  const [labels, setLabels] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null)
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log('no user')
      }
    });
  }, [])

  useEffect(() => {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthsOfYear = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const initialExpenses = timePeriod === 'week' ? 
      daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: 0 }), {}) : 
      monthsOfYear.reduce((acc, month) => ({ ...acc, [month]: 0 }), {});

    setExpenses(initialExpenses);
    setIncomes(initialExpenses);
    setLabels(Object.keys(initialExpenses));

    const getExpenses = async () => {
      const expensesCol = collection(db, 'expenses');
      const q = query(expensesCol, where('userId', '==', userId));
      const expensesSnapshot = await getDocs(q);
      const expensesData = expensesSnapshot.docs.reduce((acc, doc) => {
          const date = new Date(doc.data().date);
          const now = new Date();
          // Verificar si la fecha está en la misma semana que la fecha actual
          if (timePeriod === 'week' && getWeek(date) === getWeek(now)) {
              const label = daysOfWeek[date.getDay()];
              acc[label] += doc.data().amount;
          }
          return acc;
      }, { ...initialExpenses });
      setExpenses(expensesData);
    };
    
    const getIncomes = async () => {
      const incomesCol = collection(db, 'incomes');
      const q = query(incomesCol, where('userId', '==', userId));
      const incomesSnapshot = await getDocs(q);
      const incomesData = incomesSnapshot.docs.reduce((acc, doc) => {
          const date = new Date(doc.data().date);
          const now = new Date();
          // Verificar si la fecha está en la misma semana que la fecha actual
          if (timePeriod === 'week' && getWeek(date) === getWeek(now)) {
              const label = daysOfWeek[date.getDay()];
              acc[label] += doc.data().amount;
          }
          return acc;
      }, { ...initialExpenses });
      setIncomes(incomesData);
    };
    
    // Función para obtener el número de la semana del año
    function getWeek(date: Date) {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
  
    getExpenses();
    getIncomes();
}, [userId, timePeriod]);

const data = {
    labels, 
    datasets: [
        {
            label: 'Gastos',
            data: labels.map(label => expenses[label] || 0), 
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Ingresos',
            data: labels.map(label => incomes[label] || 0), 
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

return (
    <div>
      <div>
        <span className='mr-2 text-sm'>Filtrar por:</span>
        <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value as 'week' | 'month')} className='text-sm bg-white dark:bg-zinc-800 border dark:border-border-zinc-800 border-slate-400 rounded-lg py-1 px-2'>
          <option value="week">Semana</option>
          <option value="month">Meses</option>
        </select>
      </div>
        <Line data={data} options={options} />
    </div>
);
};

export default LineChart;