import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const books = [
  {
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    isbn: "9780307474728",
    genre: ["Fiction", "Magical Realism", "Novel"],
    description:
      "The saga of the Buendía family across seven generations in the mythical town of Macondo. A masterpiece of Latin American literature that blends the real and the fantastical in extraordinary ways.",
    publishedYear: 1967,
    totalCopies: 3,
    themes: ["Family", "Time", "Solitude", "History", "Magic"],
    readingLevel: "advanced",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "The Name of the Rose",
    author: "Umberto Eco",
    isbn: "9780156001311",
    genre: ["Mystery", "Historical Fiction", "Thriller"],
    description:
      "A murder investigation in a 14th-century Italian monastery. A novel that blends detective suspense with philosophical and linguistic reflections.",
    publishedYear: 1980,
    totalCopies: 2,
    themes: ["Religion", "Knowledge", "Mystery", "Middle Ages"],
    readingLevel: "advanced",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    genre: ["Non-fiction", "History", "Science"],
    description:
      "A sweeping history of humanity from the first humans to the modern era. Harari explores how Homo sapiens came to dominate the planet.",
    publishedYear: 2011,
    totalCopies: 4,
    themes: ["Evolution", "Civilization", "Human History", "Future"],
    readingLevel: "intermediate",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    isbn: "9780441013593",
    genre: ["Science Fiction", "Adventure", "Novel"],
    description:
      "On the desert planet Arrakis, young Paul Atreides must survive betrayal and rise as the messiah of the Fremen. An epic of politics, religion, and ecology.",
    publishedYear: 1965,
    totalCopies: 3,
    themes: ["Power", "Religion", "Ecology", "Destiny", "Politics"],
    readingLevel: "advanced",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    isbn: "9780156012195",
    genre: ["Fable", "Philosophy", "Children"],
    description:
      "A pilot stranded in the desert meets a little prince from another planet. A deceptively simple story hiding profound reflections on life, friendship, and what truly matters.",
    publishedYear: 1943,
    totalCopies: 5,
    themes: ["Friendship", "Love", "Childhood", "Philosophy", "Life"],
    readingLevel: "beginner",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: ["Dystopia", "Science Fiction", "Politics"],
    description:
      "In a totalitarian future where Big Brother watches everything, Winston Smith dares to question the system. A novel about surveillance, manipulation, and resistance.",
    publishedYear: 1949,
    totalCopies: 3,
    themes: ["Totalitarianism", "Freedom", "Surveillance", "Truth", "Resistance"],
    readingLevel: "intermediate",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    genre: ["Self-help", "Psychology", "Non-fiction"],
    description:
      "A practical guide to building good habits and breaking bad ones. Clear explains how tiny 1% changes can compound into remarkable results over time.",
    publishedYear: 2018,
    totalCopies: 4,
    themes: ["Productivity", "Psychology", "Change", "Habits", "Success"],
    readingLevel: "beginner",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    isbn: "9780465050659",
    genre: ["Design", "Psychology", "Non-fiction"],
    description:
      "Norman explains why some products frustrate us and others delight us. An essential classic on design psychology and user experience.",
    publishedYear: 1988,
    totalCopies: 2,
    themes: ["Design", "UX", "Psychology", "Technology", "Usability"],
    readingLevel: "intermediate",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    genre: ["Fiction", "Spiritual", "Adventure"],
    description:
      "Santiago, a young Andalusian shepherd, embarks on a journey to the Egyptian Pyramids following his Personal Legend. An allegory about following your dreams.",
    publishedYear: 1988,
    totalCopies: 4,
    themes: ["Dreams", "Spirituality", "Journey", "Destiny", "Self-discovery"],
    readingLevel: "beginner",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    genre: ["Programming", "Technology", "Non-fiction"],
    description:
      "A guide to writing clean, readable, and maintainable code. Martin shares principles, patterns, and practices every developer should know.",
    publishedYear: 2008,
    totalCopies: 3,
    themes: ["Programming", "Software", "Best Practices", "Code", "Engineering"],
    readingLevel: "advanced",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "9780374533557",
    genre: ["Psychology", "Economics", "Science"],
    description:
      "Kahneman explores the two systems of thought: the fast, intuitive one and the slow, deliberate one. A deep analysis of how we make decisions.",
    publishedYear: 2011,
    totalCopies: 2,
    themes: ["Psychology", "Decision Making", "Cognitive Bias", "Behavioral Economics"],
    readingLevel: "advanced",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Ficciones",
    author: "Jorge Luis Borges",
    isbn: "9780802130303",
    genre: ["Fiction", "Short Stories", "Latin American Literature"],
    description:
      "A collection of stories exploring labyrinths, mirrors, time, and reality. Masterworks of world literature that challenge the limits of perception.",
    publishedYear: 1944,
    totalCopies: 2,
    themes: ["Time", "Labyrinths", "Reality", "Philosophy", "Identity"],
    readingLevel: "advanced",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    isbn: "9780307474278",
    genre: ["Thriller", "Mystery", "Adventure"],
    description:
      "Professor Robert Langdon is drawn into a mystery involving murders, secret symbols, and the greatest secret in Christian history.",
    publishedYear: 2003,
    totalCopies: 3,
    themes: ["Conspiracy", "Art", "Religion", "Mystery", "History"],
    readingLevel: "intermediate",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    isbn: "9780439023481",
    genre: ["Dystopia", "Adventure", "Young Adult"],
    description:
      "In the dystopian future of Panem, young Katniss Everdeen is chosen to represent her district in the Hunger Games, where tributes fight to the death.",
    publishedYear: 2008,
    totalCopies: 4,
    themes: ["Survival", "Power", "Resistance", "Inequality", "Courage"],
    readingLevel: "beginner",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    isbn: "9780439708180",
    genre: ["Fantasy", "Adventure", "Young Adult"],
    description:
      "An orphaned boy discovers he is a wizard and enters Hogwarts School of Witchcraft and Wizardry. The beginning of a saga that has enchanted generations.",
    publishedYear: 1997,
    totalCopies: 5,
    themes: ["Magic", "Friendship", "Courage", "Identity", "Good vs Evil"],
    readingLevel: "beginner",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    isbn: "9780618640157",
    genre: ["Epic Fantasy", "Adventure", "Novel"],
    description:
      "The story of hobbit Frodo and his quest to destroy the One Ring in the fires of Mount Doom. The foundational work of modern fantasy literature.",
    publishedYear: 1954,
    totalCopies: 2,
    themes: ["Good vs Evil", "Friendship", "Power", "Heroism", "Sacrifice"],
    readingLevel: "advanced",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Educated",
    author: "Tara Westover",
    isbn: "9780399590504",
    genre: ["Memoir", "Non-fiction", "Autobiography"],
    description:
      "The memoir of a woman raised in a fundamentalist family in Idaho who never attended school but went on to earn a PhD from Cambridge University.",
    publishedYear: 2018,
    totalCopies: 2,
    themes: ["Education", "Family", "Identity", "Resilience", "Knowledge"],
    readingLevel: "intermediate",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    isbn: "9781590302255",
    genre: ["Philosophy", "Strategy", "Non-fiction"],
    description:
      "The world's oldest military treatise offers lessons on strategy, leadership, and conflict that remain relevant today in business, sports, and life.",
    publishedYear: -500,
    totalCopies: 3,
    themes: ["Strategy", "Leadership", "Conflict", "Philosophy", "Wisdom"],
    readingLevel: "intermediate",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    isbn: "9781455586691",
    genre: ["Productivity", "Self-help", "Non-fiction"],
    description:
      "Newport argues that the ability to focus without distraction on a cognitively demanding task is an increasingly valuable and increasingly rare skill.",
    publishedYear: 2016,
    totalCopies: 3,
    themes: ["Productivity", "Focus", "Technology", "Work", "Success"],
    readingLevel: "intermediate",
    language: "en",
    aiEnriched: true,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    genre: ["Romance", "Classic", "Drama"],
    description:
      "The witty Elizabeth Bennet navigates the social expectations of 19th-century England while sparring with the proud Mr. Darcy. A timeless love story.",
    publishedYear: 1813,
    totalCopies: 3,
    themes: ["Love", "Marriage", "Society", "Pride", "Social Class"],
    readingLevel: "intermediate",
    language: "en",
    aiEnriched: true,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.loan.deleteMany();
  await prisma.book.deleteMany();

  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  console.log(`✅ Created ${books.length} books`);
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
