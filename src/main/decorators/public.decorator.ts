import { SetMetadata } from '@nestjs/common'

export const NO_AUTH = 'no_auth'
export const NoAuth = () => SetMetadata(NO_AUTH, true)
