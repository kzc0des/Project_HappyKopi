export interface UserDto {
  id: string;
  username: string;
  role: 'Admin' | 'Barista';
  isActive: boolean;
}