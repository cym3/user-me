import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { clientError, fail } from '../../../../core/infra/HttpErrorResponse'
import { prisma } from '../../infra/prisma/client'
import { AdminSaver } from '../contracts/AdminSaver'
import { findAdminByEmail } from './findAdminByEmail'

export const adminSaver: AdminSaver = ({ name, email, hash }) => {
  const newAdmin = pipe(
    email,
    findAdminByEmail,
    TE.chain(admin => {
      return TE.tryCatch(
        async () => {
          if (admin) {
            throw new Error(`Oops! Já existe uma conta com o email ${email}`)
          }

          return { name, email, hash }
        },

        userFoundError => clientError(userFoundError as Error)
      )
    }),

    TE.chain(() => TE.tryCatch(
      async () => {
        return prisma.meAdmin.create({
          data: {
            name,
            hash,
            email
          }
        })
      },

      (err) => {
        console.log(err)
        return fail(new Error('Oops! Erro. Por favor contacte suporte'))
      }
    ))
  )

  return newAdmin
}