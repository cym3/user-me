import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Middleware } from '../../../core/infra/Middleware'
import { clientError } from '../../../core/infra/HttpErrorResponse'
import { created } from '../../../core/infra/HttpSuccessResponse'
import { findUserById } from '../domain/entities/findUserById'
import { UserPerfilPropsValidate } from '../services/validate/userPerfilProps'

export const userPerfil: Middleware = (_httpRequest, httpBody) => {
  const { userId } = httpBody

  const httpResponse = pipe(
    userId,
    UserPerfilPropsValidate,
    E.mapLeft(error => clientError(new Error(error.message))),
    TE.fromEither,
    TE.chain((userId) => {
      return pipe(
        userId,
        findUserById,
        TE.chain(user => {
          return TE.tryCatch(
            async () => {
              if (!user) {
                throw new Error('Oops! Conta não encontrada')
              }

              return user
            },

            notFoundUserError => clientError(notFoundUserError as Error)
          )
        }),
        TE.map(user => {
          const { name, email } = user

          return created({ name, email })
        })
      )
    })
  )

  return httpResponse
}