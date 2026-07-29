// EduMaster course catalog — 84 courses across 7 categories × 3 levels
// Each category: 12 courses (4 Beginner, 4 Intermediate, 4 Advanced), mix of Free/Paid.

let nextId = 1

function course(title, category, level, priceType, rating, students, instructor, price, oldPrice, imageType) {
  return {
    id: nextId++,
    title,
    category,
    level,
    priceType,
    rating,
    students,
    instructor,
    price,
    oldPrice,
    imageType,
  }
}

export const courses = [
  /* ------------------------- Development ------------------------- */
  course('Full Stack Web Development Bootcamp', 'Development', 'Beginner', 'Paid', 4.8, '12,500+', 'John Doe', 4999, 8999, 'development'),
  course('HTML & CSS Crash Course for Absolute Beginners', 'Development', 'Beginner', 'Free', 4.5, '21,300+', 'Priya Sharma', 0, 0, 'development'),
  course('JavaScript Fundamentals: From Zero to Hero', 'Development', 'Beginner', 'Paid', 4.7, '18,200+', 'Alex Turner', 2999, 5999, 'development'),
  course('Git & GitHub for Beginners', 'Development', 'Beginner', 'Free', 4.4, '9,800+', 'Sarah Miller', 0, 0, 'productivity'),
  course('React.js – The Complete Guide (2024)', 'Development', 'Intermediate', 'Paid', 4.8, '15,300+', 'Sarah Miller', 4499, 8999, 'react'),
  course('Node.js & Express: Build REST APIs', 'Development', 'Intermediate', 'Paid', 4.6, '11,400+', 'David Kim', 3499, 6999, 'development'),
  course('TypeScript for React Developers', 'Development', 'Intermediate', 'Paid', 4.7, '8,600+', 'Emma Wilson', 2999, 5499, 'react'),
  course('Responsive Web Design Masterclass', 'Development', 'Intermediate', 'Free', 4.5, '13,700+', 'Priya Sharma', 0, 0, 'design'),
  course('Advanced React Patterns & Performance', 'Development', 'Advanced', 'Paid', 4.9, '6,200+', 'Sarah Miller', 5999, 11999, 'react'),
  course('Microservices Architecture with Node.js', 'Development', 'Advanced', 'Paid', 4.8, '4,900+', 'David Kim', 6499, 12999, 'development'),
  course('Next.js Full Stack Production Apps', 'Development', 'Advanced', 'Paid', 4.8, '7,100+', 'Alex Turner', 5499, 10999, 'react'),
  course('Web Security & Performance Optimization', 'Development', 'Advanced', 'Paid', 4.7, '3,800+', 'Emma Wilson', 4999, 9999, 'development'),

  /* ------------------------- Data Science ------------------------- */
  course('Data Science & Machine Learning with Python', 'Data Science', 'Beginner', 'Paid', 4.7, '8,750+', 'Jane Smith', 3999, 7999, 'datascience'),
  course('Statistics for Data Science: The Basics', 'Data Science', 'Beginner', 'Free', 4.4, '14,600+', 'Robert Taylor', 0, 0, 'datascience'),
  course('SQL for Data Analysis: Complete Course', 'Data Science', 'Beginner', 'Paid', 4.6, '16,900+', 'Anita Desai', 2499, 4999, 'datascience'),
  course('Excel to Python: Data Analysis for Beginners', 'Data Science', 'Beginner', 'Free', 4.3, '19,400+', 'Jane Smith', 0, 0, 'python'),
  course('Pandas & NumPy for Data Wrangling', 'Data Science', 'Intermediate', 'Paid', 4.7, '9,300+', 'Robert Taylor', 3499, 6999, 'python'),
  course('Data Visualization with Matplotlib & Seaborn', 'Data Science', 'Intermediate', 'Paid', 4.6, '7,800+', 'Anita Desai', 2999, 5999, 'datascience'),
  course('Machine Learning A–Z: Hands-On Models', 'Data Science', 'Intermediate', 'Paid', 4.8, '10,200+', 'Jane Smith', 4499, 8999, 'ai'),
  course('Power BI & Tableau Dashboards', 'Data Science', 'Intermediate', 'Paid', 4.5, '6,400+', 'Vikram Rao', 2999, 5499, 'datascience'),
  course('Deep Learning A–Z™ Hands-On Python', 'Data Science', 'Advanced', 'Paid', 4.8, '11,800+', 'Robert Taylor', 4999, 9999, 'ai'),
  course('Natural Language Processing with Transformers', 'Data Science', 'Advanced', 'Paid', 4.9, '5,300+', 'Jane Smith', 6499, 12999, 'ai'),
  course('MLOps: Deploy Models to Production', 'Data Science', 'Advanced', 'Paid', 4.7, '3,600+', 'Vikram Rao', 5999, 11999, 'ai'),
  course('Computer Vision with PyTorch', 'Data Science', 'Advanced', 'Free', 4.6, '4,700+', 'Anita Desai', 0, 0, 'ai'),

  /* ------------------------- Design ------------------------- */
  course('UI/UX Design Masterclass for Beginners', 'Design', 'Beginner', 'Paid', 4.9, '6,300+', 'Mike Johnson', 2999, 5999, 'design'),
  course('Figma from Scratch: Design Your First App', 'Design', 'Beginner', 'Free', 4.6, '12,100+', 'Lisa Chen', 0, 0, 'design'),
  course('Graphic Design Fundamentals', 'Design', 'Beginner', 'Paid', 4.5, '9,700+', 'Carlos Rivera', 2499, 4999, 'design'),
  course('Color Theory & Typography Essentials', 'Design', 'Beginner', 'Free', 4.4, '8,200+', 'Mike Johnson', 0, 0, 'design'),
  course('Design Systems with Figma', 'Design', 'Intermediate', 'Paid', 4.8, '5,600+', 'Lisa Chen', 3999, 7999, 'design'),
  course('Web & Mobile App Design Portfolio Course', 'Design', 'Intermediate', 'Paid', 4.7, '7,400+', 'Mike Johnson', 3499, 6999, 'design'),
  course('Motion Design with After Effects', 'Design', 'Intermediate', 'Paid', 4.6, '4,800+', 'Carlos Rivera', 3999, 7499, 'design'),
  course('UX Research & Usability Testing', 'Design', 'Intermediate', 'Free', 4.5, '5,900+', 'Lisa Chen', 0, 0, 'design'),
  course('Advanced Prototyping & Interaction Design', 'Design', 'Advanced', 'Paid', 4.8, '3,400+', 'Lisa Chen', 4999, 9999, 'design'),
  course('Design Leadership & Team Management', 'Design', 'Advanced', 'Paid', 4.7, '2,800+', 'Mike Johnson', 5499, 10999, 'business'),
  course('3D Design for Product Designers', 'Design', 'Advanced', 'Paid', 4.6, '3,100+', 'Carlos Rivera', 5999, 11999, 'design'),
  course('Accessibility-First Design (WCAG 2.2)', 'Design', 'Advanced', 'Paid', 4.8, '2,500+', 'Lisa Chen', 4499, 8999, 'design'),

  /* ------------------------- Business ------------------------- */
  course('Business Analytics for Beginners', 'Business', 'Beginner', 'Paid', 4.6, '7,100+', 'David Wilson', 2999, 5999, 'business'),
  course('Entrepreneurship 101: Start Your Business', 'Business', 'Beginner', 'Free', 4.5, '15,800+', 'Rachel Green', 0, 0, 'business'),
  course('Financial Literacy & Personal Finance', 'Business', 'Beginner', 'Paid', 4.7, '11,200+', 'Arjun Mehta', 1999, 3999, 'business'),
  course('Project Management Fundamentals', 'Business', 'Beginner', 'Free', 4.4, '13,500+', 'David Wilson', 0, 0, 'productivity'),
  course('Product Management: From Idea to Launch', 'Business', 'Intermediate', 'Paid', 4.8, '8,900+', 'Rachel Green', 4499, 8999, 'business'),
  course('Agile & Scrum Certification Prep', 'Business', 'Intermediate', 'Paid', 4.7, '9,600+', 'Arjun Mehta', 3499, 6999, 'productivity'),
  course('Business Strategy & Competitive Analysis', 'Business', 'Intermediate', 'Paid', 4.6, '5,400+', 'David Wilson', 3999, 7999, 'business'),
  course('Financial Modeling in Excel', 'Business', 'Intermediate', 'Paid', 4.7, '6,800+', 'Arjun Mehta', 2999, 5999, 'business'),
  course('Executive Leadership & Decision Making', 'Business', 'Advanced', 'Paid', 4.8, '3,200+', 'Rachel Green', 6999, 13999, 'business'),
  course('Mergers, Acquisitions & Valuation', 'Business', 'Advanced', 'Paid', 4.7, '2,100+', 'Arjun Mehta', 7499, 14999, 'business'),
  course('Scaling Startups: Growth Playbook', 'Business', 'Advanced', 'Free', 4.6, '4,300+', 'Rachel Green', 0, 0, 'business'),
  course('Corporate Innovation & Design Thinking', 'Business', 'Advanced', 'Paid', 4.5, '2,700+', 'David Wilson', 5999, 11999, 'business'),

  /* ------------------------- Marketing ------------------------- */
  course('Digital Marketing Complete Course', 'Marketing', 'Beginner', 'Paid', 4.6, '9,200+', 'Emily Davis', 3499, 6999, 'marketing'),
  course('Social Media Marketing for Beginners', 'Marketing', 'Beginner', 'Free', 4.4, '17,600+', 'Tom Baker', 0, 0, 'marketing'),
  course('Content Writing & Copywriting Basics', 'Marketing', 'Beginner', 'Paid', 4.5, '10,400+', 'Nina Patel', 1999, 3999, 'marketing'),
  course('Email Marketing: Build Your First Funnel', 'Marketing', 'Beginner', 'Free', 4.3, '8,700+', 'Emily Davis', 0, 0, 'marketing'),
  course('SEO Mastery: Rank #1 on Google', 'Marketing', 'Intermediate', 'Paid', 4.8, '11,900+', 'Tom Baker', 3999, 7999, 'marketing'),
  course('Google Ads & PPC Campaigns', 'Marketing', 'Intermediate', 'Paid', 4.6, '7,300+', 'Emily Davis', 3499, 6999, 'marketing'),
  course('Brand Strategy & Storytelling', 'Marketing', 'Intermediate', 'Paid', 4.7, '5,100+', 'Nina Patel', 2999, 5999, 'marketing'),
  course('Influencer & Affiliate Marketing', 'Marketing', 'Intermediate', 'Free', 4.4, '6,500+', 'Tom Baker', 0, 0, 'marketing'),
  course('Growth Hacking: Advanced Acquisition', 'Marketing', 'Advanced', 'Paid', 4.8, '3,900+', 'Emily Davis', 5499, 10999, 'marketing'),
  course('Marketing Analytics & Attribution Models', 'Marketing', 'Advanced', 'Paid', 4.7, '2,900+', 'Tom Baker', 4999, 9999, 'datascience'),
  course('CRO: Conversion Rate Optimization Pro', 'Marketing', 'Advanced', 'Paid', 4.6, '2,400+', 'Nina Patel', 4499, 8999, 'marketing'),
  course('Marketing Automation at Scale', 'Marketing', 'Advanced', 'Paid', 4.5, '2,200+', 'Emily Davis', 5999, 11999, 'marketing'),

  /* ------------------------- IT & Software ------------------------- */
  course('Python Programming Bootcamp', 'IT & Software', 'Beginner', 'Paid', 4.7, '10,500+', 'James Brown', 3499, 6999, 'python'),
  course('Computer Fundamentals & Networking Basics', 'IT & Software', 'Beginner', 'Free', 4.3, '18,900+', 'Maria Garcia', 0, 0, 'productivity'),
  course('Linux Command Line for Beginners', 'IT & Software', 'Beginner', 'Paid', 4.6, '9,100+', 'Ahmed Hassan', 2499, 4999, 'development'),
  course('Cybersecurity Essentials', 'IT & Software', 'Beginner', 'Free', 4.5, '12,300+', 'James Brown', 0, 0, 'ai'),
  course('AWS Certified Cloud Practitioner Prep', 'IT & Software', 'Intermediate', 'Paid', 4.8, '13,600+', 'Maria Garcia', 4499, 8999, 'development'),
  course('Docker & Kubernetes: Hands-On DevOps', 'IT & Software', 'Intermediate', 'Paid', 4.7, '8,800+', 'Ahmed Hassan', 4999, 9999, 'development'),
  course('Ethical Hacking: Penetration Testing Lab', 'IT & Software', 'Intermediate', 'Paid', 4.7, '7,600+', 'James Brown', 4499, 8999, 'ai'),
  course('Python Automation: Scripts That Save Hours', 'IT & Software', 'Intermediate', 'Free', 4.6, '11,700+', 'Maria Garcia', 0, 0, 'python'),
  course('AWS Solutions Architect Professional', 'IT & Software', 'Advanced', 'Paid', 4.9, '5,800+', 'Maria Garcia', 6999, 13999, 'development'),
  course('Site Reliability Engineering (SRE) Deep Dive', 'IT & Software', 'Advanced', 'Paid', 4.7, '3,300+', 'Ahmed Hassan', 6499, 12999, 'development'),
  course('Advanced Python: Async, Typing & Internals', 'IT & Software', 'Advanced', 'Paid', 4.8, '4,100+', 'James Brown', 5499, 10999, 'python'),
  course('Zero Trust Security Architecture', 'IT & Software', 'Advanced', 'Paid', 4.6, '2,600+', 'Ahmed Hassan', 5999, 11999, 'ai'),

  /* ------------------------- Personal Development ------------------------- */
  course('Time Management Mastery Course', 'Personal Development', 'Beginner', 'Paid', 4.5, '5,600+', 'Olivia White', 1499, 2999, 'productivity'),
  course('Public Speaking: Speak with Confidence', 'Personal Development', 'Beginner', 'Free', 4.6, '14,200+', 'Daniel Lee', 0, 0, 'productivity'),
  course('Habits That Stick: Build Your Routine', 'Personal Development', 'Beginner', 'Paid', 4.4, '8,400+', 'Sophie Turner', 1299, 2599, 'productivity'),
  course('Mindfulness & Stress Management', 'Personal Development', 'Beginner', 'Free', 4.5, '11,600+', 'Olivia White', 0, 0, 'productivity'),
  course('Emotional Intelligence at Work', 'Personal Development', 'Intermediate', 'Paid', 4.7, '6,900+', 'Daniel Lee', 2499, 4999, 'productivity'),
  course('Negotiation Skills: Get What You Deserve', 'Personal Development', 'Intermediate', 'Paid', 4.6, '5,200+', 'Sophie Turner', 2999, 5999, 'business'),
  course('Memory & Speed Learning Techniques', 'Personal Development', 'Intermediate', 'Paid', 4.5, '4,600+', 'Olivia White', 1999, 3999, 'productivity'),
  course('Personal Branding & LinkedIn Growth', 'Personal Development', 'Intermediate', 'Free', 4.4, '7,800+', 'Daniel Lee', 0, 0, 'marketing'),
  course('Executive Presence & Influence', 'Personal Development', 'Advanced', 'Paid', 4.7, '2,300+', 'Sophie Turner', 4499, 8999, 'business'),
  course('Coaching & Mentoring Certification', 'Personal Development', 'Advanced', 'Paid', 4.8, '3,000+', 'Daniel Lee', 4999, 9999, 'productivity'),
  course('Peak Performance Psychology', 'Personal Development', 'Advanced', 'Paid', 4.6, '2,700+', 'Olivia White', 3999, 7999, 'productivity'),
  course('The Art of Deep Work & Focus', 'Personal Development', 'Advanced', 'Paid', 4.7, '3,500+', 'Sophie Turner', 3499, 6999, 'productivity'),
]

export const categories = [
  'All Categories',
  'Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'IT & Software',
  'Personal Development',
]

export const levels = ['Beginner', 'Intermediate', 'Advanced']

export const priceTypes = ['Free', 'Paid']

export const ratingOptions = [
  { label: '(4.5 & above)', value: 4.5, stars: 5 },
  { label: '(4.0 & above)', value: 4.0, stars: 4 },
  { label: '(3.5 & above)', value: 3.5, stars: 3 },
  { label: '(3.0 & above)', value: 3.0, stars: 2 },
]

export const sortOptions = [
  'Popular',
  'Newest',
  'Highest Rated',
  'Price: Low to High',
  'Price: High to Low',
]

export const COURSES_PER_PAGE = 9
