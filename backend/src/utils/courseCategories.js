export const COURSE_CATEGORIES = Object.freeze([
  'Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'IT & Software',
  'Personal Development',
]);

const categoryByKey = new Map(COURSE_CATEGORIES.map((category) => [category.toLocaleLowerCase('en'), category]));

export const canonicalizeCourseCategory = (value) => (
  categoryByKey.get(String(value ?? '').trim().toLocaleLowerCase('en')) || null
);
