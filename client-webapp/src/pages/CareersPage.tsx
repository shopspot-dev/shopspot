import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'New York, NY',
    type: 'Full-time',
    description: "We are looking for an experienced frontend developer to help build the next generation of our e-commerce platform."
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Join our product team to help shape the future of local commerce.'
  },
  {
    id: 3,
    title: 'Customer Success Manager',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help our merchants succeed by providing exceptional support and guidance.'
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us revolutionize local commerce and build stronger communities.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why ShopSpot?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Meaningful Impact</h3>
              <p className="text-gray-600">
                Your work directly helps local businesses and communities thrive.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">
                We invest in our team's development and provide clear career paths.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Great Benefits</h3>
              <p className="text-gray-600">
                Competitive salary, health insurance, unlimited PTO, and more.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h2>
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600 mt-1">{job.department}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.type}
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{job.description}</p>
                </div>
                <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}