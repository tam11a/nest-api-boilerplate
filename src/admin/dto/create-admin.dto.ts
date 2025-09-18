export class CreateAdminDto {
  email: string;
  phone: string;
  username: string;
  avatar?: string;
  passhash: string;
  passphrase: string;
  role: 'ADMIN' | 'HUB_MANAGER' | 'RIDER';
}
