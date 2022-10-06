import { GetStaticPaths, GetStaticProps } from 'next'

/**
 * type helper for getStaticProps such that it can infer correct path which is support to be unpack array of paths, which Next.js's GetStaticPathResult fail to do for us
 */
export type InferGetStaticPaths<T extends GetStaticPaths> = Awaited<ReturnType<T>>["paths"][number];


/**
 * simple implementation for static props infer that actually work
 * @note this does not take other args into account but "props", so you may consider sticking Next.js interStatic if that works for you
 * @return correct props type from getStaticProps,
 */
export type GetStaticPropsResult<T extends (...params: any[]) => Promise<{ props: any }>> = Awaited<ReturnType<T>>['props']