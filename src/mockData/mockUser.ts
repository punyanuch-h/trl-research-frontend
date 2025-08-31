// import bcrypt from 'bcryptjs';
import type { UserItem } from '../types/user';

// const mockUser = async () => {
//   const existing = JSON.parse(localStorage.getItem('users') || '[]') as UserItem[];
//   const existingEmails = existing.map((u) => u.email);

//   const mockUsers: Omit<UserItem, 'password'>[] = [
//     {
//       username: 'a0001',
//       firstname: 'Admin',
//       lastname: 'Admin',
//       email: 'admin@admin.com',
//       phone: '0811111111',
//       role: 'admin',
//       organization: 'Faculty of Medicine',
//       joinedDate: '2023-01-01',
//     },
//     {
//       username: 'p0001',
//       firstname: 'Alice',
//       lastname: 'Smith',
//       email: 'alice@professor.com',
//       phone: '0811111111',
//       role: 'professor',
//       organization: 'Faculty of Medicine',
//       joinedDate: '2023-01-01',
//     },
//     {
//       username: 'n0001',
//       firstname: 'Bob',
//       lastname: 'Jones',
//       email: 'bob@nurse.org',
//       phone: '0822222222',
//       role: 'nurse',
//       organization: 'Nursing Department',
//       joinedDate: '2023-02-15',
//     },
//     {
//       username: 'r0001',
//       firstname: 'Carol',
//       lastname: 'Lee',
//       email: 'carol@research.com',
//       phone: '0833333333',
//       role: 'researcher',
//       organization: 'Research Center',
//       joinedDate: '2023-03-10',
//     },
//     {
//       username: 's0001',
//       firstname: 'Test',
//       lastname: 'User',
//       email: 'test@example.com',
//       phone: '0844444444',
//       role: 'student',
//       organization: 'Medical School',
//       joinedDate: '2023-04-20',
//     },
//   ];

//   const passwordHash = await bcrypt.hash('password123', 10);

//   const newUsers: UserItem[] = mockUsers
//     .filter((user) => !existingEmails.includes(user.email))
//     .map((user) => ({ ...user, password: passwordHash }));

//   if (newUsers.length > 0) {
//     const updated = [...existing, ...newUsers];
//     localStorage.setItem('users', JSON.stringify(updated));
//     console.log('✅ Mock users added', newUsers.map((u) => u.email).join(', '));
//   }
// };
const mockUser: UserItem[] = [
    {
      username: 'a0001',
      firstname: 'Admin',
      lastname: 'Admin',
      email: 'admin@admin.com',
      password: 'password123',
      phone: '0811111111',
      role: 'admin',
      organization: 'Faculty of Medicine',
      joinedDate: '2023-01-01',
    },
    {
      username: 'p0001',
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice@professor.com',
      password: 'password123',
      phone: '0811111111',
      role: 'professor',
      organization: 'Faculty of Medicine',
      joinedDate: '2023-01-01',
    },
    {
      username: 'n0001',
      firstname: 'Bob',
      lastname: 'Jones',
      email: 'bob@nurse.org',
      password: 'password123',
      phone: '0822222222',
      role: 'nurse',
      organization: 'Nursing Department',
      joinedDate: '2023-02-15',
    },
    {
      username: 'r0001',
      firstname: 'Carol',
      lastname: 'Lee',
      email: 'carol@research.com',
      password: 'password123',
      phone: '0833333333',
      role: 'researcher',
      organization: 'Research Center',
      joinedDate: '2023-03-10',
    },
    {
      username: 's0001',
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'password123',
      phone: '0844444444',
      role: 'student',
      organization: 'Medical School',
      joinedDate: '2023-04-20',
    },
  ];
export default mockUser;