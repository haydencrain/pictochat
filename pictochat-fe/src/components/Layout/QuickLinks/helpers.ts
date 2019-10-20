export interface Links {
  name: string;
  link: string;
  isActive: (pathname: string) => any;
}

export const normalLinks: Links[] = [
  { name: 'Threads', link: '/', isActive: pathname => pathname.startsWith('/discussion') || pathname === '/' },
  { name: 'Leaderboard', link: '/leaderboard', isActive: pathname => pathname.startsWith('/leaderboard') },
  { name: 'Register', link: '/register', isActive: pathname => pathname.startsWith('/register') }
];
