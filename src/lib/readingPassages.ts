import type { CefrLevel } from './types'

export interface ReadingPassage {
  id: string
  title: string
  text: string
  level: CefrLevel
}

export const READING_PASSAGES: ReadingPassage[] = [
  // === A1 ===
  {
    id: 'a1-1',
    title: 'My Family',
    level: 'A1',
    text: 'My name is Maria. I have a big family. I have a mother and a father. I have two brothers and one sister. My mother is a teacher. My father is a doctor. We live in a small house. I love my family very much.',
  },
  {
    id: 'a1-2',
    title: 'My Day',
    level: 'A1',
    text: 'I wake up at seven in the morning. I eat breakfast with my family. I go to school by bus. I have lunch at twelve. After school I play with my friends. I go to bed at nine.',
  },
  {
    id: 'a1-3',
    title: 'The Park',
    level: 'A1',
    text: 'I like the park. There are many trees and flowers. I can see birds and dogs. Children play on the swings. I sit on a bench and read a book. The park is beautiful.',
  },
  {
    id: 'a1-4',
    title: 'Food I Like',
    level: 'A1',
    text: 'I like pizza and pasta. I also like fruit. My favorite fruit is an apple. I drink water and juice. I do not like fish. My mother cooks good food every day.',
  },
  {
    id: 'a1-5',
    title: 'My Pet',
    level: 'A1',
    text: 'I have a cat. Her name is Luna. She is white and small. She likes to sleep on my bed. I give her food and water. She is my best friend. I love Luna.',
  },
  {
    id: 'a1-6',
    title: 'At School',
    level: 'A1',
    text: 'I go to school every day. My teacher is very nice. I learn English and math. I sit next to my friend Carlos. We eat lunch together. School is fun.',
  },
  {
    id: 'a1-7',
    title: 'Colors',
    level: 'A1',
    text: 'The sky is blue. The grass is green. The sun is yellow. Roses are red. My shirt is white. I like all the colors. My favorite color is blue.',
  },

  // === A2 ===
  {
    id: 'a2-1',
    title: 'A Weekend Trip',
    level: 'A2',
    text: 'Last weekend my family went to the beach. We drove for two hours to get there. The weather was sunny and warm. I swam in the ocean and played volleyball with my brother. We ate fresh fish for lunch at a small restaurant. It was a wonderful day and I want to go back soon.',
  },
  {
    id: 'a2-2',
    title: 'My Best Friend',
    level: 'A2',
    text: 'My best friend is called Pedro. We have been friends since primary school. He is tall and has brown hair. Pedro is very funny and always makes me laugh. We like to play soccer together on Saturdays. He wants to be an engineer when he grows up.',
  },
  {
    id: 'a2-3',
    title: 'Shopping',
    level: 'A2',
    text: 'Yesterday I went shopping with my mother. We went to a big mall in the city center. I bought a new pair of shoes and a blue jacket. My mother bought some clothes too. After shopping we had ice cream at a cafe. It was chocolate flavor, my favorite.',
  },
  {
    id: 'a2-4',
    title: 'The Weather',
    level: 'A2',
    text: 'The weather changes a lot during the year. In summer it is very hot and sunny. I like to go swimming in summer. In winter it is cold and sometimes it rains. I wear a jacket and boots when it is cold. Spring is my favorite season because the flowers are beautiful.',
  },
  {
    id: 'a2-5',
    title: 'My Room',
    level: 'A2',
    text: 'My room is not very big but I like it. I have a bed, a desk, and a small bookshelf. There is a window with blue curtains. On my desk I have my computer and some books. I keep my room clean because I study there every day.',
  },
  {
    id: 'a2-6',
    title: 'Cooking',
    level: 'A2',
    text: 'I am learning to cook. Last week I made pasta with tomato sauce. First I boiled the water, then I added the pasta. I cut tomatoes and onions for the sauce. It was not perfect but it tasted good. My family said they liked it. I want to learn more recipes.',
  },
  {
    id: 'a2-7',
    title: 'A Birthday Party',
    level: 'A2',
    text: 'Last Saturday was my friend Ana birthday. She had a party at her house. There were about twenty people. We ate cake and danced to music. I gave her a book as a present because she loves reading. The party ended at ten and I walked home with my sister.',
  },

  // === B1 ===
  {
    id: 'b1-1',
    title: 'Learning a New Language',
    level: 'B1',
    text: 'Learning a new language takes time and patience. Many people start with great enthusiasm but give up after a few weeks. The key to success is practicing regularly, even if it is just fifteen minutes a day. Reading books, watching movies, and talking to native speakers are excellent ways to improve. Making mistakes is a natural part of the learning process, so do not be afraid to try.',
  },
  {
    id: 'b1-2',
    title: 'Technology and Daily Life',
    level: 'B1',
    text: 'Technology has changed the way we live in many important ways. We use smartphones to communicate, find information, and even pay for things. Social media allows us to stay connected with friends and family around the world. However, some people worry that we spend too much time looking at screens. It is important to find a healthy balance between technology and real life experiences.',
  },
  {
    id: 'b1-3',
    title: 'Exercise and Health',
    level: 'B1',
    text: 'Regular exercise is one of the best things you can do for your health. Doctors recommend at least thirty minutes of physical activity five days a week. This does not have to be intense exercise at a gym. Walking, swimming, or cycling are all great options. Exercise helps reduce stress, improves sleep quality, and can even make you feel happier because it releases chemicals in your brain.',
  },
  {
    id: 'b1-4',
    title: 'Travel and Culture',
    level: 'B1',
    text: 'Traveling to different countries is one of the most enriching experiences a person can have. When you visit a new place, you learn about different cultures, try new food, and see incredible landscapes. Even if you cannot travel far, exploring your own city can be surprising. Many people discover interesting places just a few kilometers from their home that they never knew existed.',
  },
  {
    id: 'b1-5',
    title: 'The Importance of Reading',
    level: 'B1',
    text: 'Reading is a habit that benefits people of all ages. Studies show that people who read regularly have better vocabulary and stronger communication skills. Reading fiction can help you understand other people emotions and perspectives. Whether you prefer physical books or digital versions, the important thing is to make reading part of your daily routine. Even twenty minutes before bed can make a big difference over time.',
  },
  {
    id: 'b1-6',
    title: 'Working from Home',
    level: 'B1',
    text: 'Since the pandemic, many companies now allow their employees to work from home. This arrangement has both advantages and disadvantages. On one hand, workers save time and money on transportation. They can also organize their schedule more freely. On the other hand, some people find it difficult to separate their work life from their personal life. Staying motivated without colleagues around can also be challenging.',
  },

  // === B2 ===
  {
    id: 'b2-1',
    title: 'Artificial Intelligence in Education',
    level: 'B2',
    text: 'Artificial intelligence is beginning to transform the education sector in remarkable ways. Personalized learning platforms can now adapt to each student individual strengths and weaknesses, providing tailored exercises and feedback in real time. While some educators worry that technology might replace teachers, most experts agree that the most effective approach combines human instruction with intelligent tools. The challenge lies in ensuring equal access to these technologies across different communities.',
  },
  {
    id: 'b2-2',
    title: 'Climate Change and Individual Action',
    level: 'B2',
    text: 'The debate around climate change often focuses on government policies and corporate responsibility, but individual actions also play a significant role. Simple changes in daily habits, such as reducing meat consumption, using public transportation, and minimizing waste, can collectively have a substantial impact. Critics argue that placing the burden on individuals distracts from the need for systemic change. Nevertheless, consumer choices influence market trends and can drive companies to adopt more sustainable practices.',
  },
  {
    id: 'b2-3',
    title: 'The Psychology of Habits',
    level: 'B2',
    text: 'Understanding how habits work can be a powerful tool for personal development. According to research, habits follow a cycle of cue, routine, and reward. The brain creates these patterns to conserve energy, which is why breaking bad habits can feel so difficult. Experts suggest that instead of trying to eliminate negative behaviors entirely, it is more effective to replace them with healthier alternatives while keeping the same triggers and rewards intact.',
  },
  {
    id: 'b2-4',
    title: 'Remote Work and Global Talent',
    level: 'B2',
    text: 'The rise of remote work has fundamentally altered the global job market. Companies are no longer restricted to hiring talent within their geographical region, which has created opportunities for skilled professionals in developing countries. However, this trend also introduces challenges such as navigating different time zones, cultural communication styles, and varying labor laws. Organizations that successfully manage these complexities often gain a significant competitive advantage through diverse perspectives and round the clock productivity.',
  },
  {
    id: 'b2-5',
    title: 'The Value of Critical Thinking',
    level: 'B2',
    text: 'In an era of information overload, critical thinking has become an essential skill. Every day we encounter countless claims, advertisements, and news stories that compete for our attention. The ability to evaluate sources, identify logical fallacies, and distinguish between fact and opinion is crucial for making informed decisions. Educational institutions worldwide are increasingly recognizing this need and incorporating critical thinking exercises into their curricula from an early age.',
  },
  {
    id: 'b2-6',
    title: 'Multilingualism and the Brain',
    level: 'B2',
    text: 'Research in neuroscience has revealed fascinating insights about the multilingual brain. People who speak more than one language tend to demonstrate greater cognitive flexibility, improved memory, and enhanced problem solving abilities. Bilingual individuals often switch between languages unconsciously, a process that strengthens executive function in the brain. Furthermore, studies suggest that maintaining multiple languages throughout life may delay the onset of cognitive decline in older adults by several years.',
  },
]

export function getPassagesForLevel(level: CefrLevel): ReadingPassage[] {
  return READING_PASSAGES.filter((p) => p.level === level)
}

export function getRandomPassage(level: CefrLevel): ReadingPassage {
  const passages = getPassagesForLevel(level)
  if (passages.length === 0) {
    // fallback to A2 if no passages for the level
    const fallback = READING_PASSAGES.filter((p) => p.level === 'A2')
    return fallback[Math.floor(Math.random() * fallback.length)]
  }
  return passages[Math.floor(Math.random() * passages.length)]
}
