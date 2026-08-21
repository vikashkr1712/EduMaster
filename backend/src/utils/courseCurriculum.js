const VIDEO_LIBRARY = {
  Development: [
    { videoId: 'UB1O30fR-EE', provider: 'Traversy Media' },
    { videoId: 'yfoY53QXEnI', provider: 'Traversy Media' },
    { videoId: 'hdI2bqOjy3c', provider: 'Traversy Media' },
    { videoId: 'w7ejDZ8SWv8', provider: 'Traversy Media' },
    { videoId: 'fBNz5xF-Kx4', provider: 'Traversy Media' },
  ],
  'Data Science': [
    { videoId: 'rfscVS0vtbw', provider: 'freeCodeCamp.org' },
    { videoId: 'ua-CiDNNj30', provider: 'freeCodeCamp.org' },
    { videoId: '7eh4d6sabA0', provider: 'Programming with Mosh' },
    { videoId: 'LHBE6Q9XlzI', provider: 'freeCodeCamp.org' },
  ],
  Design: [
    { videoId: 'c9Wg6Cb_YlU', provider: 'freeCodeCamp.org' },
    { videoId: 'FTFaQWZBqQ8', provider: 'AJ&Smart' },
    { videoId: 'YiLUYf4HDh4', provider: 'DesignCourse' },
  ],
  Business: [
    { videoId: 'ZoqgAy3h4OM', provider: 'Stanford' },
    { videoId: 'bNpx7gpSqbY', provider: 'TED' },
    { videoId: 'Fqch5OrUPvA', provider: 'Young Entrepreneurs Forum' },
  ],
  Marketing: [
    { videoId: 'nU-IIXBWlS4', provider: 'Simplilearn' },
    { videoId: 'MYE6T_gd7H0', provider: 'Simplilearn' },
    { videoId: 'DvwS7cV9GmQ', provider: 'Ahrefs' },
  ],
  'IT & Software': [
    { videoId: 'qiQR5rTSshw', provider: 'freeCodeCamp.org' },
    { videoId: 'SWYqp7iY_Tc', provider: 'Traversy Media' },
    { videoId: 'RGOj5yH7evk', provider: 'freeCodeCamp.org' },
  ],
  'Personal Development': [
    { videoId: 'pN34FNbOKXc', provider: 'TEDx Talks' },
    { videoId: 'arj7oStGLkU', provider: 'TED' },
    { videoId: 'TQMbvJNRpLE', provider: 'TEDx Talks' },
  ],
};

const TOPICS = {
  Development: [
    ['Foundations', 'How the Web Works', 'HTML Structure', 'CSS Fundamentals', 'Developer Tools'],
    ['Core Programming', 'Variables and Data Types', 'Functions and Scope', 'Objects and Arrays', 'Debugging Techniques'],
    ['Building Interfaces', 'Responsive Layouts', 'Components and State', 'Forms and Validation', 'Working with APIs'],
    ['Backend Essentials', 'Servers and Routing', 'Databases', 'Authentication', 'REST API Design'],
    ['Production Skills', 'Testing', 'Performance', 'Deployment', 'Capstone Project'],
  ],
  'Data Science': [
    ['Data Foundations', 'Python Setup', 'Data Types', 'NumPy Essentials', 'Pandas Essentials'],
    ['Preparing Data', 'Importing Datasets', 'Cleaning Data', 'Feature Engineering', 'Exploratory Analysis'],
    ['Visualizing Insights', 'Chart Selection', 'Matplotlib', 'Seaborn', 'Communicating Results'],
    ['Machine Learning', 'Model Workflow', 'Regression', 'Classification', 'Model Evaluation'],
    ['Applied Project', 'Problem Definition', 'Training a Model', 'Improving Results', 'Presenting the Project'],
  ],
  Design: [
    ['Design Foundations', 'Design Thinking', 'Visual Hierarchy', 'Color Systems', 'Typography'],
    ['User Experience', 'User Research', 'Personas', 'User Flows', 'Information Architecture'],
    ['Interface Design', 'Wireframes', 'Components', 'Responsive UI', 'Accessibility'],
    ['Prototyping', 'Figma Workflow', 'Interactive Prototypes', 'Usability Testing', 'Design Handoff'],
    ['Portfolio Project', 'Project Brief', 'Design System', 'Case Study', 'Portfolio Presentation'],
  ],
  Business: [
    ['Business Foundations', 'Finding an Opportunity', 'Customer Problems', 'Value Propositions', 'Business Models'],
    ['Market Strategy', 'Market Research', 'Competitive Analysis', 'Customer Segments', 'Positioning'],
    ['Planning and Finance', 'Business Planning', 'Revenue Models', 'Budgeting Basics', 'Funding Options'],
    ['Launching', 'Building a Brand', 'Go-to-Market Strategy', 'Sales Fundamentals', 'Operations'],
    ['Growing the Business', 'Metrics That Matter', 'Customer Retention', 'Team Building', 'Growth Plan'],
  ],
  Marketing: [
    ['Marketing Foundations', 'Customer Journey', 'Brand Positioning', 'Marketing Channels', 'Campaign Goals'],
    ['Content Marketing', 'Content Strategy', 'Copywriting', 'Editorial Planning', 'Content Distribution'],
    ['Digital Channels', 'Search Marketing', 'Social Media', 'Email Marketing', 'Paid Advertising'],
    ['Measurement', 'Marketing Analytics', 'Conversion Tracking', 'A/B Testing', 'Reporting'],
    ['Campaign Project', 'Campaign Brief', 'Creative Execution', 'Launch Plan', 'Optimization'],
  ],
  'IT & Software': [
    ['Computing Foundations', 'Computer Systems', 'Operating Systems', 'Networking Basics', 'Security Basics'],
    ['Tools and Workflow', 'Command Line', 'Version Control', 'Cloud Fundamentals', 'Automation'],
    ['Administration', 'Users and Permissions', 'Services', 'Monitoring', 'Troubleshooting'],
    ['Security', 'Threat Modeling', 'Access Control', 'Network Defense', 'Incident Response'],
    ['Applied Lab', 'Lab Setup', 'System Configuration', 'Testing', 'Documentation'],
  ],
  'Personal Development': [
    ['Self Management', 'Setting Clear Goals', 'Building Habits', 'Managing Energy', 'Staying Consistent'],
    ['Productivity', 'Prioritization', 'Deep Work', 'Time Blocking', 'Beating Procrastination'],
    ['Communication', 'Active Listening', 'Clear Writing', 'Presenting Ideas', 'Handling Feedback'],
    ['Career Growth', 'Skills Mapping', 'Personal Branding', 'Networking', 'Interview Readiness'],
    ['Personal Action Plan', 'Defining Success', 'Thirty-Day Plan', 'Tracking Growth', 'Next Steps'],
  ],
};

const RESOURCE_ROOTS = {
  Development: 'https://github.com/mdn/learning-area',
  'Data Science': 'https://github.com/ossu/data-science',
  Design: 'https://www.figma.com/resource-library/',
  Business: 'https://academy.hubspot.com/',
  Marketing: 'https://skillshop.withgoogle.com/',
  'IT & Software': 'https://github.com/ossu/computer-science',
  'Personal Development': 'https://ocw.mit.edu/search/?q=personal+development',
};

const slugPart = (value) => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export function buildCourseCurriculum(course) {
  const category = TOPICS[course.category] ? course.category : 'Development';
  const modules = TOPICS[category];
  const videos = VIDEO_LIBRARY[category];
  const sourceOffset = Number(course.sourceId || 0) % videos.length;
  const resourceRoot = RESOURCE_ROOTS[category];
  let lessonIndex = 0;

  return modules.map(([moduleTitle, ...lessonTitles], moduleIndex) => ({
    moduleId: `module-${moduleIndex + 1}`,
    title: moduleTitle,
    lessons: lessonTitles.map((title, index) => {
      const position = lessonIndex++;
      const lessonId = `lesson-${moduleIndex + 1}-${index + 1}-${slugPart(title)}`;
      const video = videos[(sourceOffset + position) % videos.length];
      return {
        lessonId,
        title,
        duration: `${12 + ((position * 7) % 17)}:${String((position * 13) % 60).padStart(2, '0')}`,
        videoId: video.videoId,
        videoProvider: video.provider,
        publishedAt: new Date(Date.UTC(2024, (moduleIndex + index) % 12, 10 + index)),
        resources: [
          {
            resourceId: `${lessonId}-guide`,
            title: `${title} Study Guide`,
            type: position % 2 === 0 ? 'PDF' : 'Slides',
            url: resourceRoot,
            size: 'Open resource',
          },
          {
            resourceId: `${lessonId}-source`,
            title: `${title} Examples`,
            type: category === 'Development' || category === 'Data Science' ? 'Source Code' : 'Assignment',
            url: resourceRoot,
            size: 'Practice material',
          },
          {
            resourceId: `${lessonId}-pack`,
            title: 'Course Practice Pack',
            type: 'ZIP',
            url: category === 'Development'
              ? 'https://github.com/mdn/learning-area/archive/refs/heads/main.zip'
              : resourceRoot,
            size: category === 'Development' ? 'Download' : 'Open resource',
          },
        ],
      };
    }),
  }));
}
