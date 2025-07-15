import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'The Future of Local Commerce',
    excerpt: 'Discover how digital transformation is reshaping local businesses and communities',
    author: 'Sarah Johnson',
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
    category: 'Industry Insights'
  },
  {
    id: 2,
    title: 'Supporting Small Businesses in the Digital Age',
    excerpt: 'Learn about the tools and strategies helping small businesses compete in todays market',
    author: 'Michael Chen',
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    category: 'Business Tips'
  },
  {
    id: 3,
    title: 'Building Sustainable Communities Through Local Shopping',
    excerpt: 'How supporting local businesses creates stronger, more resilient neighborhoods',
    author: 'Emma Davis',
    date: '2024-03-05',
    image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a',
    category: 'Community'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ShopSpot Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, updates, and stories from the world of local commerce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-green-600 mb-2">{post.category}</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <button className="mt-4 flex items-center text-green-600 hover:text-green-700">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}