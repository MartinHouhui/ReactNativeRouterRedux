import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Launch from './components/Launch';
import Register from './components/Register';
import Login from './components/Login';
import Login2 from './components/Login2';
import Login3 from './components/Login3';
import {
  Scene,
  Reducer,
  Switch,
  Modal,
  Actions,
  ActionConst,
  Router
} from 'react-native-router-flux';
import Error from './components/Error';
import Home from './components/Home';
import TabView from './components/TabView';
import TabIcon from './components/TabIcon';
import EchoView from './components/EchoView';
import NavigationDrawer from './components/NavigationDrawer';
import Button from 'react-native-button';
import createSagaMiddleware from 'redux-saga';
import SagaManager from './sagas/SagaManager';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';

const RouterWithRedux = connect()(Router);


const sagaMiddleware = createSagaMiddleware();


import reducers from './reducers';

const middleware = [sagaMiddleware];
const store = compose(
  applyMiddleware(...middleware)
)(createStore)(reducers);
SagaManager.startSagas(sagaMiddleware);
const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'transparent', justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#eee',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#ddd',
  },
});

// define this based on the styles/dimensions you use
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
};

let currentSwitchPage = 'text1';

const SwitcherPage = (props) => (
  <View>
    <Text style={{ marginTop: 100, textAlign: 'center' }}>current page: {props.text}</Text>
    <Button
      onPress={() => {
        currentSwitchPage = currentSwitchPage === 'text1' ? 'text2' : 'text1';
        Actions.refresh({ key: 'switcher' });
      } }
      >
      Switch!
    </Button>
    <Button
      onPress={() => {
        Actions.launch({ type: ActionConst.RESET });
      } }
      >
      Exit
    </Button>
  </View>
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux>
          <Scene key="modal" component={Modal} >
            <Scene key="root" hideNavBar hideTabBar>
              <Scene key="echo" clone component={EchoView} getTitle={(navState) => navState.key} />
              <Scene
                key="switcher"
                component={Switch}
                selector={() => { return 'text1'; } }
                >
                <Scene
                  key="text1"
                  text="text1"
                  component={(props) => <SwitcherPage
                    {...props}
                    text={currentSwitchPage}
                    />}
                  />
                <Scene
                  key="text2"
                  text="text2"
                  component={(props) => <SwitcherPage
                    {...props}
                    text={currentSwitchPage}
                    />}
                  />
              </Scene>
              <Scene key="register" component={Register} title="Register" />
              <Scene key="register2" component={Register} title="Register2" duration={1} />
              <Scene key="home" component={Home} title="Replace" type={ActionConst.REPLACE} />
              <Scene key="launch" component={Launch} title="Launch" initial />
              <Scene key="login" direction="vertical" >
                <Scene key="loginModal" direction="vertical" component={Login} title="Login" />
                <Scene
                  key="loginModal2"
                  hideNavBar
                  component={Login2}
                  title="Login2"
                  panHandlers={null}
                  duration={1}
                  />
                <Scene
                  key="loginModal3"
                  hideNavBar
                  component={Login3}
                  title="Login3"
                  panHandlers={null}
                  duration={1}
                  />
              </Scene>
              <Scene key="tabbar" component={NavigationDrawer}>
                <Scene
                  key="main"
                  tabs
                  tabBarStyle={styles.tabBarStyle}
                  tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                  >
                  <Scene
                    key="tab1"
                    title="Tab #1"
                    icon={TabIcon}
                    navigationBarStyle={{ backgroundColor: 'red' }}
                    titleStyle={{ color: 'white' }}
                    >
                    <Scene
                      key="tab1_1"
                      component={TabView}
                      title="Tab #1_1"
                      onRight={() => alert('Right button') }
                      rightTitle="Right"
                      />
                    <Scene
                      key="tab1_2"
                      component={TabView}
                      title="Tab #1_2"
                      titleStyle={{ color: 'black' }}
                      />
                  </Scene>
                  <Scene key="tab2" initial title="Tab #2" icon={TabIcon}>
                    <Scene
                      key="tab2_1"
                      component={TabView}
                      title="Tab #2_1"
                      renderRightButton={() => <Text>Right</Text>}
                      />
                    <Scene
                      key="tab2_2"
                      component={TabView}
                      title="Tab #2_2"
                      hideBackImage
                      onBack={() => alert('Left button!') }
                      backTitle="Left"
                      duration={1}
                      panHandlers={null}
                      />
                  </Scene>
                  <Scene key="tab3" component={TabView} title="Tab #3" hideTabBar icon={TabIcon} />
                  <Scene key="tab4" component={TabView} title="Tab #4" hideNavBar icon={TabIcon} />
                  <Scene key="tab5" component={TabView} title="Tab #5" hideTabBar icon={TabIcon} />
                </Scene>
              </Scene>
            </Scene>
            <Scene key="error" component={Error} />
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}

export default App;
