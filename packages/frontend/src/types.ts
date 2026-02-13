export enum AppView {
  PROVISION = 'PROVISION',
  PULSE = 'PULSE',
  DECRYPTING = 'DECRYPTING',
}

export type UserRole = 'CREATOR' | 'BENEFICIARY'; // CREATOR = Tony, BENEFICIARY = Morgan

export interface NavItem {
  id: AppView;
  label: string;
  icon: string;
}