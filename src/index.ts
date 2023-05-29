import { z } from 'zod';
import fastify from 'fastify';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = fastify();

const movieSchema = z.object({
  image_url: z.string(),
  title: z.string(),
  genre: z.string(),
  age_group: z.string(),
  duration: z.number(),
  rating: z.number(),
  year: z.number(),
  description: z.string(),
});

type MovieSchemaType = z.infer<typeof movieSchema>;

app.get('/movie', async (req: any, res: any) => {
  const { search } = req.query as { search: string };

  const movies = await prisma.movie.findMany({
    where: {
      title: {
        contains: search == null ? '' : search,
      },
    },
  });

  res.send(movies);
});

app.post('/movie', async (req: any, res: any) => {
  const movieFromBody = movieSchema.parse(req.body) as MovieSchemaType;

  const createdMovie = await prisma.movie.create({
    data: movieFromBody,
  });

  res.status(201).send(createdMovie);
});

app.put('/movie/:id', async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  const movieFromBody = movieSchema.parse(req.body) as MovieSchemaType;

  await prisma.movie.update({
    where: { id },
    data: movieFromBody,
  });

  res.status(204).send();
});

app.delete('/movie/:id', async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  await prisma.movie.delete({
    where: { id },
  });

  res.status(204).send();
});

app.delete('/all/movie', async (req: any, res: any) => {
  await prisma.movie.deleteMany();
  res.status(204).send();
});

app.listen(
  {
    port: 8000,
  },
  (err: any, address: string) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
