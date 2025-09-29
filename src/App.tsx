import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './pages/Home';
import Signup from './components/auth/Signup';
import SignIn from './components/auth/SignIn';
import ForgetPassword from './pages/ForgetPassword';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        {/* Auth routes without Header */}
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/login" exact component={SignIn} />
        <Route path="/forget-password" exact component={ForgetPassword} />
        
        {/* All other routes with Header */}
        <Route path="/" render={() => (
          <>
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
            </Switch>
          </>
        )} />
      </Switch>
    </Router>
  );
};

export default App;