import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="section-full bg-section-primary relative overflow-hidden">
        <div className="section-container py-24 lg:py-32">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Heading */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-8">
                <SparklesIcon className="w-5 h-5 mr-2" />
                AI-Powered Interview Preparation Platform
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8 leading-tight">
                Master Your
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"> Coding </span>
                Interviews
              </h1>
              <p className="text-xl lg:text-2xl text-muted max-w-4xl mx-auto mb-12 leading-relaxed">
                Generate personalized coding questions from 470+ top companies, chat with AI for instant help, 
                and track your progress with our comprehensive interview preparation platform.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                to="/practice-hub"
                className="group btn-gradient inline-flex items-center justify-center text-lg"
              >
                <CodeBracketIcon className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Practice Hub
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/generator"
                className="group inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-xl text-lg font-semibold hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <RocketLaunchIcon className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                AI Generator
              </Link>
              
              <Link
                to="/chat"
                className="group inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                Ask AI Assistant
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              { [
                { number: "470+", label: "Companies", color: "text-indigo-600" },
                { number: "AI", label: "Powered", color: "text-purple-600" },
                { number: "24/7", label: "Chat Support", color: "text-green-600" },
                { number: "∞", label: "Questions", color: "text-blue-600" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                  <div className="text-muted text-sm lg:text-base">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section - Full Width */}
      <section className="section-full bg-section-secondary py-24">
        <div className="section-container">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="heading-large mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Comprehensive tools and resources designed to help you excel in technical interviews
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-8">
              { [
                {
                  icon: CodeBracketIcon,
                  title: "Unified Practice Hub",
                  description: "Access AI-generated questions, scraped problems from top platforms, and curated coding sheets all in one place with advanced filtering.",
                  gradient: "from-indigo-400 to-indigo-600",
                  tags: ["AI + Web Scraping", "Unified Feed", "Smart Filters"],
                  tagColors: ["bg-indigo-100 text-indigo-700", "bg-cyan-100 text-cyan-700", "bg-blue-100 text-blue-700"]
                },
                {
                  icon: BuildingOfficeIcon,
                  title: "470+ Top Companies",
                  description: "Practice with real questions from Google, Meta, Amazon, Microsoft, Apple, and 465+ other leading tech companies.",
                  gradient: "from-orange-400 to-orange-600",
                  tags: ["Google", "Meta", "Amazon"],
                  tagColors: ["bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700", "bg-yellow-100 text-yellow-700"]
                },
                {
                  icon: SparklesIcon,
                  title: "AI-Powered Generation",
                  description: "Get personalized coding questions based on your preferences. Specify topics, difficulty, or let AI choose the best challenges for you.",
                  gradient: "from-purple-400 to-purple-600",
                  tags: ["Dynamic Programming", "System Design", "Algorithms"],
                  tagColors: ["bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700", "bg-indigo-100 text-indigo-700"]
                },
                {
                  icon: ChatBubbleLeftRightIcon,
                  title: "AI Coding Assistant",
                  description: "Chat with AI to get instant help with coding concepts, algorithm explanations, and step-by-step problem solutions.",
                  gradient: "from-green-400 to-green-600",
                  tags: ["Instant Help", "Solutions", "Explanations"],
                  tagColors: ["bg-green-100 text-green-700", "bg-teal-100 text-teal-700", "bg-emerald-100 text-emerald-700"]
                },
                {
                  icon: ChartBarIcon,
                  title: "Smart Progress Tracking",
                  description: "Track your progress with detailed analytics. Filter by difficulty, platform, and topic to focus on areas that need improvement.",
                  gradient: "from-blue-400 to-blue-600",
                  tags: ["Easy", "Medium", "Hard"],
                  tagColors: ["bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-red-100 text-red-700"]
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="card-modern card-interactive group p-8"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-section text-xl">{feature.title}</h3>
                  <p className="text-muted mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 ${feature.tagColors[tagIndex]} rounded-full text-sm font-medium`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <section className="section-full bg-section-accent py-24">
        <div className="section-container">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who have successfully prepared for their dream jobs
            </p>
            <Link
              to="/generator"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-2xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LightBulbIcon className="w-5 h-5 mr-2" />
              Start Practicing Now
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer - Full Width */}
      <footer className="section-full bg-gray-900 text-gray-300 py-16">
        <div className="section-container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/generator" className="hover:text-white transition-colors">AI Generator</Link></li>
                <li><Link to="/chat" className="hover:text-white transition-colors">AI Assistant</Link></li>
                <li><Link to="/companies" className="hover:text-white transition-colors">Companies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 Coding Practice Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;