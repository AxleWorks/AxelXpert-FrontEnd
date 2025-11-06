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
import { getStoredAccessToken, getCurrentUser } from "../../utils/jwtUtils";

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
      const currentUser = getCurrentUser();
      const chatRequest = {
        type: "USER",
        content: inputMessage,
        sessionId: getSessionId(),
        timestamp: Date.now(),
        accessToken: getStoredAccessToken(),
        userId: currentUser?.id,
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
      {/* Backdrop Blur */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(8px)",
            zIndex: 1299,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={12}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 20,
            width: { xs: "90vw", sm: 450 },
            maxWidth: 450,
            height: { xs: "80vh", sm: 600 },
            maxHeight: "80vh",
            borderRadius: 4,
            overflow: "hidden",
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
            zIndex: 1300,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              "0 32px 64px -12px rgba(0, 17, 255, 0.35), 0 20px 32px -8px rgba(0, 0, 0, 0.25), 0 8px 16px -4px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.08)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: theme.palette.primary.contrastText,
              p: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${theme.palette.primary.main}20`,
              backdropFilter: "blur(10px)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <BotIcon sx={{ fontSize: 25 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="600"
                  sx={{ lineHeight: 1.2 }}
                >
                  Axi Assistant
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.8, fontSize: "0.75rem" }}
                >
                  Online • Ready to help
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleToggle}
              sx={{
                color: theme.palette.primary.contrastText,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  background: "rgba(255, 7, 7, 1)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
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
              p: 2,
              background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.02) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)`,
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.action.hover,
                borderRadius: "2px",
                "&:hover": {
                  background: theme.palette.action.selected,
                },
              },
              scrollbarWidth: "thin",
              scrollbarColor: `${theme.palette.action.hover} transparent`,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                  animation: "slideIn 0.3s ease-out",
                  "@keyframes slideIn": {
                    from: {
                      opacity: 0,
                      transform:
                        message.sender === "user"
                          ? "translateX(20px)"
                          : "translateX(-20px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    maxWidth: "85%",
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor:
                        message.sender === "user"
                          ? theme.palette.primary.main
                          : theme.palette.success.main,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      border: `2px solid ${theme.palette.background.paper}`,
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {message.sender === "user" ? (
                      <PersonIcon sx={{ fontSize: 25 }} />
                    ) : (
                      <BotIcon sx={{ fontSize: 25 }} />
                    )}
                  </Avatar>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor:
                        message.sender === "user"
                          ? "#1e40af"
                          : theme.palette.background.paper,
                      color:
                        message.sender === "user"
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                      borderRadius: 3,
                      borderTopLeftRadius: message.sender === "user" ? 3 : 8,
                      borderTopRightRadius: message.sender === "user" ? 8 : 3,
                      borderBottomLeftRadius: message.sender === "user" ? 3 : 3,
                      borderBottomRightRadius:
                        message.sender === "user" ? 3 : 3,
                      boxShadow:
                        message.sender === "user"
                          ? "0 4px 20px rgba(25, 118, 210, 0.25)"
                          : "0 2px 12px rgba(0, 0, 0, 0.08)",
                      border:
                        message.sender === "user"
                          ? "none"
                          : `1px solid ${theme.palette.divider}`,
                      backdropFilter: "blur(10px)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow:
                          message.sender === "user"
                            ? "0 6px 25px rgba(25, 118, 210, 0.35)"
                            : "0 4px 16px rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <Typography
                            variant="body2"
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
                            variant="body2"
                            sx={{ lineHeight: 1.5 }}
                          >
                            {children}
                          </Typography>
                        ),
                        strong: ({ children }) => (
                          <Typography
                            component="strong"
                            variant="body2"
                            sx={{ fontWeight: 600, lineHeight: 1.5 }}
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
                        fontSize: "0.8rem",
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
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: theme.palette.success.main,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                >
                  <BotIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 3,
                    borderTopLeftRadius: 8,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.divider}`,
                    backdropFilter: "blur(10px)",
                    minWidth: 80,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        color: theme.palette.text.secondary,
                        mr: 1,
                      }}
                    >
                      Typing
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.success.main,
                            animation: `bounce 1.4s ease-in-out ${
                              i * 0.16
                            }s infinite both`,
                            "@keyframes bounce": {
                              "0%, 80%, 100%": {
                                transform: "scale(0)",
                                opacity: 0.5,
                              },
                              "40%": {
                                transform: "scale(1)",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2.5,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              backdropFilter: "blur(10px)",
            }}
          >
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
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
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                    },
                    "&.Mui-focused": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 3px ${theme.palette.primary.main}30`,
                      background: theme.palette.background.paper,
                    },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "0.95rem",
                      lineHeight: 1.4,
                      padding: "12px 16px",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: inputMessage.trim()
                    ? theme.palette.primary.main
                    : theme.palette.action.disabledBackground,
                  color: inputMessage.trim()
                    ? theme.palette.primary.contrastText
                    : theme.palette.action.disabled,
                  borderRadius: 3,
                  boxShadow: inputMessage.trim()
                    ? "0 4px 12px rgba(25, 118, 210, 0.3)"
                    : "none",
                  backdropFilter: "blur(10px)",
                  border: inputMessage.trim()
                    ? "none"
                    : `1px solid ${theme.palette.divider}`,
                  transition: "all 0.2s ease",
                  "&:hover": inputMessage.trim()
                    ? {
                        backgroundColor: theme.palette.primary.dark,
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                      }
                    : {},
                  "&:disabled": {
                    transform: "none",
                  },
                }}
              >
                <SendIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Chat Toggle Button */}
      <Zoom in={!isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            borderRadius: "50%",
            overflow: "hidden",
            zIndex: 1300,
            display: isOpen ? "none" : "block",
            backgroundColor: theme.palette.primary.main,
            backdropFilter: "blur(20px)",
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            boxShadow:
              "0 8px 32px rgba(25, 118, 210, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "scale(1.05) translateY(-2px)",
              boxShadow:
                "0 12px 40px rgba(25, 118, 210, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)",
            },
            "&:active": {
              transform: "scale(0.98) translateY(0px)",
            },
          }}
        >
          <IconButton
            onClick={handleToggle}
            sx={{
              width: 64,
              height: 64,
              background: "transparent",
              color: theme.palette.primary.contrastText,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
              },
              transition: "background 0.2s ease",
            }}
          >
            <ChatIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Paper>
      </Zoom>
    </>
  );
};

export default Chatbot;
