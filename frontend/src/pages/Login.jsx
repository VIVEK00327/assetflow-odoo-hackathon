import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Switch between Login and Sign Up modes
  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    clearErrors();
    setValue('email', '');
    setValue('password', '');
    setValue('confirmPassword', '');
  };

  // Submit Handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        if (data.password !== data.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name: data.email.split('@')[0],
          email: data.email,
          password: data.password
        });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Account created! Logged in as Employee.');
        navigate('/dashboard');
      } else {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: data.email,
          password: data.password
        });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success(`Successfully logged in as ${user.role}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] overflow-hidden select-none">
      {/* Background glowing light elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

      {/* Main card matching the Excalidraw design structure */}
      <div className="w-full max-w-[420px] bg-gray-900/40 border-2 border-gray-800 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Card Header Box (AssetFlow - login / sign up) */}
        <div className="w-full bg-gray-950/60 border-b-2 border-gray-800 py-3.5 text-center">
          <span className="text-base font-extrabold tracking-wide uppercase text-white">
            AssetFlow – {isSignUp ? 'sign up' : 'login'}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 flex flex-col space-y-6 text-left">
          
          {/* Centered Circular Logo "AF" */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-gray-700 bg-gray-950/60 flex items-center justify-center shadow-lg shadow-black/35 font-bold text-xl text-white tracking-widest hover:border-violet-500/50 transition-colors duration-300">
              AF
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Email
              </label>
              <input
                type="text"
                placeholder="name@company.com"
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`w-full px-3.5 py-2 bg-gray-950/45 border rounded-xl text-sm text-gray-100 placeholder-gray-600 focus:outline-none transition-all ${
                  errors.email 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                    : 'border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 font-medium mt-0.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="**********"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={`w-full px-3.5 py-2 bg-gray-950/45 border rounded-xl text-sm text-gray-100 placeholder-gray-600 focus:outline-none transition-all ${
                  errors.password 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                    : 'border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20'
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-400 font-medium mt-0.5">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field (Only in Sign Up mode) */}
            {isSignUp && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="**********"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password'
                  })}
                  className={`w-full px-3.5 py-2 bg-gray-950/45 border rounded-xl text-sm text-gray-100 placeholder-gray-600 focus:outline-none transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                      : 'border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 font-medium mt-0.5">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}

            {/* Forgot Password Link (Align Bottom Right of Password - Only in Log In mode) */}
            {!isSignUp && (
              <div className="flex justify-end pt-0.5">
                <a 
                  href="#forgot" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    toast('Forgot password link dispatched to email.', { icon: '📧' }); 
                  }} 
                  className="text-xs font-medium text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Forgot password
                </a>
              </div>
            )}

            {/* Main Submit Action (Sign In or Register) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white font-semibold rounded-xl text-sm shadow-lg shadow-violet-600/15 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Horizontal Divider Line */}
          <div className="border-t-2 border-gray-800/80 my-2" />

          {/* New Here? / Sign Up Block */}
          {!isSignUp ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                New here?
              </h3>
              
              {/* Informative Note Card */}
              <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-3.5 text-xs text-gray-400 leading-normal text-center select-text">
                Sign up creates an employee account admin roles assigned later
              </div>

              {/* Create Account Toggle Button */}
              <button
                type="button"
                onClick={handleToggleMode}
                className="w-full py-2 border-2 border-gray-800 hover:border-gray-700 bg-transparent hover:bg-gray-850 text-gray-200 font-semibold rounded-xl text-sm transition-all cursor-pointer text-center"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-xs text-gray-400">
                Already have an account?
              </p>
              
              {/* Back to Login Button */}
              <button
                type="button"
                onClick={handleToggleMode}
                className="w-full py-2 border-2 border-gray-800 hover:border-gray-700 bg-transparent hover:bg-gray-850 text-gray-200 font-semibold rounded-xl text-sm transition-all cursor-pointer text-center"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
