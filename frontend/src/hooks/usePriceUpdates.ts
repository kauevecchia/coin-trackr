"use client";

import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { authService } from '../services/auth.service';

interface UsePriceUpdatesReturn {
  isConnected: boolean;
  connectionError: string | null;
  lastUpdateTime: Date | null;
}

export const usePriceUpdates = (onPricesUpdated?: () => void): UsePriceUpdatesReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const { isAuthenticated } = useAuth();
  
  // grab token from authService
  const token = typeof window !== 'undefined' ? authService.getStoredToken() : null;

  const handlePriceUpdate = useCallback((data: { message: string; timestamp: string }) => {
    console.log('🔄 Crypto prices updated:', data.message);
    setLastUpdateTime(new Date());
    
    // call callback to reload data
    if (onPricesUpdated) {
      onPricesUpdated();
    }
  }, [onPricesUpdated]);

  useEffect(() => {
    console.log('🔍 Authentication check:', {
      isAuthenticated,
      hasToken: !!token,
      tokenValue: token ? `${token.substring(0, 20)}...` : 'null'
    });

    // only connect if authenticated
    if (!isAuthenticated || !token) {
      console.log('🔒 Not authenticated, skipping WebSocket connection', {
        isAuthenticated,
        hasToken: !!token
      });
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    
    console.log('🔌 Connecting to WebSocket server:', serverUrl);
    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.NEXT_PUBLIC_API_URL,
      hasToken: !!token,
      isAuthenticated
    });

    const newSocket = io(serverUrl, {
      transports: ['polling', 'websocket'],
      timeout: 20000,
      forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        token: token
      },
      extraHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });

    // connection events
    newSocket.on('connect', () => {
      console.log('🟢 WebSocket connected successfully');
      console.log('🔍 WebSocket connection details:', {
        id: newSocket.id,
        transport: newSocket.io.engine.transport.name,
        url: serverUrl
      });
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔴 WebSocket disconnected:', reason);
      console.log('🔍 Disconnect details:', {
        reason,
        id: newSocket.id
      });
      setIsConnected(false);
      
      if (reason !== 'io client disconnect') {
        setConnectionError(`Connection lost: ${reason}`);
      }
    });

    newSocket.on('connect_error', (error: Error & { description?: number; context?: unknown; type?: string }) => {
      console.error('❌ WebSocket connection error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        description: error.description || 'No description',
        context: error.context || 'No context',
        type: error.type || 'Unknown type'
      });
      
      let errorMessage = 'Connection failed';
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Backend server not running';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS configuration error';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Connection timeout';
      } else {
        errorMessage = `Connection failed: ${error.message}`;
      }
      
      setConnectionError(errorMessage);
      setIsConnected(false);
    });

    // main event: price update
    newSocket.on('crypto-prices-updated', handlePriceUpdate);

    // reconnection events
    newSocket.io.on('reconnect', (attemptNumber) => {
      console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.io.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 WebSocket reconnection attempt #', attemptNumber);
      setConnectionError(`Reconnecting... (attempt ${attemptNumber})`);
    });

    newSocket.io.on('reconnect_error', (error) => {
      console.error('❌ WebSocket reconnection error:', error);
      setConnectionError(`Reconnection failed: ${error.message}`);
    });

    newSocket.io.on('reconnect_failed', () => {
      console.error('❌ WebSocket reconnection failed after all attempts');
      setConnectionError('Connection failed - please refresh the page');
      setIsConnected(false);
    });

    // cleanup on component unmount
    return () => {
      console.log('🔌 Cleaning up WebSocket connection');
      newSocket.close();
    };
  }, [handlePriceUpdate, isAuthenticated, token]);

  return {
    isConnected,
    connectionError,
    lastUpdateTime,
  };
};