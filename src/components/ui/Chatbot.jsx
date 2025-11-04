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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "../../contexts/ThemeContext";

// API configuration for Spring Boot backend
const API_BASE_URL = "http://localhost:8080"; // Your Spring Boot backend URL

const Chatbot = () => {
  const { theme } = useTheme();
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
    let sessionId = localStorage.getItem("axlexpert-chat-session");
    if (!sessionId) {
      sessionId =
        "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("axlexpert-chat-session", sessionId);
    }
    return sessionId;
  };

  // Function to load welcome message from backend
  const loadWelcomeMessage = async () => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(
        `${API_BASE_URL}/api/chat/welcome/${sessionId}`
      );

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
      console.error("Error loading welcome message:", error);
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
        timestamp: Date.now(),
      };

      // Make API call to your backend
      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatRequest),
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
      console.error("Error calling chatbot API:", error);
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
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
            width: 450,
            height: 600,
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
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
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
              sx={{
                color: theme.palette.primary.contrastText,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
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
              backgroundColor: theme.palette.background.default,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: theme.palette.background.paper,
              },
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.action.hover,
                borderRadius: "3px",
              },
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    maxWidth: "80%",
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor:
                        message.sender === "user"
                          ? theme.palette.primary.main
                          : theme.palette.success.main,
                    }}
                  >
                    {message.sender === "user" ? <PersonIcon /> : <BotIcon />}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      backgroundColor:
                        message.sender === "user"
                          ? theme.palette.primary.main
                          : theme.palette.background.paper,
                      color:
                        message.sender === "user"
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                      borderRadius: 2,
                      borderTopLeftRadius: message.sender === "user" ? 2 : 0.5,
                      borderTopRightRadius: message.sender === "user" ? 0.5 : 2,
                    }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <Typography
                            variant="caption"
                            sx={{ wordWrap: "break-word", lineHeight: 1.5 }}
                          >
                            {children}
                          </Typography>
                        ),
                        ul: ({ children }) => (
                          <Box
                            component="ul"
                            sx={{ pl: 2, m: 0, lineHeight: 1.5 }}
                          >
                            {children}
                          </Box>
                        ),
                        li: ({ children }) => (
                          <Typography
                            component="li"
                            variant="caption"
                            sx={{ lineHeight: 1.5 }}
                          >
                            {children}
                          </Typography>
                        ),
                        strong: ({ children }) => (
                          <Typography
                            component="strong"
                            variant="caption"
                            sx={{ fontWeight: "bold", lineHeight: 1.5 }}
                          >
                            {children}
                          </Typography>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        mt: 0.5,
                        display: "block",
                        color: theme.palette.text.secondary,
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
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: theme.palette.success.main,
                  }}
                >
                  <BotIcon />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    borderTopLeftRadius: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontStyle: "italic",
                      color: theme.palette.text.secondary,
                    }}
                  >
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
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
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
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  "&:disabled": {
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
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
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
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
