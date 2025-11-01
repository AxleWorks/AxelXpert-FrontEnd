import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  IconButton,
  Typography,
  TextField,
  Avatar,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// API configuration for Spring Boot backend
const API_BASE_URL = 'http://localhost:8080'; // Your Spring Boot backend URL

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // Initialize empty - will load from backend
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add this useEffect to load the welcome message when the chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadWelcomeMessage();
    }
  }, [isOpen]);

  // Session management function
  const getSessionId = () => {
    let sessionId = localStorage.getItem('axlexpert-chat-session');
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('axlexpert-chat-session', sessionId);
    }
    return sessionId;
  };

  // Function to load welcome message from backend
  const loadWelcomeMessage = async () => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`${API_BASE_URL}/api/chat/welcome/${sessionId}`);
      
      if (response.ok) {
        const welcomeData = await response.json();
        const welcomeMessage = {
          id: 1,
          text: welcomeData.content,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading welcome message:', error);
      // Fallback welcome message
      const fallbackWelcome = {
        id: 1,
        text: "Hello! I'm your AxleXpert assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([fallbackWelcome]);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Create the request payload matching your backend's ChatMessage DTO
      const chatRequest = {
        type: "USER",
        content: inputMessage,
        sessionId: getSessionId(),
        timestamp: Date.now()
      };

      // Make API call to your backend
      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const botResponseData = await response.json();
      
      const botResponse = {
        id: Date.now() + 1,
        text: botResponseData.content,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      // Fallback error message
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 20,
            width: 350,
            height: 500,
            borderRadius: 2,
            overflow: "hidden",
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
            zIndex: 1300,
            boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BotIcon />
              <Typography variant="h6" fontWeight="bold">
                AxleXpert Assistant
              </Typography>
            </Box>
            <IconButton
              onClick={handleToggle}
              sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 1,
              backgroundColor: "#f8f9fa",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#c1c1c1",
                borderRadius: "3px",
              },
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    maxWidth: "80%",
                    flexDirection: message.sender === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: message.sender === "user" ? "#1976d2" : "#4caf50",
                    }}
                  >
                    {message.sender === "user" ? <PersonIcon /> : <BotIcon />}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      backgroundColor: message.sender === "user" ? "#1976d2" : "white",
                      color: message.sender === "user" ? "white" : "black",
                      borderRadius: 2,
                      borderTopLeftRadius: message.sender === "user" ? 2 : 0.5,
                      borderTopRightRadius: message.sender === "user" ? 0.5 : 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ wordWrap: "break-word" }}>
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                        fontSize: "0.7rem",
                        mt: 0.5,
                        display: "block",
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 32, height: 32, backgroundColor: "#4caf50" }}>
                  <BotIcon />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    backgroundColor: "white",
                    borderRadius: 2,
                    borderTopLeftRadius: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.7 }}>
                    Typing...
                  </Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "white",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#f8f9fa",
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                  "&:disabled": {
                    backgroundColor: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Chat Toggle Button */}
      <Zoom in={!isOpen}>
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            borderRadius: "50%",
            overflow: "hidden",
            zIndex: 1300,
            display: isOpen ? "none" : "block",
          }}
        >
          <IconButton
            onClick={handleToggle}
            sx={{
              width: 60,
              height: 60,
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ChatIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Paper>
      </Zoom>
    </>
  );
};

export default Chatbot;