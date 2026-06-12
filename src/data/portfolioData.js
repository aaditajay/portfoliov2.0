export const portfolioData = {
  profile: {
    name: "Aadit Ajay",
    title: "Student, Project Manager, Developer & Community Builder",
    tagline: "CSE Student, PM Intern, Community Builder & Developer",
    monogram: "AA",
    bio: "Hey, I'm Aadit Ajay.\n\nI'm a Computer Science and Engineering student, project manager, community builder, and developer who enjoys turning ideas into reality.\n\nOver the past few years, I've found myself naturally stepping into roles where things need to be organized, led, or built. Whether it's managing large student communities, coordinating cross-functional teams, planning events, building software products, or designing systems that help people work better together, I enjoy bringing structure to chaos and momentum to ideas.\n\nCurrently, I serve as a Project Management Intern and Alappuzha District Lead at µLearn Foundation, Campus Lead of µLearn SBC, and Chairman of the IEEE Industry Applications Society at Sree Buddha College of Engineering.\n\nWhile technology forms the foundation of my work, I am equally passionate about leadership, strategy, communication, and community building. I believe great outcomes happen when strong systems, capable teams, and meaningful ideas come together.\n\nMy long-term goal is to build and lead impactful products, organizations, and communities that create real value for people.",
    email: "aaditajay@gmail.com",
    phone: "+91 95623 21151",
    linkedin: "https://linkedin.com/in/aaditajay",
    github: "https://github.com/aaditajay",
    location: "Kerala, India",
    resumeUrl: "/assets/resume.pdf"
  },
  
  experience: [
    {
      id: "tpm-intern",
      role: "Project Management Intern",
      organization: "µLearn Foundation",
      duration: "February 2026 – Present",
      category: "Internships",
      description: "Managing multiple concurrent projects using Agile methodologies while coordinating cross-functional teams, documentation systems, stakeholder communication, and execution workflows across the organization."
    },
    {
      id: "district-lead",
      role: "District Lead – Alappuzha",
      organization: "µLearn Foundation",
      duration: "August 2025 – Present",
      category: "Leadership",
      description: "Leading district-wide operations across multiple campuses by supporting campus leadership teams, maintaining alignment, tracking growth, and ensuring smooth execution of community initiatives."
    },
    {
      id: "campus-lead",
      role: "Campus Lead",
      organization: "µLearn SBC",
      duration: "March 2026 – Present",
      category: "Leadership",
      description: "Leading a 25-member executive committee and an active student community through strategic planning, event execution, volunteer management, and student engagement initiatives."
    },
    {
      id: "marketing-intern",
      role: "Digital Marketing Intern",
      organization: "µLearn Foundation",
      duration: "August 2025 – January 2026",
      category: "Internships",
      description: "Managed social media operations and content strategy, contributing to audience growth, engagement, and community visibility across multiple digital platforms."
    },
    {
      id: "campus-colead",
      role: "Campus Co-Lead",
      organization: "µLearn SBC",
      duration: "January 2025 – January 2026",
      category: "Leadership",
      description: "Co-led campus operations, initiated large-scale student engagement activities, and contributed to achieving one of the highest-performing µLearn campus communities in the country."
    },
    {
      id: "ieee-chair",
      role: "Chairman, Industry Applications Society",
      organization: "IEEE Student Branch SBCE",
      duration: "March 2026 – Present",
      category: "Leadership",
      description: "Leading industry-focused initiatives, workshops, collaborations, and professional development programs that bridge the gap between academics and industry."
    },
    {
      id: "ieee-mem-dev",
      role: "Membership Development Coordinator",
      organization: "IEEE Student Branch SBCE",
      duration: "February 2025 – February 2026",
      category: "Leadership",
      description: "Managed membership growth initiatives, cross-team collaborations, and engagement programs that strengthened participation and community involvement."
    },
    {
      id: "volunteer-tpm",
      role: "Strategic Lead",
      organization: "The Purple Movement",
      duration: "May 2025 – December 2025",
      category: "Volunteering",
      description: "Contributed to strategic planning and execution of large-scale learning experiences, community initiatives, and collaborative projects involving students, mentors, and industry leaders."
    }
  ],
  
  expertise: [
    {
      category: "Project Management",
      description: "Planning, coordinating, and delivering projects through structured execution, stakeholder communication, resource management, and Agile methodologies."
    },
    {
      category: "Community Building",
      description: "Creating high-energy communities where people learn, collaborate, contribute, and grow together around a shared mission."
    },
    {
      category: "Strategic Thinking",
      description: "Designing systems, roadmaps, and long-term approaches that transform ambitious ideas into sustainable outcomes."
    },
    {
      category: "Team Leadership",
      description: "Leading teams by creating clarity, ownership, accountability, and an environment where individuals can perform at their best."
    },
    {
      category: "Public Speaking",
      description: "Delivering engaging talks, workshops, and presentations that simplify complex ideas and inspire action."
    },
    {
      category: "Product Development",
      description: "Building digital products from concept to deployment by combining technical execution with user-centered thinking."
    },
    {
      category: "Event Operations",
      description: "Managing end-to-end event planning, logistics, volunteer coordination, and on-ground execution for impactful experiences."
    },
    {
      category: "Digital Growth",
      description: "Leveraging content strategy, branding, and audience engagement to scale communities and increase visibility."
    }
  ],
  
  projects: [
    {
      id: "dark-netra",
      name: "Dark Netra",
      tagline: "Malicious URL Detection System",
      category: "Cybersecurity / ML",
      github: "https://github.com/aaditajay/dark-netra",
      website: "",
      techStack: ["Python", "FastAPI", "XGBoost", "REST API", "Google Safe Browsing API", "VirusTotal API"],
      description: "Dark Netra is a hybrid cybersecurity platform designed to identify malicious URLs through a combination of machine learning and real-time threat intelligence.\n\nThe system combines an XGBoost classification model with Google Safe Browsing and VirusTotal APIs to classify URLs as Safe, Suspicious, or Malicious with an accuracy of over 90%.\n\nA multi-layer feature extraction engine analyzes more than 20 URL and webpage characteristics, including subdomains, redirects, JavaScript behavior, phishing indicators, and HTML structure. These signals are then combined with external threat intelligence feeds through a weighted scoring mechanism.\n\nThe backend was built using a modular FastAPI microservice architecture capable of performing real-time URL analysis while maintaining response times below 500 milliseconds."
    },
    {
      id: "zindasic",
      name: "Zindasic",
      tagline: "Offline Flutter Music Player",
      category: "Mobile App / Flutter",
      github: "https://github.com/aaditajay/zindasic",
      website: "",
      techStack: ["Flutter", "Dart", "Android", "Custom UI System"],
      description: "Zindasic is a fully offline Android music player built around a simple but personal idea: \"Favourites' Favourites\" — a collection of favorite songs from favorite people.\n\nThe application features local audio playback, playlist persistence, dynamic queue management, and a highly customized user experience designed specifically for music discovery through personal connections rather than algorithms.\n\nA custom liquid-glass design system was created using more than 10 reusable animated components featuring physics-based transitions, modular architecture, and adaptive theming. This system significantly improved development speed while maintaining visual consistency across the application."
    },
    {
      id: "being-basheer",
      name: "Being Basheer",
      tagline: "AI Poetry Generation Platform",
      category: "Web App / Generative AI",
      github: "https://github.com/aaditajay/being-basheer",
      website: "",
      techStack: ["Next.js", "Supabase", "Groq LLM", "PostgreSQL", "OTP Authentication"],
      description: "Being Basheer is an AI-powered tribute platform inspired by the legendary Malayalam writer Vaikom Muhammad Basheer.\n\nUsers can generate poetry in English, Malayalam, and Hindi using Groq LLM while sharing their creations through a public community wall. The platform combines literature, creativity, and artificial intelligence into a collaborative writing experience.\n\nThe application includes OTP-based phone authentication, real-time public poem publishing, and a fully responsive interface optimized for mobile devices. A serverless backend powered by Supabase handles user management, poem storage, and moderation through row-level security policies."
    },
    {
      id: "pursuit-of-hiring",
      name: "The Pursuit of Hiring",
      tagline: "AI Mock Interview Platform",
      category: "Full-Stack Web App",
      github: "https://github.com/aaditajay/pursuit-hiring",
      website: "",
      techStack: ["React.js", "FastAPI", "Python", "Groq LLM", "Three.js"],
      description: "The Pursuit of Hiring is a full-stack AI interview preparation platform designed to simulate realistic interview experiences.\n\nUsers can upload resumes, receive dynamically generated interview questions, answer them in a structured session, and receive detailed performance evaluations. Questions are generated adaptively using Groq LLM, while answers are scored across multiple evaluation parameters.\n\nThe platform also includes difficulty-based interview modes, structured feedback summaries, resume parsing, and immersive visual elements powered by Three.js. The system consistently delivers AI-generated responses in under two seconds."
    },
    {
      id: "njan-aara",
      name: "ഞാൻ ആരാ (Njan Aara)",
      tagline: "AI Career Discovery Platform",
      category: "Serverless Web App",
      github: "https://github.com/aaditajay/njan-aara",
      website: "",
      techStack: ["React.js", "Groq LLM", "Vercel", "Serverless Architecture"],
      description: "Njan Aara is an AI-powered career discovery platform designed to help students explore potential career paths through guided self-reflection.\n\nThe application uses a six-step interactive experience where users answer a series of carefully designed questions through a chip-based interface. Based on these responses, Groq's LLM generates personalized career recommendations across more than ten professional domains.\n\nThe platform is fully serverless, deployed on Vercel, and optimized for speed, accessibility, and mobile responsiveness while maintaining zero backend infrastructure costs."
    }
  ],

  achievements: [
    { title: "Project Management Intern", organization: "µLearn Foundation", year: "2026" },
    { title: "District Lead – Alappuzha", organization: "µLearn Foundation", year: "2025" },
    { title: "Chairman, IAS", organization: "IEEE SB CE", year: "2026" }
  ]
};
