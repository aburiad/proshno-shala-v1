import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12 lg:pt-24 px-4 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full text-center mb-12"
      >
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
          <span className="text-white text-3xl font-bold">Q</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          কোথায় যেতে চান?
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          আপনার প্রয়োজন অনুযায়ী ড্যাশবোর্ড নির্বাচন করুন
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 px-4">
        {/* Teacher Card */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/dashboard')}
          className="group relative bg-white p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-blue-200 hover:shadow-blue-200/50 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center mb-6 relative">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3 relative">শিক্ষক ড্যাশবোর্ড</h2>
          <p className="text-gray-500 mb-6 leading-relaxed relative">
            প্রশ্নপত্র তৈরি, প্রশ্ন ব্যাংক পরিচালনা এবং মক টেস্ট নিতে শিক্ষক ড্যাশবোর্ডে প্রবেশ করুন।
          </p>
          
          <div className="flex items-center text-blue-600 font-semibold relative">
            প্রবেশ করুন
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </motion.button>

        {/* Student Card */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/student')}
          className="group relative bg-white p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-purple-200 hover:shadow-purple-200/50 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="w-16 h-16 bg-purple-100/50 rounded-2xl flex items-center justify-center mb-6 relative">
            <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3 relative">ইন্টারেক্টিভ লার্নিং (শিক্ষার্থী)</h2>
          <p className="text-gray-500 mb-6 leading-relaxed relative">
            অ্যানিমেশন, গেমস এবং প্র্যাকটিক্যাল উদাহরণের মাধ্যমে গণিত ও ইংরেজি শিখতে প্রবেশ করুন।
          </p>
          
          <div className="flex items-center text-purple-600 font-semibold relative">
            প্রবেশ করুন
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </motion.button>
      </div>
    </div>
  )
}
