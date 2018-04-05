import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import Enzyme from 'enzyme';
import { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TriggerView from './Components/TriggerView';

Enzyme.configure({ adapter: new Adapter() });

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

describe('<TriggerView />', () => {
  const tempProps = {
    isTriggered: true,
    id: 0,
    handleTriggerClick: jest.fn(),
    isSlicee: true
  };

  const wrapper = shallow(<TriggerView {...tempProps} />);

  it('has slicee class if trigger is a slicee', () => {
    expect(wrapper.find('.slicee').length).toBe(1);
  });
});
