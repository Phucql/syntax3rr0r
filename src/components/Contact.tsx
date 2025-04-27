import React, { useState } from 'react';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const { darkMode } = useTheme();
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', form);
    // Reset form
    setForm({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`p-6 max-w-2xl mx-auto ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        <div className="flex items-center gap-3 mb-8">
          <Mail className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Get In Touch</h1>
        </div>

        <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Have a question or want to learn more about our driver conversion analysis? Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Name</span>
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </div>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className={`w-full p-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Your message..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;