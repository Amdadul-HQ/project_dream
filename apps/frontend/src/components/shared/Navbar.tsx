"use client"
import React, { useState } from 'react';
import { Search, Plus, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const navItems = [
    'All', 'Horror', 'Islamic', 'Science', 'Mystery', 
    'Thriller', 'Adventure', 'Historical', 'Biography', 'Drama'
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">Obliq</span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <Button variant="ghost" size="sm" className="md:hidden p-2">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
                Log in
              </Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
                Sign up
              </Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">New post</span>
              </Button>
            </div>

            {/* User Avatar */}
            <Button variant="ghost" size="sm" className="p-1">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t border-gray-100">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 lg:space-x-8 py-3">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`text-sm font-medium transition-colors duration-200 py-2 px-1 border-b-2 ${
                  activeTab === item
                    ? 'text-white px-3 bg-accent rounded-md'
                    : 'text-tertiary border-transparent hover:border-gray-300'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                    activeTab === item
                      ? 'text-indigo-600 bg-brand'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
              
              {/* Mobile Actions */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                  Log in
                </Button>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Sign up
                </Button>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New post</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;