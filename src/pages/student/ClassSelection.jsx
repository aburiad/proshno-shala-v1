import useStudentStore from '@/store/studentStore';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CLASSES = [
  { id: 1, label: '১ম শ্রেণি', name: 'Class 1', color: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700', icon: '🍎' },
  { id: 2, label: '২য় শ্রেণি', name: 'Class 2', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700', icon: '🦋' },
  { id: 3, label: '৩য় শ্রেণি', name: 'Class 3', color: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700', icon: '🐝' },
  { id: 4, label: '৪র্থ শ্রেণি', name: 'Class 4', color: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700', icon: '🌳' },
  { id: 5, label: '৫ম শ্রেণি', name: 'Class 5', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700', icon: '🌍' },
  { id: 6, label: '৬ষ্ঠ শ্রেণি', name: 'Class 6', color: 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700', icon: '🔭' },
  { id: 7, label: '৭ম শ্রেণি', name: 'Class 7', color: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-700', icon: '🔬' },
  { id: 8, label: '৮ম শ্রেণি', name: 'Class 8', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700', icon: '📐' },
  { id: 9, label: '৯ম শ্রেণি', name: 'Class 9', color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700', icon: '⚛️' },
  { id: 10, label: '১০ম শ্রেণি', name: 'Class 10', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700', icon: '🎓' },
];

export default function ClassSelection() {
  const navigate = useNavigate()
  const setClass = useStudentStore((s) => s.setClass)
  const selectedClass = useStudentStore((s) => s.selectedClass)
  const [confirmed, setConfirmed] = useState(false)

  const handleClassSelect = (classId) => {
    setClass(classId);
    setConfirmed(true);
    setTimeout(() => navigate('/student/subjects'), 1000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12 lg:pt-20 px-4 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto w-full text-center mb-10"
      >
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
          <span className="text-white text-3xl font-bold">Q</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          তোমার ক্লাস সিলেক্ট করো
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          তোমার পড়াশোনা শুরু করতে নিচের থেকে তোমার ক্লাসটি বেছে নাও।
        </p>
      </motion.div>

      {confirmed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto w-full bg-green-50 border border-green-200 p-6 rounded-3xl text-center mb-10"
        >
          <div className="text-3xl mb-2">✅</div>
          <h3 className="text-lg font-bold text-green-800">অভিনন্দন!</h3>
          <p className="text-green-700">তুমি ক্লাস {selectedClass} সিলেক্ট করেছ।</p>
          <button 
             onClick={() => setConfirmed(false)}
             className="mt-4 text-xs font-bold text-green-600 uppercase tracking-widest hover:underline"
          >
             ক্লাস পরিবর্তন করো
          </button>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 px-4"
      >
        {CLASSES.map((cls) => (
          <motion.button
             key={cls.id}
             whileHover={{ y: -5, scale: 1.03 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => handleClassSelect(cls.id)}
             className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 shadow-sm ${
                selectedClass === cls.id ? 'ring-4 ring-blue-500/20 border-blue-500' : cls.color
             }`}
          >
             <span className="text-5xl mb-4 drop-shadow-sm">{cls.icon}</span>
             <h2 className="text-xl font-bold tracking-tight">{cls.label}</h2>
             <span className="text-xs font-semibold opacity-60 mt-1 uppercase tracking-widest">{cls.name}</span>
          </motion.button>
        ))}
      </motion.div>
      
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1, transition: { delay: 0.5 } }}
         className="mt-12 text-center"
      >
         <button 
            onClick={() => navigate('/')} 
            className="text-gray-500 hover:text-gray-900 font-semibold px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center gap-2"
         >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            হোম পেজে ফিরে যান
         </button>
      </motion.div>
    </div>
  )
}
