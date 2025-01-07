import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'isAdmin';
export const Roles = (isAdmin: boolean) => SetMetadata(IS_ADMIN_KEY, isAdmin);
