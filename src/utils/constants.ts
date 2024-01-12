export const CompanyRoles = Object.freeze({ 
  admin: 'admin',
  owner: 'owner',
  simpleUser: 'user'
});

export const CompanyInvitesStatuses = Object.freeze({ 
  approved: 'approved',
  aborted: 'aborted',
  pending: 'pending',
  declined: 'declined'
});

export const CompanyInviteTypes = Object.freeze({ 
  invite: 'invite',
  request: 'request',
});

export enum TokenErrors {
  expiredToken = 'TokenExpiredError'
}

export enum RedisConstants {
  quizResultKey = 'quiz_result'
}

export enum DataExportFileTypes {
  json = 'json',
  csv = 'csv'
}