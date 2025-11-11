// Responsive utility classes for the hospital app
export const responsiveClasses = {
  // Container
  container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  
  // Grid layouts
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",
  grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
  grid4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6",
  
  // Cards
  card: "bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow",
  statCard: "bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4",
  
  // Buttons
  btnPrimary: "w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold",
  btnSecondary: "w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold",
  
  // Forms
  input: "w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
  select: "w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
  
  // Text
  heading: "text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800",
  subheading: "text-xl md:text-2xl font-bold text-gray-800",
  
  // Navigation
  navbar: "bg-white shadow-md sticky top-0 z-50",
  navContent: "max-w-7xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center",
  
  // Mobile menu
  mobileMenuBtn: "md:hidden p-2 rounded-lg hover:bg-gray-100",
  desktopOnly: "hidden md:flex",
  mobileOnly: "md:hidden",
};

// Breakpoint helper
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
