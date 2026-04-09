/**
 * Interactive Lesson Content — Class 6, Chapter 1
 * Each lesson has: steps (teach) + practice (quiz)
 * Step types: 'intro' | 'explain' | 'visual' | 'example' | 'practice'
 */

export const LESSONS = {

  "1.1": {
    id: "1.1",
    title: "অঙ্কপাতন",
    titleEn: "Numeration",
    mascot: "🧙‍♂️",
    mascotName: "গণি জাদুকর",
    color: "#3498db",
    intro: "চলো সংখ্যার জাদুর দুনিয়ায় ঢুকি!",
    steps: [
      {
        type: "interactive",
        component: "RobotChairsGame",
        heading: "অঙ্ক রোবট ও জাদুর চেয়ার",
        voice: "চলো, রোবটগুলোকে জাদুর চেয়ারে বসিয়ে সংখ্যার জাদু দেখি!",
        content: "নিচের রোবটগুলোকে বেছে নিয়ে সঠিক চেয়ারে বসাও। দেখো তাদের মান কীভাবে বদলে যায়!",
        emoji: "🤖"
      },
      {
        type: "interactive",
        component: "NumberCrusherPlayground",
        heading: "স্থানীয় মানের ম্যাজিক",
        voice: "এবার নিজের পছন্দমতো যেকোনো সংখ্যা লিখে ক্রাশ করো!",
        content: "যেকোনো সংখ্যা ইনপুট দাও আর দেখো সেটা দেশীয় ও আন্তর্জাতিক পদ্ধতিতে কীভাবে ভেঙে যায়!",
        emoji: "✨"
      },
      {
        type: "intro",
        heading: "অঙ্কপাতন কী?",
        voice: "বন্ধুরা! আজকে আমরা শিখবো অঙ্কপাতন। অঙ্কপাতন মানে হলো — সংখ্যাকে অঙ্ক দিয়ে লেখা।",
        content: "অঙ্কপাতন মানে হলো কোনো সংখ্যাকে অঙ্ক (০ থেকে ৯) ব্যবহার করে লেখার পদ্ধতি।",
        visual: "digits_intro",
        emoji: "🔢"
      },
      {
        type: "explain",
        heading: "অঙ্ক কী কী আছে?",
        voice: "আমাদের কাছে দশটি অঙ্ক আছে। এগুলো হলো শূন্য থেকে নয়। এই দশটি অঙ্ক দিয়েই আমরা যেকোনো বড় সংখ্যা লিখতে পারি!",
        content: "আমাদের সংখ্যা পদ্ধতিতে মোট ১০টি অঙ্ক আছে:",
        highlight: "০, ১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯",
        note: "💡 এই ১০টি অঙ্ক দিয়ে কোটি কোটি সংখ্যা তৈরি করা যায়!",
        emoji: "✨"
      },
      {
        type: "explain",
        heading: "স্থানীয় মান (Place Value)",
        voice: "একটি সংখ্যায় প্রতিটি অঙ্কের আলাদা আলাদা মান আছে। সেটাই স্থানীয় মান। যেমন, ৩৪৫ সংখ্যায় ৩ মানে ৩০০, ৪ মানে ৪০, আর ৫ মানে ৫।",
        content: "প্রতিটি অঙ্কের মান নির্ভর করে সে কোন স্থানে আছে তার উপর।",
        visual: "place_value_345",
        highlight: "৩৪৫ = ৩০০ + ৪০ + ৫",
        emoji: "📌"
      },
      {
        type: "visual",
        heading: "স্থানের নাম",
        voice: "এখন চলো স্থানের নামগুলো মনে রাখি। একের স্থান, দশের স্থান, শতের স্থান, হাজারের স্থান।",
        content: "একটি সংখ্যার প্রতিটা স্থানের আলাদা নাম আছে:",
        placeTable: [
          { place: "কোটি", en: "Crore", value: "১,০০,০০,০০০" },
          { place: "দশ লক্ষ", en: "Ten Lakh", value: "১০,০০,০০০" },
          { place: "লক্ষ", en: "Lakh", value: "১,০০,০০০" },
          { place: "দশ হাজার", en: "Ten Thousand", value: "১০,০০০" },
          { place: "হাজার", en: "Thousand", value: "১,০০০" },
          { place: "শত", en: "Hundred", value: "১০০" },
          { place: "দশ", en: "Ten", value: "১০" },
          { place: "এক", en: "One", value: "১" }
        ],
        emoji: "🗺️"
      },
      {
        type: "example",
        heading: "উদাহরণ: ৪৫,৩২৮",
        voice: "চলো একটা উদাহরণ দেখি। ৪৫ হাজার ৩২৮। এখানে ৪ আছে দশ হাজারের স্থানে, তাই এর মান চল্লিশ হাজার।",
        content: "সংখ্যাটি ৪৫,৩২৮ — এর অঙ্কপাতন বিশ্লেষণ:",
        breakdown: [
          { digit: "৪", place: "দশ হাজার", value: "৪০,০০০", color: "#e74c3c" },
          { digit: "৫", place: "হাজার", value: "৫,০০০", color: "#e67e22" },
          { digit: "৩", place: "শত", value: "৩০০", color: "#f1c40f" },
          { digit: "২", place: "দশ", value: "২০", color: "#2ecc71" },
          { digit: "৮", place: "এক", value: "৮", color: "#3498db" }
        ],
        formula: "৪৫,৩২৮ = ৪০,০০০ + ৫,০০০ + ৩০০ + ২০ + ৮",
        emoji: "🔍"
      }
    ],
    practice: [
      {
        question: "৩৭৬ সংখ্যায় ৭-এর স্থানীয় মান কত?",
        voice: "প্রশ্নটি মনোযোগ দিয়ে পড়ো। ৩৭৬ সংখ্যায় ৭ কোন স্থানে আছে?",
        options: ["৭", "৭০", "৭০০", "০.৭"],
        answer: 1,
        explanation: "৩৭৬ সংখ্যায় ৭ দশের স্থানে আছে, তাই এর স্থানীয় মান = ৭ × ১০ = ৭০",
        emoji: "🎯"
      },
      {
        question: "কোন সংখ্যায় শতের স্থানে ৫ আছে?",
        voice: "এবার বলো, শতের স্থানে ৫ আছে কোন সংখ্যায়?",
        options: ["৫৬২", "৬৫২", "৫৬২", "২৫৬"],
        answer: 0,
        explanation: "৫৬২ সংখ্যায় ৫ শতের স্থানে আছে (৫৬২ = ৫০০ + ৬০ + ২)",
        emoji: "🔢"
      },
      {
        question: "৮,০৪২ সংখ্যাটির অঙ্কপাতন কোনটি সঠিক?",
        voice: "৮ হাজার ৪২ সংখ্যাটিকে ভাঙলে কী পাবো?",
        options: [
          "৮,০০০ + ৪০ + ২",
          "৮,০০০ + ৪০০ + ২",
          "৮০০ + ৪০ + ২",
          "৮,০০০ + ৪ + ২"
        ],
        answer: 0,
        explanation: "৮,০৪২ = ৮,০০০ + ০ + ৪০ + ২ = ৮,০০০ + ৪০ + ২ (শতের স্থানে ০ আছে)",
        emoji: "✅"
      }
    ]
  },

  "1.2": {
    id: "1.2",
    title: "দেশীয় সংখ্যাপঠন রীতি",
    titleEn: "Local Number Reading",
    mascot: "📜",
    mascotName: "বাংলা পণ্ডিত",
    color: "#e74c3c",
    intro: "বাংলায় সংখ্যা পড়তে শিখি!",
    steps: [
      {
        type: "intro",
        heading: "দেশীয় রীতি কী?",
        voice: "বাংলাদেশে এবং ভারতে আমরা যেভাবে সংখ্যা পড়ি সেটাই দেশীয় সংখ্যাপঠন রীতি।",
        content: "বাংলাদেশ ও ভারতে প্রচলিত সংখ্যা পড়ার নিয়মকে দেশীয় সংখ্যাপঠন রীতি বলে।",
        emoji: "🇧🇩"
      },
      {
        type: "explain",
        heading: "দেশীয় পদ্ধতির স্থানের নাম",
        voice: "দেশীয় পদ্ধতিতে আমরা এক, দশ, শত, হাজার, দশ হাজার, লক্ষ, দশ লক্ষ, কোটি — এভাবে পড়ি।",
        content: "দেশীয় পদ্ধতিতে স্থানের নাম:",
        highlight: "এক → দশ → শত → হাজার → দশ হাজার → লক্ষ → দশ লক্ষ → কোটি",
        note: "💡 দেশীয় পদ্ধতিতে কমা বসানো হয় হাজারের পর, তারপর দুই ঘর পর পর।",
        emoji: "📌"
      },
      {
        type: "example",
        heading: "উদাহরণ: ১,২৩,৪৫,৬৭৮",
        voice: "এই সংখ্যাটি পড়বো — এক কোটি তেইশ লক্ষ পঁয়তাল্লিশ হাজার ছয়শো আটাত্তর।",
        content: "দেশীয় পদ্ধতিতে কমার নিয়ম: প্রথমে হাজারের পর, তারপর দুই ঘর পরপর কমা।",
        breakdown: [
          { digit: "১", place: "কোটি", value: "১,০০,০০,০০০", color: "#9b59b6" },
          { digit: "২৩", place: "লক্ষ", value: "২৩,০০,০০০", color: "#e74c3c" },
          { digit: "৪৫", place: "হাজার", value: "৪৫,০০০", color: "#e67e22" },
          { digit: "৬৭৮", place: "শত-দশ-এক", value: "৬৭৮", color: "#27ae60" }
        ],
        formula: "পড়বো: এক কোটি তেইশ লক্ষ পঁয়তাল্লিশ হাজার ছয়শো আটাত্তর",
        emoji: "🔊"
      }
    ],
    practice: [
      {
        question: "৫,৬৭,৮৯০ সংখ্যাটিকে দেশীয় রীতিতে পড়লে কী হবে?",
        voice: "পাঁচ লক্ষ সাতষট্টি হাজার আটশো নব্বই — এটা কি সঠিক?",
        options: [
          "পাঁচ লক্ষ সাতষট্টি হাজার আটশো নব্বই",
          "ছাপান্ন লক্ষ সাত হাজার আটশো নব্বই",
          "পঞ্চান্ন লক্ষ সাতাশ হাজার",
          "পাঁচ কোটি সাত লক্ষ"
        ],
        answer: 0,
        explanation: "৫,৬৭,৮৯০ = ৫ লক্ষ + ৬৭ হাজার + ৮৯০ = পাঁচ লক্ষ সাতষট্টি হাজার আটশো নব্বই",
        emoji: "🎯"
      },
      {
        question: "দেশীয় পদ্ধতিতে ৪৫,৬৭,৮৯০ লেখার সঠিক কমার বিন্যাস কোনটি?",
        voice: "কমা কোথায় কোথায় বসবে বলো?",
        options: ["৪,৫৬,৭৮,৯০", "৪৫,৬৭,৮৯০", "৪৫৬,৭৮,৯০", "৪৫,৬৭৮,৯০"],
        answer: 1,
        explanation: "দেশীয় পদ্ধতিতে: প্রথম কমা হাজারের পর (৩ ঘর), তারপর ২ ঘর পর পর। সঠিক: ৪৫,৬৭,৮৯০",
        emoji: "✅"
      }
    ]
  },

  "1.3": {
    id: "1.3",
    title: "আন্তর্জাতিক গণনা পদ্ধতি",
    titleEn: "International Numeration",
    mascot: "🌍",
    mascotName: "বিশ্ব গণিতবিদ",
    color: "#27ae60",
    intro: "সারা বিশ্ব যেভাবে সংখ্যা পড়ে!",
    steps: [
      {
        type: "intro",
        heading: "আন্তর্জাতিক পদ্ধতি কী?",
        voice: "আমেরিকা, ইউরোপসহ পৃথিবীর বেশিরভাগ দেশে সংখ্যা যেভাবে পড়া হয় সেটাই আন্তর্জাতিক গণনা পদ্ধতি।",
        content: "আন্তর্জাতিক পদ্ধতিতে ones, tens, hundreds, thousands, millions, billions — এভাবে পড়া হয়।",
        emoji: "🌎"
      },
      {
        type: "explain",
        heading: "আন্তর্জাতিক স্থানের নাম",
        voice: "আন্তর্জাতিক পদ্ধতিতে প্রতি তিন ঘর পর পর কমা বসে। Ones, Thousands, Millions, Billions।",
        content: "আন্তর্জাতিক পদ্ধতিতে স্থানের নাম:",
        highlight: "Ones → Tens → Hundreds → Thousands → Millions → Billions",
        note: "💡 আন্তর্জাতিক পদ্ধতিতে প্রতি ৩ ঘর পর পর কমা বসে।",
        emoji: "🌐"
      },
      {
        type: "visual",
        heading: "তুলনামূলক সারণি",
        voice: "এখন দেখো দেশীয় ও আন্তর্জাতিক পদ্ধতিতে কীভাবে পার্থক্য আছে।",
        content: "দেশীয় বনাম আন্তর্জাতিক তুলনা:",
        placeTable: [
          { place: "দেশীয়", en: "আন্তর্জাতিক", value: "মান" },
          { place: "এক", en: "One", value: "১" },
          { place: "দশ", en: "Ten", value: "১০" },
          { place: "শত", en: "Hundred", value: "১০০" },
          { place: "হাজার", en: "Thousand", value: "১,০০০" },
          { place: "দশ হাজার", en: "Ten Thousand", value: "১০,০০০" },
          { place: "লক্ষ", en: "Hundred Thousand", value: "১,০০,০০০" },
          { place: "দশ লক্ষ", en: "Million", value: "১০,০০,০০০" },
          { place: "কোটি", en: "Ten Million", value: "১,০০,০০,০০০" }
        ],
        emoji: "⚖️"
      }
    ],
    practice: [
      {
        question: "আন্তর্জাতিক পদ্ধতিতে ৩,৪৫৬,৭৮৯ সংখ্যাটি কীভাবে পড়বো?",
        voice: "থ্রি মিলিয়ন ফোর হান্ড্রেড ফিফটি সিক্স থাউজেন্ড সেভেন হান্ড্রেড এইটি নাইন — এটা কি সঠিক?",
        options: [
          "Three million, four hundred fifty-six thousand, seven hundred eighty-nine",
          "Thirty-four lakh fifty-six thousand",
          "Three hundred forty-five million",
          "Three billion four million"
        ],
        answer: 0,
        explanation: "৩,৪৫৬,৭৮৯ = ৩ Million + ৪৫৬ Thousand + ৭৮৯ = Three million, four hundred fifty-six thousand, seven hundred eighty-nine",
        emoji: "🎯"
      },
      {
        question: "আন্তর্জাতিক পদ্ধতিতে ৫,০০০,০০০ মানে কত?",
        voice: "ফাইভ মিলিয়ন — বাংলায় এটা কত?",
        options: ["৫ হাজার", "৫ লক্ষ", "৫০ লক্ষ", "৫ কোটি"],
        answer: 2,
        explanation: "১ Million = ১০ লক্ষ, তাই ৫ Million = ৫০ লক্ষ",
        emoji: "✅"
      }
    ]
  },

  "1.4": {
    id: "1.4",
    title: "দেশীয় ও আন্তর্জাতিক গণনা রীতির পারস্পরিক সম্পর্ক",
    titleEn: "Local vs International System",
    mascot: "🤝",
    mascotName: "বন্ধু রোবট",
    color: "#9b59b6",
    intro: "চলো দেশীয় ও আন্তর্জাতিক নিয়মের মধ্যে বন্ধুত্ব করিয়ে দিই!",
    steps: [
      {
        type: "interactive",
        component: "SystemRelationGame",
        heading: "সম্পর্ক মেলাও",
        voice: "আন্তর্জাতিক পদ্ধতির সাথে দেশীয় পদ্ধতির সঠিক সম্পর্কটি খুঁজে নিয়ে মেলাও।",
        content: "দুটি পদ্ধতির মধ্যে কোনটির সাথে কোনটি মেলে তা ট্যাপ করে মেলাও!",
        emoji: "🤝"
      },
      {
        type: "explain",
        heading: "সম্পর্কটি কেমন?",
        voice: "দেশীয় পদ্ধতিতে আমরা লক্ষ, কোটি বলি। আর আন্তর্জাতিক পদ্ধতিতে মিলিয়ন, বিলিয়ন বলি। এদের মধ্যে একটা দারুণ সম্পর্ক আছে।",
        content: "১ মিলিয়ন মানে হলো ১০ লক্ষ। আর ১ বিলিয়ন মানে হলো ১০০ কোটি!",
        highlight: "১ মিলিয়ন = ১০ লক্ষ\n১ বিলিয়ন = ১০০ কোটি",
        emoji: "💡"
      }
    ],
    practice: [
      {
        question: "১০ লক্ষ সমান কত?",
        voice: "বলো তো, দশ লক্ষ সমান কত মিলিয়ন?",
        options: ["১ মিলিয়ন", "১০ মিলিয়ন", "১০০ হাজার", "১ বিলিয়ন"],
        answer: 0,
        explanation: "দেশীয় পদ্ধতির ১০ লক্ষ = আন্তর্জাতিক পদ্ধতির ১ মিলিয়ন।",
        emoji: "🎯"
      }
    ]
  }

};

// Chapter 1 ordered subchapter IDs
export const CHAPTER_1_ORDER = [
  "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7",
  "1.8", "1.9", "1.10", "1.11", "1.12", "1.13", "1.14",
  "1.15", "1.16", "1.17", "1.18", "1.19", "1.20", "1.21",
  "1.22", "1.23", "1.24"
];
