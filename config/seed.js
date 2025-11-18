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
const sampleContent = `<p>Writing a blog post is a very personal thing. It takes quite a lot of words, too. This blog is all about lorem ipsum. And how ipsum we can lorem.</p>
<h2>This is a heading.</h2>
<p>Below the heading quo usque tandem abutere, Catilina, patientia nostra? Cras mattis iudicium purus sit amet fermentum. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Magna pars studiorum, prodita quaerimus. Gallia est omnis divisa in partes tres, quarum.</p>
<ul>
<li>We can bullet a list</li>
<li>And another one</li>
<li>Quisque ut dolor gravida, placerat libero vel, euismod.</li>
<li>Phasellus laoreet lorem vel dolor tempus vehicula.</li>
</ul>
<p>Or we can have numbers:</p>
<ol>
<li>This is the first</li>
<li>The second</li>
<li>The third</li>
</ol>
<h3><span style="color: #236fa1;">This is a smaller heading. That we made blue.</span></h3>
<p><span style="color: #000000;">And if we want, we can have a blockquote.</span></p>
<p style="padding-left: 40px;"><span style="color: #000000;">Like this one. Magna pars studiorum, prodita quaerimus. Curabitur blandit tempus ardua ridiculus sed magna. Phasellus laoreet lorem vel dolor tempus vehicula.</span></p>
<p><span style="color: #000000;">That's about it. Hope you enjoyed this sample blog post.</span></p>`;
for (let i = 0; i < 10; i++) {
  const title = faker.word.words({ count: { min: 4, max: 6 } });
  const content = sampleContent;
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
        bio: user.bio,
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
