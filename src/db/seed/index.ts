import { faker } from '@faker-js/faker';
import db from '../connect';
import {
  BookGenreTable,
  BookStatus,
  BookTable,
  NewBook,
  PublisherTable,
} from '../schemas/book';
import { NewUser, UserRole, UserStatus, UsersTable } from '../schemas/user';
import { CategoryTable } from '../schemas/category';

async function seed() {
  // Clear existing data
  await db.delete(BookTable);
  await db.delete(BookGenreTable);
  await db.delete(PublisherTable);
  await db.delete(UsersTable);
  await db.delete(CategoryTable);

  // Create users
  const users: NewUser[] = [];
  for (let i = 0; i < 20; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
      role: i === 0 ? 'admin' : 'user',
      status: faker.helpers.arrayElement(['active', 'inactive']),
    });
  }
  const createdUsers = await db.insert(UsersTable).values(users).returning();

  // Create categories
  const categories = Array.from({ length: 5 }, () => ({
    name: faker.commerce.department(),
  }));
  await db.insert(CategoryTable).values(categories);

  // Create publishers
  const publishers = Array.from({ length: 8 }, () => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
  }));
  const createdPublishers = await db
    .insert(PublisherTable)
    .values(publishers)
    .returning();

  // Create book genres
  const genres = Array.from({ length: 10 }, () => ({
    name: faker.word.sample(),
    description: faker.lorem.sentence(),
  }));
  const createdGenres = await db
    .insert(BookGenreTable)
    .values(genres)
    .returning();

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
  await db.insert(BookTable).values(books);

  console.log('Seed completed successfully');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
