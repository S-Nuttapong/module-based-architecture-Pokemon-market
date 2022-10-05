import { GetStaticPaths, GetStaticProps } from 'next'

export type InferGetStaticPaths<T extends GetStaticPaths> = Awaited<ReturnType<T>>["paths"][number];

export type GetStaticPropsResult<T extends GetStaticProps> = Awaited<ReturnType<T>>