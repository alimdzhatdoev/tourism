import {FC, Fragment, PropsWithChildren, ReactNode, Suspense} from 'react'
import {Route, Routes} from 'react-router-dom'
import {TRoute} from 'types-common'
import {PrivateRoute} from '../PrivateRoute/PrivateRoute'
import {ScrollWrapper} from '../ScrollWrapper/ScrollWrapper'

interface Props {
  routes: Array<TRoute>
  PreloaderComponent?: ReactNode
  Layout?: FC<PropsWithChildren>
}

export const RoutesFactory: FC<Props> = ({
  routes,
  PreloaderComponent = null,
  Layout = Fragment,
}) => {
  if (!routes.length) {
    console.warn(
      'Error in RoutesFactory - routes prop must be an non-empty array',
    )
    return null
  }

  return (
    <ScrollWrapper>
      <Routes>
        {routes.map(({Component, path, isPrivate, redirectPath}) => {
          const arrayPath: string[] = Array.isArray(path) ? path : [path]
          return arrayPath.map(p => (
            <Route
              key={p}
              path={p}
              element={
                <Suspense fallback={PreloaderComponent}>
                  <Layout>
                    {isPrivate ? (
                      <PrivateRoute redirectPath={redirectPath}>
                        <Component />
                      </PrivateRoute>
                    ) : (
                      <Component />
                    )}
                  </Layout>
                </Suspense>
              }
            />
          ))
        })}
      </Routes>
    </ScrollWrapper>
  )
}
