// config/seed.js

const { faker } = require('@faker-js/faker');
const prisma = require('./prismaPool');
const bcrypt = require('bcrypt');

// faker data for users
const users = [];
for (let i = 0; i < 20; i++) {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const username = faker.internet.username({
    firstName: firstname,
    lastName: lastname,
  });
  const email = faker.internet.email({
    firstName: firstname,
    lastName: lastname,
  });
  const avatarUrl = faker.image.avatar();
  const websiteUrl = faker.internet.url();
  const bio = faker.person.bio();
  const pwd = 'irish';
  users.push({
    firstname,
    lastname,
    username,
    email,
    avatarUrl,
    websiteUrl,
    bio,
    pwd,
  });
}

// Faker data for posts
const posts = [];
for (let i = 0; i < 10; i++) {
  const title = faker.word.words({ count: { min: 4, max: 6 } });
  const content = faker.lorem.paragraphs({ min: 10, max: 15 });
  const published = true;
  const authorId = Math.floor(Math.random() * 20) + 1;
  posts.push({ title, content, published, authorId });
}

// Faker data for comments
const comments = [];
for (let i = 0; i < 30; i++) {
  const content = faker.word.words({ count: { min: 10, max: 18 } });
  // random value between 1 and 20
  const ownerId = Math.floor(Math.random() * 20) + 1;
  // random value between 1 and 10
  const postId = Math.floor(Math.random() * 10) + 1;
  const published = true;
  const parentId = null;
  comments.push({ content, ownerId, postId, parentId, published });
}

// Create an admin user
async function createAdminPwd() {
  return await bcrypt.hash('irish', 10);
}

async function main() {
  const adminHashedPassword = await createAdminPwd();
  const adminUser = {
    data: {
      firstname: 'admin',
      lastname: 'admin',
      username: 'admin',
      email: 'admin@example.com',
      hashedPwd: adminHashedPassword,
      isAuthor: true,
      isAdmin: true,
    },
  };
  await prisma.user.create(adminUser);
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.pwd, 10);

    await prisma.user.create({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        websiteUrl: user.websiteUrl,
        hashedPwd: hashedPassword,
      },
    });
  }
  for (const post of posts) {
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        published: post.published,
        authorId: post.authorId,
      },
    });
  }
  for (const comment of comments) {
    await prisma.comment.create({
      data: {
        content: comment.content,
        ownerId: comment.ownerId,
        postId: comment.postId,
        parentId: comment.parentId,
        published: comment.published,
      },
    });
  }
}

main();
