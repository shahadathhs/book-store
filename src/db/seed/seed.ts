import { faker } from '@faker-js/faker';
import db from '../connect';
import { CategoryTable } from '../schemas/category';
import { NewUser, UsersTable } from '../schemas/user';
import { BookGenreTable, BookTable, NewBook, PublisherTable } from '../schemas';

export async function seed() {
  // Create random users
  const users: NewUser[] = [];
  for (let i = 0; i < 20; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
      role: 'user',
      status: faker.helpers.arrayElement(['active', 'inactive']),
    });
  }
  const createdUsers = await db.insert(UsersTable).values(users).returning();

  // Create categories
  const categories = Array.from({ length: 5 }, () => ({
    name: faker.commerce.department(),
  }));
  const createdCategories = await db
    .insert(CategoryTable)
    .values(categories)
    .returning();

  console.info(
    'Categories Seeded',
    createdCategories.map((c) => c.name),
  );

  // Create publishers
  const publishers = Array.from({ length: 8 }, () => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
  }));
  const createdPublishers = await db
    .insert(PublisherTable)
    .values(publishers)
    .returning();

  console.info(
    'Publishers Seeded',
    createdPublishers.map((p) => p.name),
  );

  // Create book genres
  const genres = Array.from({ length: 10 }, () => ({
    name: faker.word.sample(),
    description: faker.lorem.sentence(),
  }));
  const createdGenres = await db
    .insert(BookGenreTable)
    .values(genres)
    .returning();

  console.info(
    'Genres Seeded',
    createdGenres.map((g) => g.name),
  );

  // Create books
  const books: NewBook[] = [];
  for (let i = 0; i < 30; i++) {
    books.push({
      title: faker.lorem.words({ min: 2, max: 5 }),
      publisher: faker.helpers.arrayElement(createdPublishers).id,
      author: faker.helpers.arrayElement(createdUsers).id,
      summary: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
      pages: faker.number.int({ min: 50, max: 1000 }),
      genre: faker.helpers.arrayElement(createdGenres).id,
      publishedAt: faker.date.past(),
    });
  }
  const createdBooks = await db.insert(BookTable).values(books).returning();

  console.info(
    'Books Seeded',
    createdBooks.map((b) => b.title),
  );

  console.info('Seeding completed successfully');
}
