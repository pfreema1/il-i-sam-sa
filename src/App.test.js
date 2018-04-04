import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import Enzyme from 'enzyme';
import { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Trigger } from './Containers/Trigger';

Enzyme.configure({ adapter: new Adapter() });

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

describe('<Trigger />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Trigger isSlicee={true} sequencers={{}} />);
  });

  it('has slicee class if isSlicee', () => {
    expect(wrapper.find('.slicee').length).toBe(1);
  });
});
