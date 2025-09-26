import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Router>
  );
};

export default App;